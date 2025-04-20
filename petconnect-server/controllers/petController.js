// controllers/petController.js
const Pet = require('../models/Pet');

exports.createPet = async (req, res) => {
  try {
    console.log('🐶 Create pet called by user:', req.userId);
    const { name, species, breed, status, age } = req.body;

    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const pet = new Pet({
      name,
      species,
      breed,
      status,
      age,
      owner: req.userId
    });

    await pet.save();
    console.log('✅ Pet created:', pet);
    res.status(201).json(pet);

  } catch (err) {
    console.error('🔥 Pet creation failed:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getPetsByOwner = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const pets = await Pet.find({ owner: ownerId });
    return res.status(200).json(pets);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
