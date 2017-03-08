'use strict';

var mongoose = require('mongoose');
var promise = require('bluebird');
mongoose.Promise = promise;
var Schema = mongoose.Schema;

var productSchema = new mongoose.Schema({
  productname: {
    type: String,
    required: true,
    unique: true,
  },
  brand: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  nutritionfacts: {
    calories: {
      fromCarbohydrates: String,
      fromFat: String,
      fromProtien: String,
      fromAlcohol: String,
    },
    protiens: {
      protien: String,
    },
    carbohydrates: {
      dietaryFiber: String,
      starch: String,
      sugars: String,
    },
    vitamins: {
      vitaminA: String,
      vitaminC: String,
      vitaminD: String,
      vitaminE: String,
      vitaminK: String,
      thiamin: String,
      riboflavin: String,
      niacin: String,
      vitaminB6: String,
      folate: String,
      vitaminB12: String,
      pantothenicAcid: String,
      choline: String,
      betaine: String,
    },
    fats: {
      saturatedFat: String,
      monounsaturatedFat: String,
      polyunsaturatedFat: String,
      omega3: String,
      omega6: String,
    },
    minerals: {
      calcium: String,
      iron: String,
      magnesium: String,
      phosphorus: String,
      potassium: String,
      sodium: String,
      zinc: String,
      copper: String,
      manganese: String,
      selenium: String,
      fluoride: String,
    },
    sterols: {
      cholesterol: String,
      phytosterols: String,
    },
    other: {
      alcohol: String,
      water: String,
      ash: String,
      caffeine: String,
      theobromine: String,
    },
  },
});

var Products = mongoose.model('Products', productSchema);

module.exports = Products;
