'use strict';

const chai = require('chai');
const should = chai.should();
const server = require('../../server.js');

const request = require('supertest');

describe('API tests - index', () => {
  it('should return 200 for /', done => {
    request(server)
      .get('/')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        done();
      });
  });

  it('should return 404 for /404', done => {
    request(server)
      .get('/404')
      .end((err, res) => {
        res.status.should.equal(404);
        done();
      });
  });
});
