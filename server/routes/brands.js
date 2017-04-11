'use strict';

const express = require('express');
const router = express.Router();
const Products = require('../models/Products.js');


/* GET list of brands */
router.get('/', (req, res, next) => {
  Products.find({}).distinct('brand',
    (err, doc) => {
      if (err) { return res.status(500).json({ error: err }); }
      console.log(doc);
      res.json(doc);
    });
});

module.exports = router;
