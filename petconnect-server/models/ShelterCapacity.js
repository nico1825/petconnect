// models/ShelterCapacity.js
const mongoose = require('mongoose');

const shelterCapacitySchema = new mongoose.Schema({
  dogs: { type: Number, default: 0 },
  cats: { type: Number, default: 0 },
  currentDogs: { type: Number, default: 0 },
  currentCats: { type: Number, default: 0 }
});

shelterCapacitySchema.methods.isAtCapacity = function () {
  return (
    this.currentDogs >= this.dogs &&
    this.currentCats >= this.cats
  );
};

module.exports = shelterCapacitySchema; // Export as schema, not model
