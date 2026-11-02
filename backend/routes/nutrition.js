const express = require('express');
const {
  getNutritionRecords,
  getNutritionRecord,
  createNutritionRecord,
  updateNutritionRecord,
  deleteNutritionRecord,
  validateNutritionRecord
} = require('../controllers/nutritionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getNutritionRecords)
  .post(protect, validateNutritionRecord, createNutritionRecord);

router
  .route('/:id')
  .get(protect, getNutritionRecord)
  .put(protect, validateNutritionRecord, updateNutritionRecord)
  .delete(protect, deleteNutritionRecord);

module.exports = router;