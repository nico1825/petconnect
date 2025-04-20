const express = require('express');
const router = express.Router();
const { register, login, updateProfile } = require('../controllers/authController');

router.post('/signup', register);
router.post('/login', login);
router.post('/update', updateProfile);

module.exports = router;
