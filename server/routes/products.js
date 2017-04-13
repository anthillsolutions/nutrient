'use strict';

const express = require('express');
const router = express.Router();
const Products = require('../models/Products.js');
const merge = require('../utils/merge.js');

/* POST creates a product */
router.post('/', (req, res, next) => {
  var bodyParser = require('body-parser');
  router.use(bodyParser.json());

  var productDocument = req.body;

  // Check whether new product is empty
  if (Object.keys(productDocument).length === 0) {
    return res.json({ error: 'New product cannot be empty' });
  }
  // Check whether new product name is empty
  if (productDocument.hasOwnProperty('productname') &&
    productDocument.productname.length === 0) {
    return res.json({ error: 'New product name cannot be empty' });
  }

  var product = new Products();

  for (var attribute in productDocument) {
    if (productDocument[attribute]) {
      product[attribute] = productDocument[attribute];
    }
  }

  product.save(err => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({
      _id: product._id,
      productname: product.productname,
    });
  });
});

/* GET list of products */
router.get('/', (req, res, next) => {
  Products.find({},
    (err, doc) => {
      /* istanbul ignore if */
      if (err) { return res.status(500).json({ error: err }); }
      res.json(doc);
    });
});

/* PUT update an existing product */
router.put('/:productname', (req, res, next) => {
  var bodyParser = require('body-parser');
  router.use(bodyParser.json());

  var updatedProduct = req.body;
  var productName = req.params.productname;

  Products.findOne({productname: productName}, (err, product) => {
      if (product) {
        // Check whether updating product is empty
        if (Object.keys(updatedProduct).length === 0) {
          return res.json({ error: 'Update product cannot be empty' });
        }
        // Check whether updating product name is empty
        if (updatedProduct.hasOwnProperty('productname') &&
          updatedProduct.productname.length === 0) {
          return res.json({ error: 'Update product name cannot be empty' });
        }
        product = merge.mergeObjects(product, updatedProduct);
        product.save(err => {
          /* istanbul ignore if */
          if (err) {
            return res.status(500).json({ error: err });
          }
          res.json({message: 'Product details changed'});
        });
      } else {
        res.json({error: 'Product does not exist'});
      }
    });
});

/* DELETE remove a product */
router.delete('/:productname', (req, res, next) => {
  Products.findOneAndRemove({ productname: req.params.productname },
    (err, product) => {
      /* istanbul ignore if */
      if (err) { return res.status(500).json({ error: err }); }
      if (product) {
        res.json({
          message: 'Product ' + req.params.productname + ' has been removed.',
        });
      }else {
        res.json({error: 'Product does not exist'});
      }
    });
});

/* GET an exsiting product */
/* OR */
/* Search for products which matches the given search parameters */
router.get('/:query', (req, res, next) => {
  // Spliting the parameter string
  var queryParameters = req.params.query.split('&');

  var queryParametersLength = queryParameters.length;
  var product = new Products();

  // Retrieving attributes of the product schema
  var productAttributes = Object.keys(product.schema.paths);

  var productAttributesLength = productAttributes.length;
  var queryObject = {$and: []};
  var isQuery = false;
  var productName = null;

  // Opertor mappings
  var operators =
    {'<=': '$lte', '>=': '$gte', '=': '$eq', '<': '$lt', '>': '$gt'};

  for (var i = 0; i < queryParametersLength; i++) {
    // Splitting the param value pair based on the comparison operator
    var parameterNameValuePair = queryParameters[i].split(/<=|>=|=|<|>/);
    // Continue only if there's a pair
    if ((parameterNameValuePair.length === 2) &&
          (parameterNameValuePair[0])) {
      // Repeating count of the same attribute
      var attributeRepeatingCount = 0;
      // Checking whether the param is found in schema
      for (var j = 0; j < productAttributesLength; j++) {
        if (productAttributes[j] &&
          productAttributes[j].includes(parameterNameValuePair[0])) {
          attributeRepeatingCount++;
          // Regular expression to extract the comparison operator
          var regexp = new RegExp(parameterNameValuePair[0] +
                                  '(.*?)' +
                                  parameterNameValuePair[1]);
          // Determining comparison operator
          var operator = queryParameters[i].match(regexp)[1];
          isQuery = true;
          // Creating empty $or array
          if (attributeRepeatingCount === 1) {
            queryObject.$and.push(
              {
                $or: []
              }
            );
          }
          var lastAndStatementIndex = queryObject.$and.length - 1;
          // Adding comparison operator to the query
          queryObject.$and[lastAndStatementIndex].$or.push(
          {
            [productAttributes[j]]: // Product attribute
              {
                [operators[operator]]: parameterNameValuePair[1]
              },
          });
        }
      }
    } else {
      // If only one paramater is set - Expect produt name search
      if ((queryParametersLength === 1) &&
        (i === 0) &&
        (parameterNameValuePair.length === 1)) {
        productName = parameterNameValuePair[0];
        isQuery = false;
      } else {
        // If it is the first parameter include that in the query
        if (i === 0) {
          queryObject.$and.push(
            {
              $or: [{productname: parameterNameValuePair[0]}]
            }
          );
        } else {
          isQuery = false;
        }
      }
    }
  }
  // Execute query only if query params are set
  if (isQuery) {
    // Final query
    var query = Products.find(queryObject);
    query.exec((err, doc) => {
      /* istanbul ignore if */
      if (err) { return res.status(500).json({ error: err }); }
      res.json(doc);
    });
  } else {
    if (productName) {
      Products.findOne ({productname: productName},
        (err, doc) => {
          /* istanbul ignore if */
          if (err) { return res.status(500).json({ error: err }); }
          if (doc) {
            res.json(doc);
          } else {
            res.json({error: 'Product does not exist'});
          }
        });
    } else {
      res.json({error: 'Invalid search parameters'});
    }
  }
});

module.exports = router;
