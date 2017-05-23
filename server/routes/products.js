'use strict';

const express = require('express');
const router = express.Router();
const Products = require('../models/Products.js');
const merge = require('../utils/merge.js');
const query = require('../utils/query.js');

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

/* Search for products which matches the given search parameters */
router.get('/', (req, res, next) => {
  let search = {};
  search = query.byProducts(req.query);
  Products.find(search,
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
router.get('/:product', (req, res, next) => {
  Products.findOne ({productname: req.params.product},
    (err, doc) => {
      /* istanbul ignore if */
      if (err) { return res.status(500).json({ error: err }); }
      if (doc) {
        res.json(doc);
      } else {
        res.json({error: 'Product does not exist'});
      }
    });
});

module.exports = router;
