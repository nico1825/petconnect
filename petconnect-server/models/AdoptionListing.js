// models/AdoptionListing.js
const mongoose = require('mongoose');

const adoptionListingSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  contactInfo: {
    phone: { type: String },
    email: { type: String }
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'ADOPTED'],
    default: 'AVAILABLE'
  },
  listedAt: {
    type: Date,
    default: Date.now
  }
});

adoptionListingSchema.methods.updateListing = function (newData) {
  if (newData.contactInfo) this.contactInfo = newData.contactInfo;
  if (newData.status) this.status = newData.status;
  return this.save();
};

module.exports = mongoose.model('AdoptionListing', adoptionListingSchema);
