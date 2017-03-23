'use strict';

const express = require('express');
const router = express.Router();
const Users = require('../models/Users.js');

/* POST creates a user */
router.post('/', (req, res, next) => {
  var bodyParser = require('body-parser');
  router.use(bodyParser.json());
  var user = new Users({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
  });
  user.save(err => {
    if (err) {
      err.status = 500;
      return next(err);
    }
    res.json({
      _id: user._id,
    });
  });
});

/* GET list of users */
router.get('/', (req, res, next) => {
  Users.find({},
    (err, doc) => {
      /* istanbul ignore if */
      if (err) {
        err.status = 500;
        return next(err);
      }
      res.json(doc);
    });
});

/* GET an exsiting user by id */
router.get('/:id', (req, res, next) => {
  Users.findOne({_id: req.params.id},
    (err, doc) => {
      if (err) {
        err.status = 404;
        return next(err);
      }
      res.json(doc);
    });
});

/* PUT update an existing user */
router.put('/:id', (req, res, next) => {
  var bodyParser = require('body-parser');
  router.use(bodyParser.json());

  // Check if a user exists
  var userID = req.params.id;
  Users.findOne({_id: userID}, (err, doc) => {
      if (doc) {
        var modifiedDocument = req.body;
        Users.findOneAndUpdate({_id: userID}, modifiedDocument,
          {returnNewDocument: true},
          (err, doc) => {
            // Check if the original document is updated or not
            var updatedDocument = doc;
            var changed = false;
            for (var attribute in modifiedDocument) {
              if (updatedDocument[attribute] !==
                modifiedDocument[attribute]) {
                return res.json({message: 'User details changed'});
              }
            }
            res.json({message: 'User details unchanged'});
          });
      } else {
        const err = new Error('User does not exist');
        err.status = 500;
        next(err);
      }
    });
});

/* DELETE remove an user */
router.delete('/:id', (req, res, next) => {
  Users.remove({ _id: req.params.id }, err => {
    if (err) {
      err.status = 500;
      return next(err);
    }
    res.json({
      message: 'User #' + req.params.id + ' has been removed.',
    });
  });
});

module.exports = router;
