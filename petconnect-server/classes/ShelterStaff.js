// classes/ShelterStaff.js
const UserClass = require('./UserClass');
const Shelter = require('../models/Shelter');
const Pet = require('../models/Pet');
const AdoptionListing = require('../models/AdoptionListing');


class ShelterStaff extends UserClass {
  constructor() {
    super();
  }

  // 🔧 Update the entire shelter capacity object
  async updateCapacity(shelterId, newCapacity) {
    const shelter = await Shelter.findById(shelterId);
    if (!shelter) throw new Error('Shelter not found');

    shelter.capacity = {
      dogs: newCapacity.dogs ?? shelter.capacity.dogs,
      cats: newCapacity.cats ?? shelter.capacity.cats,
      currentDogs: newCapacity.currentDogs ?? shelter.capacity.currentDogs,
      currentCats: newCapacity.currentCats ?? shelter.capacity.currentCats
    };

    await shelter.save();
    return shelter;
  }

  // 📦 List pet for adoption (creates a pet and links it to the shelter)
  async listPetForAdoption(shelterId, petData) {
    const shelter = await Shelter.findById(shelterId);
    if (!shelter) throw new Error('Shelter not found');

    // Check if shelter is at capacity
    if (shelter.capacity.isAtCapacity()) {
      throw new Error('Shelter is at full capacity');
    }

    // Add pet
    const pet = new Pet({
      ...petData,
      shelterID: shelterId,
      status: 'AVAILABLE'
    });

    await pet.save();

    // Update current pet counts (assume species = 'dog' or 'cat')
    if (pet.species.toLowerCase() === 'dog') {
      shelter.capacity.currentDogs += 1;
    } else if (pet.species.toLowerCase() === 'cat') {
      shelter.capacity.currentCats += 1;
    }

    await shelter.save();
    return pet;
  }

  async createAdoptionListing(petId, contactInfo) {
  const listing = new AdoptionListing({
    pet: petId,
    contactInfo,
    status: 'AVAILABLE'
  });
  await listing.save();
  return listing;
}
}

module.exports = ShelterStaff;


