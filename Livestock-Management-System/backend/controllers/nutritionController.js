const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { body, validationResult } = require('express-validator');
const Nutrition = require('../models/Nutrition');
const Animal = require('../models/Animal');

const ownershipFilter = (user) => user.role === 'admin' ? {} : { user: user.id };

exports.getNutritionRecords = asyncHandler(async (req, res) => {
  const nutritionRecords = await Nutrition.find(ownershipFilter(req.user)).populate('animal');

  res.status(200).json({
    success: true,
    count: nutritionRecords.length,
    data: nutritionRecords
  });
});

exports.getNutritionRecord = asyncHandler(async (req, res, next) => {
  const nutritionRecord = await Nutrition.findOne({
    _id: req.params.id,
    ...ownershipFilter(req.user)
  }).populate('animal');

  if (!nutritionRecord) {
    return next(new ErrorResponse(`Nutrition record not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: nutritionRecord });
});

exports.createNutritionRecord = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const animal = await Animal.exists({
    _id: req.body.animal,
    ...ownershipFilter(req.user)
  });
  if (!animal) {
    return next(new ErrorResponse('Animal not found or not accessible', 404));
  }

  const nutritionRecord = await Nutrition.create({ ...req.body, user: req.user.id });
  await nutritionRecord.populate('animal');
  res.status(201).json({ success: true, data: nutritionRecord });
});

exports.updateNutritionRecord = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const updates = { ...req.body };
  delete updates.user;
  if (updates.animal) {
    const animal = await Animal.exists({
      _id: updates.animal,
      ...ownershipFilter(req.user)
    });
    if (!animal) {
      return next(new ErrorResponse('Animal not found or not accessible', 404));
    }
  }

  const existingNutritionRecord = await Nutrition.findOne({
    _id: req.params.id,
    ...ownershipFilter(req.user)
  });
  if (!existingNutritionRecord) {
    return next(new ErrorResponse(`Nutrition record not found with id of ${req.params.id}`, 404));
  }

  const nutritionRecord = await Nutrition.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).populate('animal');

  if (!nutritionRecord) {
    return next(new ErrorResponse(`Nutrition record not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: nutritionRecord });
});

exports.deleteNutritionRecord = asyncHandler(async (req, res, next) => {
  const nutritionRecord = await Nutrition.findOneAndDelete({
    _id: req.params.id,
    ...ownershipFilter(req.user)
  });

  if (!nutritionRecord) {
    return next(new ErrorResponse(`Nutrition record not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: {} });
});

exports.validateNutritionRecord = [
  body('animal').notEmpty().withMessage('Animal is required'),
  body('feedType').notEmpty().withMessage('Feed type is required'),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('unit').isIn(['kg', 'lbs', 'grams', 'liters', 'ml']).withMessage('Unit must be kg, lbs, grams, liters, or ml'),
  body('frequency').isIn(['daily', 'weekly', 'monthly', 'as needed']).withMessage('Frequency must be daily, weekly, monthly, or as needed')
];
