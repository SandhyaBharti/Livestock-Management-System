const express = require('express');
const {
  getAnimals,
  getAnimal,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  validateAnimal
} = require('../controllers/animalController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getAnimals)
  .post(protect, authorize('admin'), validateAnimal, createAnimal);

router
  .route('/:id')
  .get(protect, getAnimal)
  .put(protect, authorize('admin'), validateAnimal, updateAnimal)
  .delete(protect, authorize('admin'), deleteAnimal);

module.exports = router;