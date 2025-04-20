// routes/shelterStaff.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/shelterStaffController');

// Example endpoints:
router.post('/:shelterId/pets', controller.listPetForAdoption);
router.put('/:shelterId/capacity', controller.updateCapacity);

module.exports = router;
