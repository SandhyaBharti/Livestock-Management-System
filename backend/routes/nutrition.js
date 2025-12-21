const express = require('express');
const {
  getNutritionRecords,
  getNutritionRecord,
  createNutritionRecord,
  updateNutritionRecord,
  deleteNutritionRecord,
  validateNutritionRecord
} = require('../controllers/nutritionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getNutritionRecords)
  .post(protect, authorize('admin'), validateNutritionRecord, createNutritionRecord);

router
  .route('/:id')
  .get(protect, getNutritionRecord)
  .put(protect, authorize('admin'), validateNutritionRecord, updateNutritionRecord)
  .delete(protect, authorize('admin'), deleteNutritionRecord);

module.exports = router;