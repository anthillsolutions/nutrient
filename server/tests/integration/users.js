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

  it('should add/get/update/delete a user', done => {
    var user = {
      username: 'Pierre',
      fullname: 'Pierre Jean Marcelino Repetto-Andipatin',
      email: 'pierre@anthillsolutions.ch',
      password: '1234abcd',
    };
    request(server)
      .post('/users')
      .send(user)
      .expect('Content-Type', /json/)
      .then((res) => {
        var uri = '/users/xxxx';
        request(server)
          .get(uri)
          .expect('Content-Type', /json/)
          .end((err, res)=> {
            res.status = 500;
          });

        uri = '/users/'.concat(res.body._id) ;
        request(server)
          .get(uri)
          .expect('Content-Type', /json/)
          .end((err, res)=> {
            res.body.should.be.a('object');
          });

        user = {
          username: 'Pierre',
          fullname: 'Pierre Jean Marcelino Repetto-Andipatin',
          email: 'pierre@anthillsolutions.ch',
          password: '1234abcd',
        };
        request(server)
          .put(uri)
          .send(user)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            res.body.should.be.a('object');
            res.body.message = 'User details unchanged';
          });

        user = {
          username: 'Pierre',
          fullname: 'Pierre Jean Marcelino Repetto-Andipatin',
          email: 'pierre@anthillsolutions.ch',
          password: 'qqqqqq',
        };
        request(server)
          .put(uri)
          .send(user)
          .expect('Content-Type', /json/)
          .then((res) => {
            request(server)
              .delete(uri)
              .expect('Content-Type', /json/)
              .end((err, res) => {
                res.body.should.be.a('object');
                done();
              });
          });
      });
  });

  it('should fail to add a wrong user', done => {
    const user = {
      pseudo: 'Pierre',
    };
    request(server)
      .post('/users')
      .send(user)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
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
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should fail to delete a wrong user', done => {
    request(server)
      .delete('/users/1234')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        res.status = 500;
        done();
      });
  });
});

after(done => {
  mongoose.connection.close(() => {
    done();
  });
});
