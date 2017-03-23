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
      return mongoose.connection.db.dropDatabase(done);
    }
    mongoose.connect(process.env.MONGODB_URI)
      .then(() => {
        mongoose.connection.db.dropDatabase(done);
      });
  });

  it('should return 200 for /users', done => {
    request(server)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should add/get/update/delete a user', done => {
    let user = {
      username: 'Pierre',
      fullname: 'Pierre Jean Marcelino Repetto-Andipatin',
      email: 'pierre@anthillsolutions.ch',
      password: '1234abcd',
    };
    let uri;
    request(server)
      .post('/users')
      .send(user)
      .expect('Content-Type', /json/)
      .then(res => {
        uri = '/users/'.concat(res.body._id);
        return request(server)
          .get(uri)
          .expect('Content-Type', /json/)
          .expect(200);
      })
      .then(res => {
        return request(server)
          .put(uri)
          .send(user)
          .expect('Content-Type', /json/)
          .expect(200, {
            message: 'User details unchanged',
          });
      })
      .then(res => {
        user = {
          username: 'Pierre',
          fullname: 'Pierre Jean Marcelino Repetto-Andipatin',
          email: 'pierre@anthillsolutions.ch',
          password: 'qqqqqq',
        };
        return request(server)
          .put(uri)
          .send(user)
          .expect('Content-Type', /json/)
          .expect(200);
      })
      .then(res => {
        res.body.should.be.a('object');
        return request(server)
          .delete(uri)
          .expect('Content-Type', /json/)
          .expect(200);
      })
      .then(res => {
        res.body.should.be.a('object');
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  it('should fail to get an inexistant user', done => {
    request(server)
      .get('/users/1209')
      .expect('Content-Type', /json/)
      .expect(
        404,
        done);
  });

  it('should fail to add a wrong user', done => {
    const user = {
      pseudo: 'Pierre',
    };
    request(server)
      .post('/users')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(500, done);
  });

  it('should fail to update a wrong user', done => {
    const user = {
      username: 'Pierre',
      fullname: 'Pierre Jean Marcelino Repetto-Andipatin',
      email: 'pierre@anthillsolutions.ch',
      password: 'abcd1234',
    };
    request(server)
      .put('/users/1234')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(500, done);
  });

  it('should fail to delete a wrong user', done => {
    request(server)
      .delete('/users/1234')
      .expect('Content-Type', /json/)
      .expect(500, done);
  });
});

after(done => {
  mongoose.connection.close(() => {
    done();
  });
});
