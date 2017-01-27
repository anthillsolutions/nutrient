'use strict';

const express = require('express');
const port = require('./utils/port.js');
require('dotenv').config({ silent: true });

const app = express();
const index = require('./routes/index.js');

/**
 * Routes for the API
 */
app.use(index);

/**
 * Catches Error 404
 */
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * Error catcher
 */
app.use((err, req, res, next) => {
  res.status(err.status);
  res.json({
    error: err.message
  });
});

module.exports = app;
