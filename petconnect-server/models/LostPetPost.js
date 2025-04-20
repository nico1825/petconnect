// models/LostPetPost.js
const mongoose = require('mongoose');

const lostPetPostSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  breed: {type: String, required: true},
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastSeenLocation: {type: String, required: true},
  status: {
    type: String,
    enum: ['LOST', 'FOUND'],
    default: 'LOST'
  },
  contactInfo: {
  phone: { type: String },
  email: { type: String }
  },
  photoUrl: { type: String },
  reportedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LostPetPost', lostPetPostSchema);
