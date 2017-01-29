'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new mongoose.Schema({
  username: String,
});

var Users = mongoose.model('Locations', usersSchema);

module.exports = Users;
