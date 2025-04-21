// controllers/lostPetPostController.js
const LostPetPost = require('../models/LostPetPost');
const Pet = require('../models/Pet');
const PetStatus = require('../models/PetStatus');

exports.createLostPetPost = async (req, res) => {
  try {
    const body = req.body || {};

    const petId = body.petId;
    const lastSeenLocation = body.lastSeenLocation || '';
    const contactInfo = body.contactInfo || {};
    const photoUrl     = body.photoUrl     || '';
    const lostPet = await Pet.findById(petId);

    if (!lostPet) return res.status(404).json({ error: 'Pet not found' });


    if (!petId || !lastSeenLocation) {
      return res
        .status(400)
        .json({ error: 'petId and lastSeenLocation are required.' });
    }

    const owner = req.userId;
    if (!owner) {
      return res
        .status(401)
        .json({ error: 'Unauthorized: no userId in token.' });
    }


    const post = new LostPetPost({

      pet: petId,
      breed: lostPet.breed,
      owner,
      lastSeenLocation,
      contactInfo,
      photoUrl,

    });

    await post.save();
    await Pet.findByIdAndUpdate(petId, { status: PetStatus.LOST });
    return res.status(201).json(post);

  } catch (err) {
    console.error('🔥 Lost post error:', err);
    return res.status(400).json({ error: err.message });
  }
};

exports.getLostPets = async (req, res) => {
  try {
    const { location, breed, date } = req.query;

    const query = {};

    if (location) {
      query.lastSeenLocation = { $regex: location, $options: 'i' };
    }

    if (breed) query.breed = { $regex: breed, $options: 'i' };


    if (date) {
      query.reportedAt = { $gte: new Date(date) };
    }
    console.log('🧪 Incoming filters:', req.query);
    const posts = await LostPetPost.find(query).populate('pet'); // populate to get pet details
    res.status(200).json(posts);
  } catch (err) {
    console.error('❌ Error fetching filtered lost pets:', err);
    res.status(500).json({ error: 'Server error while fetching posts.' });
  }
};


exports.updateLostPetPost = async (req, res) => {
  try {
    const post = await LostPetPost.findById(req.params.id);
    if (!post) throw new Error('Post not found');
    await post.updatePost(req.body);
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAllLostPetPosts = async (req, res) => {
  try {
    const posts = await LostPetPost.find().populate('pet').populate('owner');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
