'use strict';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('API tests', () => {
  var server;

  beforeEach(() => {
    server = require('../server.js');
  });

  afterEach(done => {
    server.close(done);
  });

  it('should return 200 for /', done => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        done();
      });
  });

  it('should return 404 for /404', done => {
    chai.request(server)
      .get('/404')
      .end((err, res) => {
        res.status.should.equal(404);
        done();
      });
  });
});
