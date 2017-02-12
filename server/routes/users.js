'use strict';

const express = require('express');
const router = express.Router();
const Users = require('../models/Users.js');

/* GET list of users */
router.get('/', function(req, res, next) {
  res.json({
    message: 'Welcome to Nutrient!'
  });
});

/* POST create an user */
router.post('/', function(req, res, next) {
  var user = new Users({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
  });
  user.save(function(err) {
    if (err) { return res.status(500).json({ error: err }); }
    res.json({
      message: 'user created',
    });
  });
});

/* PUT update an user */

/* DELETE remove an user */

module.exports = router;
