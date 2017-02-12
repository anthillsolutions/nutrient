'use strict';

var mongoose = require('mongoose');
var promise = require('bluebird');
mongoose.Promise = promise;
var Schema = mongoose.Schema;

var usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  fullname: String,
  email: String,
  password: String,
});

var Users = mongoose.model('Users', usersSchema);

module.exports = Users;
