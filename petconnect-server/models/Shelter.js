// models/Shelter.js
const mongoose = require('mongoose');
const shelterCapacitySchema = require('./ShelterCapacity');

const shelterSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  address: {
    type: String,
    required: true
  },
  capacity: { type: shelterCapacitySchema, required: true }
});

shelterSchema.methods.updateInformation = function (newInfo) {
  this.name = newInfo.name || this.name;
  this.address = newInfo.address || this.address;
  return this.save();
};

shelterSchema.methods.listAdoptablePets = async function () {
  const Pet = require('./Pet');
  return await Pet.find({ shelterID: this._id, status: 'AVAILABLE' });
};

module.exports = mongoose.model('Shelter', shelterSchema);
