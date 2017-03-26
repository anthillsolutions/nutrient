'use strict';

const chai = require('chai');
const should = chai.should();
const server = require('../../server.js');

const request = require('supertest');
const mongoose = require('mongoose');

require('./index.js');

describe('API tests - products', () => {
  before(done => {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(process.env.MONGODB_URI, done);
  });

  it('should return 200 for /products', done => {
    request(server)
      .get('/products')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should fail to return non existing product', done => {
    var uri = '/products/'.concat('Twirl');
    request(server)
      .get(uri)
      .expect('Content-Type', /json/)
      .end((res) => {
        if (res && res.body) {
          res.body.should.be.a('object');
          res.body.should.have.property('error');
        }
        done();
      });
  });

  it('should delete existing product', done => {
    var uri = '/products/'.concat('Twirl');
    request(server)
      .delete(uri)
      .expect('Content-Type', /json/)
      .end((res) => {
        if (res && res.body) {
          res.body.should.be.a('object');
          res.body.should.have.property('error');
        }
        done();
      });
  });

  it('should fail to add an empty object as the product', done => {
    var product  = {
    };
    var uri = '/products';
    request(server)
      .post(uri)
      .send(product)
      .expect('Content-Type', /json/)
      .end((res) => {
        if (res && res.body) {
          res.body.should.be.a('object');
          res.body.should.have.property('error');
        }
        done();
      });
  });

  it('should fail to add new product with empty product name', done => {
    var product  = {
      productname: '',
      brand: 'Cadbury',
      amount: '100g',
      nutritionfacts: {
        calories: {
          fromCarbohydrates: '535kcal',
        },
      },
    };
    var uri = '/products';
    request(server)
      .post(uri)
      .send(product)
      .expect('Content-Type', /json/)
      .end((res) => {
        if (res && res.body) {
          res.body.should.be.a('object');
          res.body.should.have.property('error');
        }
        done();
      });
  });

  it('should fail to add the same product', done => {
    var product  = {
      productname: 'Twirl',
      brand: 'Cadbury',
      amount: '100g',
      nutritionfacts: {
        calories: {
          fromCarbohydrates: '535kcal',
        },
      },
    };
    request(server)
      .post('/products')
      .send(product)
      .expect('Content-Type', /json/)
      .then((res) => {
        request(server)
          .post('/products')
          .send(product)
          .expect('Content-Type', /json/)
          .then((res) => {
            if (res && res.body) {
              res.body.should.be.a('object');
              res.body.should.have.property('error');
            }
            var uri = '/products/'.concat(product.productname);
            request(server)
              .delete(uri)
              .expect('Content-Type', /json/)
              .end((res) => {
                if (res && res.body) {
                  res.body.should.be.a('object');
                  res.body.should.have.property('message');
                }
                done();
              });
          });
      });
  });

  it('should fail to update a non existing product', done => {
    var product  = {
      productname: 'Twirl',
      brand: 'Cadbury',
      amount: '100g',
      nutritionfacts: {
        calories: {
          fromCarbohydrates: '535kcal',
        },
      },
    };
    var uri = '/products/'.concat(product.productname);
    request(server)
      .put(uri)
      .send(product)
      .expect('Content-Type', /json/)
      .end((res) => {
        if (res && res.body) {
          res.body.should.be.a('object');
          res.body.should.have.property('error');
        }
        done();
      });
  });

  it('should fail to be updated with empty product name', done => {
    var product  = {
      productname: 'Twirl',
      brand: 'Cadbury',
      amount: '100g',
      nutritionfacts: {
        calories: {
          fromCarbohydrates: '535kcal',
        },
        protiens: {
          protien: '7.6g',
        },
      },
    };
    request(server)
      .post('/products')
      .send(product)
      .expect('Content-Type', /json/)
      .then((res) => {
        var uri = '/products/'.concat(product.productname);
        request(server)
          .get(uri)
          .expect('Content-Type', /json/)
          .end((res) => {
            if (res && res.body) {
              res.body.should.be.a('object');
            }
          });
        var updateProduct = {
          productname: '',
          brand: 'Cadbury',
          amount: '200g',
        };
        request(server)
          .put(uri)
          .send(updateProduct)
          .expect('Content-Type', /json/)
          .then((res) => {
            if (res && res.body) {
              res.body.should.be.a('object');
              res.body.should.have.property('error');
            }
            request(server)
              .delete(uri)
              .expect('Content-Type', /json/)
              .end((res) => {
                if (res && res.body) {
                  res.body.should.be.a('object');
                  res.body.should.have.property('message');
                }
                done();
              });
          });
      });
  });

  it('should fail to change product to empty object', done => {
    var product  = {
      productname: 'Twirl',
      brand: 'Cadbury',
      amount: '100g',
      nutritionfacts: {
        calories: {
          fromCarbohydrates: '535kcal',
        },
        protiens: {
          protien: '7.6g',
        },
      },
    };
    request(server)
      .post('/products')
      .send(product)
      .expect('Content-Type', /json/)
      .then((res) => {
        var uri = '/products/'.concat(res.body.productname);
        request(server)
          .get(uri)
          .expect('Content-Type', /json/)
          .end((res) => {
            if (res && res.body) {
              res.body.should.be.a('object');
            }
          });
        var updateProduct = {};
        request(server)
          .put(uri)
          .send(updateProduct)
          .expect('Content-Type', /json/)
          .then((res) => {
            if (res && res.body) {
              res.body.should.be.a('object');
              res.body.should.have.property('error');
            }
            request(server)
              .delete(uri)
              .expect('Content-Type', /json/)
              .end((res) => {
                if (res && res.body) {
                  res.body.should.be.a('object');
                  res.body.should.have.property('message');
                }
                done();
              });
          });
      });
  });

  it('should add/get/update/delete a product', done => {
    var product  = {
      productname: 'Twirl',
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
    request(server)
      .post('/products')
      .send(product)
      .expect('Content-Type', /json/)
      .then((res) => {
        var uri = '/products/'.concat(res.body.productname);
        request(server)
          .get(uri)
          .expect('Content-Type', /json/)
          .then((res) => {
            if (res && res.body) {
              res.body.should.be.a('object');
              var updateProduct = {
                productname: 'Twirl',
                brand: 'Cadbury',
                amount: '200g',
                nutritionfacts: {
                  carbohydrates: {
                    starch: '5g',
                  },
                  minerals: {
                  },
                  vitamins: {
                    vitaminK: '0.5g',
                  },
                },
              };
              request(server)
                .put(uri)
                .send(updateProduct)
                .expect('Content-Type', /json/)
                .then((res) => {
                  request(server)
                    .delete(uri)
                    .expect('Content-Type', /json/)
                    .end((res) => {
                      if (res && res.body) {
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                      }
                      done();
                    });
                });
            }
          });
      });
  });
});

after(done => {
  mongoose.connection.close(() => {
    done();
  });
});
