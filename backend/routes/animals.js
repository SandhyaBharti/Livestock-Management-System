const express = require('express');
const {
  getAnimals,
  getAnimal,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  validateAnimal,
  getSpeciesStats
} = require('../controllers/animalController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getAnimals)
  .post(protect, validateAnimal, createAnimal);

router.get('/stats/species', protect, getSpeciesStats);

router
  .route('/:id')
  .get(protect, getAnimal)
  .put(protect, validateAnimal, updateAnimal)
  .delete(protect, deleteAnimal);

module.exports = router;