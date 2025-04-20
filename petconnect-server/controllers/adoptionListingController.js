// controllers/adoptionListingController.js
const AdoptionListing = require('../models/AdoptionListing');

exports.createAdoptionListing = async (req, res) => {
  try {
    const listing = new AdoptionListing({
      pet: req.body.petId,
      contactInfo: req.body.contactInfo,
      status: 'AVAILABLE'
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateAdoptionListing = async (req, res) => {
  try {
    const listing = await AdoptionListing.findById(req.params.id);
    if (!listing) throw new Error('Listing not found');
    await listing.updateListing(req.body);
    res.status(200).json(listing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllAdoptionListings = async (req, res) => {
  try {
    const listings = await AdoptionListing.find().populate('pet');
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
