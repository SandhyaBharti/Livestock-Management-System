const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { body, validationResult } = require('express-validator');
const { 
  findAllAnimals, 
  findAnimalById, 
  createAnimal, 
  updateAnimal, 
  deleteAnimal 
} = require('../utils/mockDB');

// @desc    Get all animals
// @route   GET /api/v1/animals
// @access  Private
exports.getAnimals = asyncHandler(async (req, res, next) => {
  const animals = findAllAnimals();

  res.status(200).json({
    success: true,
    count: animals.length,
    data: animals
  });
});

// @desc    Get single animal
// @route   GET /api/v1/animals/:id
// @access  Private
exports.getAnimal = asyncHandler(async (req, res, next) => {
  const animal = findAnimalById(parseInt(req.params.id));

  if (!animal) {
    return next(
      new ErrorResponse(`Animal not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: animal
  });
});

// @desc    Create new animal
// @route   POST /api/v1/animals
// @access  Private
exports.createAnimal = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const animal = createAnimal(req.body);

  res.status(201).json({
    success: true,
    data: animal
  });
});

// @desc    Update animal
// @route   PUT /api/v1/animals/:id
// @access  Private
exports.updateAnimal = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let animal = findAnimalById(parseInt(req.params.id));

  if (!animal) {
    return next(
      new ErrorResponse(`Animal not found with id of ${req.params.id}`, 404)
    );
  }

  animal = updateAnimal(parseInt(req.params.id), req.body);

  res.status(200).json({
    success: true,
    data: animal
  });
});

// @desc    Delete animal
// @route   DELETE /api/v1/animals/:id
// @access  Private
exports.deleteAnimal = asyncHandler(async (req, res, next) => {
  const animal = findAnimalById(parseInt(req.params.id));

  if (!animal) {
    return next(
      new ErrorResponse(`Animal not found with id of ${req.params.id}`, 404)
    );
  }

  deleteAnimal(parseInt(req.params.id));

  res.status(200).json({
    success: true,
    data: {}
  });
});

// Validation rules for creating/updating animal
exports.validateAnimal = [
  body('tagId').notEmpty().withMessage('Tag ID is required'),
  body('species').notEmpty().withMessage('Species is required'),
  body('breed').notEmpty().withMessage('Breed is required'),
  body('age').isNumeric().withMessage('Age must be a number'),
  body('owner').notEmpty().withMessage('Owner is required')
];