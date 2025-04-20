// controllers/shelterStaffController.js
const ShelterStaff = require('../classes/ShelterStaff');
const staffService = new ShelterStaff();

exports.listPetForAdoption = async (req, res) => {
  try {
    const pet = await staffService.listPetForAdoption(req.params.shelterId, req.body);
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCapacity = async (req, res) => {
  try {
    const shelter = await staffService.updateCapacity(req.params.shelterId, req.body);
    res.status(200).json(shelter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
