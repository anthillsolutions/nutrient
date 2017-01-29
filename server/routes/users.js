'use strict';

const express = require('express');
const router = express.Router();

/* GET list of users */
router.get('/', function(req, res, next) {
  res.json({
    message: 'Welcome to Nutrient!'
  });
});

module.exports = router;
