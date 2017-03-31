'use strict';

const chai = require('chai');
const should = chai.should();
const server = require('../../server.js');
const mw = require('../../utils/tokens.js').getTokenMiddleware();

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

  it('should return 200 for /api/', done => {
    request(server)
      .get('/api/')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should return 404 for /api/404', done => {
    request(server)
      .get('/api/404')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should return 401 for /api/restricted with no token', done => {
    request(server)
      .get('/api/restricted')
      .expect(401, done);
  });

  it('should return 200 for /api/restricted with a token', done => {
    request(server)
      .get('/api/restricted')
      .set('Authorization', mw.getToken({ id: 'someID' }))
      .expect(200, done);
  });
});

after(done => {
  mongoose.connection.close(() => {
    done();
  });
});
