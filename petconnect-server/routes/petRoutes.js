const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const petController = require('../controllers/petController');
const { authMiddleware } = require('../middleware/auth');


// POST /pets → create a new pet
router.post('/', authMiddleware, petController.createPet);

// GET  /pets/owner/:ownerId → list a user’s pets
router.get('/owner/:ownerId', authMiddleware, petController.getPetsByOwner);

module.exports = router;

module.exports = router;

