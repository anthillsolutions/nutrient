'use strict';

const chai = require('chai');
const should = chai.should();
const merge = require('../../utils/merge.js');

describe('Unit tests - utils/merge', () => {
  describe('mergeObjects', () => {
    it('should have property', () => {
      merge.should.have.property('mergeObjects');
    });
    it('should return json', () => {
      var originalObj = {
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
      var updateObj = {
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
      var newObj = {
        productname: 'Twirl',
        brand: 'Cadbury',
        amount: '200g',
        nutritionfacts: {
          calories: {
            fromCarbohydrates: '535kcal',
          },
          protiens: {
            protien: '7.6g'
          },
          carbohydrates: {
            dietaryFiber: '0.8g',
            sugars: '56.0g',
            starch: '5g',
          },
          fats: {
            saturatedFat: '19.0g',
            monounsaturatedFat: '12.0g',
          },
          minerals: {
          },
          vitamins: {
            vitaminK: '0.5g',
          },
        },
      };
      merge.mergeObjects(originalObj, updateObj).should.eql(newObj);
    });
  });
});
