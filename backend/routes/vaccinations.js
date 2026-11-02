const express = require('express');
const {
  getVaccinations,
  getVaccination,
  createVaccination,
  updateVaccination,
  deleteVaccination,
  validateVaccination,
  getDueVaccinations
} = require('../controllers/vaccinationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getVaccinations)
  .post(protect, validateVaccination, createVaccination);

router.get('/due', protect, getDueVaccinations);

router
  .route('/:id')
  .get(protect, getVaccination)
  .put(protect, validateVaccination, updateVaccination)
  .delete(protect, deleteVaccination);

module.exports = router;