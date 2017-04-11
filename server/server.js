'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const port = require('./utils/port.js');
require('dotenv').config({ silent: true });

const app = express();
const index = require('./routes/index.js');
const users = require('./routes/users.js');
const products = require('./routes/products.js');
const brands = require('./routes/brands.js');

app.use(bodyParser.json());

/**
 * Output current route
 */
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

/**
 * Routes for the API
 */
app.use('/api', index);
app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/brands', brands);

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
