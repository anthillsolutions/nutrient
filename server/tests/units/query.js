'use strict';

const chai = require('chai');
const should = chai.should();
const query = require('../../utils/query.js');

describe('Unit tests - utils/query', () => {
  describe('byProducts', () => {
    it('should have property', () => {
      query.should.have.property('byProducts');
    });
    it('should return {}', () => {
      let res = query.byProducts({});
      res.should.be.deep.equal({});
    });
    it('should return single number', () => {
      let res = query.byProducts({ calories: 500 });
      res.should.be.deep.equal({ calories: '500' });
    });
    it('should return left number', () => {
      let res = query.byProducts({ calories: '<500' });
      res.should.be.deep.equal({ calories: { $lt: '500' } });
    });
    it('should return left number', () => {
      let res = query.byProducts({ calories: '<=500' });
      res.should.be.deep.equal({ calories: { $lte: '500' } });
    });
    it('should return right number', () => {
      let res = query.byProducts({ calories: '>500' });
      res.should.be.deep.equal({ calories: { $gt: '500' } });
    });
    it('should return both numbers', () => {
      let res = query.byProducts({ calories: '<=500>900' });
      res.should.be.deep.equal({ calories: { $lte: '500', $gt: '900' } });
    });
    it('should return both numbers', () => {
      let res = query.byProducts({ calories: '<=500>=900<910' });
      res.should.be.deep.equal({ calories: { $lte: '500', $gte: '900' } });
    });
  });
});
