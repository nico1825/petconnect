// routes/adoptionListing.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/adoptionListingController');

router.post('/', controller.createAdoptionListing);
router.put('/:id', controller.updateAdoptionListing);
router.get('/', controller.getAllAdoptionListings);

module.exports = router;
