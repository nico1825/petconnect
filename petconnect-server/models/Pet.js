const mongoose = require('mongoose');
const PetStatus = require('./PetStatus');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: String,
  age: Number,
  photos:  [{ type: String }],
  status: {
    type: String,
    enum: Object.values(PetStatus),
    default: PetStatus.AVAILABLE
  },
  owner:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  shelterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shelter',
    required: false
  }
});

module.exports = mongoose.model('Pet', petSchema);
