'use strict';

const chai = require('chai');
const should = chai.should();
const tokens = require('../../utils/tokens.js');

describe('Unit tests - utils/tokens', () => {
  describe('getTokenMiddleware', () => {
    it('should have property', () => {
      tokens.should.have.property('getTokenMiddleware');
    });
    it('should return middleware', () => {
      tokens.getTokenMiddleware().should.have.property('getToken');
    });
    it('should return middleware (production)', () => {
      process.env.NODE_ENV = 'production';
      tokens.getTokenMiddleware().should.have.property('getToken');
      process.env.NODE_ENV = '';
    });
  });
});
