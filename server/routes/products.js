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
  var product = new Products();

  for (var attribute in productDocument) {
    if (productDocument[attribute] || productDocument[attribute].length) {
      product[attribute] = productDocument[attribute];
    }
  }

  product.save(err => {
    if (err) {
      console.log(err);
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
      if (err) { return res.status(500).json({ error: err }); }
      res.json(doc);
    });
});

/* GET an exsiting product by product name*/
router.get('/:productname', (req, res, next) => {
  Products.findOne ({productname: req.params.productname},
    (err, doc) => {
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
        if (Object.keys(updatedProduct).length === 0 &&
          updatedProduct.constructor === Object) {
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
            console.log(err);
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
  Products.remove({ productname: req.params.productname }, err => {
    if (err) { return res.status(500).json({ error: err }); }
    res.json({
      message: 'Product ' + req.params.productname + ' has been removed.',
    });
  });
});

module.exports = router;
