// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name:     { type: String },
  location: { type: String },
  role: {
    type: String,
    enum: ['PetOwner', 'ShelterStaff'],
    default: 'PetOwner'
  }
});

module.exports = mongoose.model('User', userSchema);

