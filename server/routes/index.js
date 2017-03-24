'use strict';

const express = require('express');
const mw = require('../utils/tokens.js').getTokenMiddleware();
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({
    message: 'Welcome to Nutrient!'
  });
});

/* GET restricted page */
router.get('/restricted', mw, (req, res, next) => {
  res.json({
    message: 'Access allowed',
  });
});

module.exports = router;
