const express = require('express');
const {
  getVaccinations,
  getVaccination,
  createVaccination,
  updateVaccination,
  deleteVaccination,
  validateVaccination
} = require('../controllers/vaccinationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getVaccinations)
  .post(protect, authorize('admin'), validateVaccination, createVaccination);

router
  .route('/:id')
  .get(protect, getVaccination)
  .put(protect, authorize('admin'), validateVaccination, updateVaccination)
  .delete(protect, authorize('admin'), deleteVaccination);

module.exports = router;