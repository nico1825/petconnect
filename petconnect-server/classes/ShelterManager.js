// classes/ShelterManager.js
const Shelter = require('../models/Shelter');

class ShelterManager {
  async updateShelterInfo(shelterId, updates) {
    const shelter = await Shelter.findById(shelterId);
    if (!shelter) throw new Error('Shelter not found');
    return await shelter.updateInformation(updates);
  }

  async listAdoptablePets(shelterId) {
    const shelter = await Shelter.findById(shelterId);
    if (!shelter) throw new Error('Shelter not found');
    return await shelter.listAdoptablePets();
  }

  async isAtCapacity(shelterId) {
    const shelter = await Shelter.findById(shelterId);
    if (!shelter) throw new Error('Shelter not found');
    return shelter.capacity.isAtCapacity();
  }
}

module.exports = ShelterManager;
