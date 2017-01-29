'use strict';

const chai = require('chai');
const should = chai.should();
const server = require('../../server.js');

const request = require('supertest');
const mongoose = require('mongoose');

require('../units/port.js');

describe('API tests - index', () => {
  before(done => {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(process.env.MONGODB_URI, done);
  });

  it('should return 200 for /', done => {
    request(server)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should return 404 for /404', done => {
    request(server)
      .get('/404')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});

after(done => {
  mongoose.connection.close(() => {
    done();
  });
});
