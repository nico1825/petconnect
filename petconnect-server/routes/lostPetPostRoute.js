// routes/lostPetRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const lostPetPostController = require ('../controllers/lostPetPostController');

// Protect this endpoint — authMiddleware must run *before* your controller
router.post('/', authMiddleware, lostPetPostController.createLostPetPost);

router.get('/', lostPetPostController.getAllLostPetPosts);

router.get('/search', lostPetPostController.getLostPets);

router.get('/', lostPetPostController.updateLostPetPost);

module.exports = router;
