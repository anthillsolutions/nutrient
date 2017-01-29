'use strict';

const chai = require('chai');
const should = chai.should();
const server = require('../../server.js');

const request = require('supertest');
const mongoose = require('mongoose');

require('./index.js');

describe('API tests - users', () => {
  before(done => {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(process.env.MONGODB_URI, done);
  });

  it('should return 200 for /users', done => {
    request(server)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

after(done => {
  mongoose.connection.close(() => {
    done();
  });
});
