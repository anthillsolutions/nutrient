'use strict';

const chai = require('chai');
const should = chai.should();
const server = require('../../server.js');

const request = require('supertest');
const mongoose = require('mongoose');

require('./index.js');

describe('API tests - brands', () => {
    before(done => {
      if (mongoose.connection.db) {
        return done();
      }

      mongoose.connect(process.env.MONGODB_URI, done);
    });

    it('should add products and get the brands', done => {
      var product1  = {
        productname: 'Twirl1',
        brand: 'Cadbury',
        amount: '100g',
        nutritionfacts: {
          calories: {
            fromCarbohydrates: '535kcal',
          },
          protiens: {
            protien: '7.6g',
          },
          carbohydrates: {
            dietaryFiber: '0.8g',
            sugars: '56.0g',
          },
          fats: {
            saturatedFat: '19.0g',
            monounsaturatedFat: '12.0g',
          },
          minerals: {
            sodium: '0.25g',
          },
        },
      };

      var product2  = {
        productname: 'Kitkat',
        brand: 'Nestle',
        amount: '100g',
        nutritionfacts: {
          calories: {
            fromCarbohydrates: '125kcal',
          },
          protiens: {
            protien: '150g',
          },
          carbohydrates: {
            dietaryFiber: '0.8g',
            sugars: '56.0g',
          },
          fats: {
            saturatedFat: '19.0g',
            monounsaturatedFat: '12.0g',
          },
          minerals: {
            sodium: '0.25g',
          },
        },
      };

      var uri1 = '/api/products/'.concat(product1.productname);
      var uri2 = '/api/products/'.concat(product2.productname);
      request(server)
        .post('/api/products')
        .send(product1)
        .expect('Content-Type', /json/)
        .then((res) => {
          request(server)
            .post('/api/products')
            .send(product2)
            .expect('Content-Type', /json/)
            .then((res) => {
              request(server)
                .get('/api/brands')
                .expect('Content-Type', /json/)
                .then((res) => {
                  if (res && res.body) {
                    res.body.should.be.a('array');
                  }
                  request(server)
                    .delete(uri1)
                    .expect('Content-Type', /json/)
                    .then((res) => {
                      request(server)
                        .delete(uri2)
                        .expect('Content-Type', /json/)
                        .end((res) => {
                          done();
                        });
                    });
                });
            });
        });
    });
  });

after(done => {
  mongoose.connection.close(() => {
    done();
  });

});
