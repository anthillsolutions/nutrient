'use strict';

const express = require('express');
const router = express.Router();
const Users = require('../models/Users.js');

/* GET list of users */
router.get('/', (req, res, next) => {
  res.json({
    message: 'Welcome to Nutrient!'
  });
});

/* POST create an user */
router.post('/', (req, res, next) => {
  var user = new Users({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
  });
  user.save(err => {
    if (err) { return res.status(500).json({ error: err }); }
    res.json({
      message: 'user created',
    });
  });
});

/* PUT update an user */
router.put('/:id', (req, res, next) => {
  Users.findByIdAndUpdate(req.params.id, req.body,
    (err, doc) => {
      if (err) { return res.status(500).json({ error: err }); }
      res.json({
        message: 'user updated',
      });
    });
});

/* DELETE remove an user */
router.delete('/:id', (req, res, next) => {
  Users.remove({ _id: req.params.id }, err => {
    if (err) { return res.status(500).json({ error: err }); }
    res.json({
      message: 'user #' + req.params.id + ' has been removed.',
    });
  });
});

module.exports = router;
