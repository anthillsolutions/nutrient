'use strict';

var express = require('express');
var dotenv = require('dotenv');
dotenv.config({silent: true});

var app = express();
var PORT = process.env.PORT || 3000;
var index = require('./routes/index.js');

app.use(index);

var server = app.listen(PORT, () => {
  console.log('app listening on port ' + PORT + '!');
});

module.exports = server;
