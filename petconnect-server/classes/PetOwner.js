// classes/PetOwner.js
const UserClass = require('./UserClass');
const Pet = require('../models/Pet');
const LostPetPost = require('../models/LostPetPost');
const PetStatus = require('../models/PetStatus');


class PetOwner extends UserClass {
  async createPetProfile(ownerId, petData) {
    const pet = new Pet({ ...petData, owner: ownerId });
    await pet.save();
    return pet;
  }

  async reportLostPet(petId) {
    return await Pet.findByIdAndUpdate(petId, { status: PetStatus.LOST }, { new: true });
  }

  async getOwnedPets(ownerId) {
    return await Pet.find({ owner: ownerId });
  }

  async reportLostPet(ownerId, petId, location) {
    const post = new LostPetPost({
      owner: ownerId,
      pet: petId,
      lastSeenLocation: location,
      status: 'LOST'
    });
    await post.save();
    return post;
  }

}

module.exports = PetOwner;
