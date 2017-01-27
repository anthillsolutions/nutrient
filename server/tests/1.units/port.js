'use strict';

const chai = require('chai');
const should = chai.should();
const port = require('../../utils/port.js');

describe('Unit tests - utils/port', () => {
  describe('getNormalizedPort', () => {
    it('should have property', () => {
      port.should.have.property('getNormalizedPort');
    });
    it('should return 3000', () => {
      port.getNormalizedPort().should.equals(3000);
    });
    it('should return 3000', () => {
      port.getNormalizedPort(-12).should.equals(3000);
    });
    it('should return 3000', () => {
      port.getNormalizedPort('sa').should.equals(3000);
    });
    it('should return 5000', () => {
      port.getNormalizedPort(5000).should.equals(5000);
    });
  });
});
