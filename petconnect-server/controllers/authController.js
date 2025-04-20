// controllers/authController.js
const UserClass = require('../classes/UserClass');
const User = require('../models/User');
const userService = new UserClass();
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = new User({ name, email, password, role, location });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
        process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.status(201).json({ message: 'User created', user, token });

  } catch (err) {
    console.error('Signup error:', err);
    return res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
  { userId: user._id },
   process.env.JWT_SECRET,
  { expiresIn: '7d' }
    );

    res.status(200).json({ user, token });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(req.params.id, req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

