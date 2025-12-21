const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { body, validationResult } = require('express-validator');
const { 
  findAllNutritionRecords, 
  findNutritionRecordById, 
  createNutritionRecord, 
  updateNutritionRecord, 
  deleteNutritionRecord 
} = require('../utils/mockDB');

// @desc    Get all nutrition records
// @route   GET /api/v1/nutrition
// @access  Private
exports.getNutritionRecords = asyncHandler(async (req, res, next) => {
  const nutritionRecords = findAllNutritionRecords();

  res.status(200).json({
    success: true,
    count: nutritionRecords.length,
    data: nutritionRecords
  });
});

// @desc    Get single nutrition record
// @route   GET /api/v1/nutrition/:id
// @access  Private
exports.getNutritionRecord = asyncHandler(async (req, res, next) => {
  const nutritionRecord = findNutritionRecordById(parseInt(req.params.id));

  if (!nutritionRecord) {
    return next(
      new ErrorResponse(`Nutrition record not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: nutritionRecord
  });
});

// @desc    Create new nutrition record
// @route   POST /api/v1/nutrition
// @access  Private
exports.createNutritionRecord = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const nutritionRecord = createNutritionRecord(req.body);

  res.status(201).json({
    success: true,
    data: nutritionRecord
  });
});

// @desc    Update nutrition record
// @route   PUT /api/v1/nutrition/:id
// @access  Private
exports.updateNutritionRecord = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let nutritionRecord = findNutritionRecordById(parseInt(req.params.id));

  if (!nutritionRecord) {
    return next(
      new ErrorResponse(`Nutrition record not found with id of ${req.params.id}`, 404)
    );
  }

  nutritionRecord = updateNutritionRecord(parseInt(req.params.id), req.body);

  res.status(200).json({
    success: true,
    data: nutritionRecord
  });
});

// @desc    Delete nutrition record
// @route   DELETE /api/v1/nutrition/:id
// @access  Private
exports.deleteNutritionRecord = asyncHandler(async (req, res, next) => {
  const nutritionRecord = findNutritionRecordById(parseInt(req.params.id));

  if (!nutritionRecord) {
    return next(
      new ErrorResponse(`Nutrition record not found with id of ${req.params.id}`, 404)
    );
  }

  deleteNutritionRecord(parseInt(req.params.id));

  res.status(200).json({
    success: true,
    data: {}
  });
});

// Validation rules for creating/updating nutrition record
exports.validateNutritionRecord = [
  body('animal').notEmpty().withMessage('Animal is required'),
  body('feedType').notEmpty().withMessage('Feed type is required'),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('unit').isIn(['kg', 'lbs', 'grams', 'liters', 'ml']).withMessage('Unit must be kg, lbs, grams, liters, or ml'),
  body('frequency').isIn(['daily', 'weekly', 'monthly', 'as needed']).withMessage('Frequency must be daily, weekly, monthly, or as needed')
];