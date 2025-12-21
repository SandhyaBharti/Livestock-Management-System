const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { body, validationResult } = require('express-validator');
const { 
  findAllVaccinations, 
  findVaccinationById, 
  createVaccination, 
  updateVaccination, 
  deleteVaccination 
} = require('../utils/mockDB');

// @desc    Get all vaccinations
// @route   GET /api/v1/vaccinations
// @access  Private
exports.getVaccinations = asyncHandler(async (req, res, next) => {
  const vaccinations = findAllVaccinations();

  res.status(200).json({
    success: true,
    count: vaccinations.length,
    data: vaccinations
  });
});

// @desc    Get single vaccination
// @route   GET /api/v1/vaccinations/:id
// @access  Private
exports.getVaccination = asyncHandler(async (req, res, next) => {
  const vaccination = findVaccinationById(parseInt(req.params.id));

  if (!vaccination) {
    return next(
      new ErrorResponse(`Vaccination not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: vaccination
  });
});

// @desc    Create new vaccination
// @route   POST /api/v1/vaccinations
// @access  Private
exports.createVaccination = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const vaccination = createVaccination(req.body);

  res.status(201).json({
    success: true,
    data: vaccination
  });
});

// @desc    Update vaccination
// @route   PUT /api/v1/vaccinations/:id
// @access  Private
exports.updateVaccination = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let vaccination = findVaccinationById(parseInt(req.params.id));

  if (!vaccination) {
    return next(
      new ErrorResponse(`Vaccination not found with id of ${req.params.id}`, 404)
    );
  }

  vaccination = updateVaccination(parseInt(req.params.id), req.body);

  res.status(200).json({
    success: true,
    data: vaccination
  });
});

// @desc    Delete vaccination
// @route   DELETE /api/v1/vaccinations/:id
// @access  Private
exports.deleteVaccination = asyncHandler(async (req, res, next) => {
  const vaccination = findVaccinationById(parseInt(req.params.id));

  if (!vaccination) {
    return next(
      new ErrorResponse(`Vaccination not found with id of ${req.params.id}`, 404)
    );
  }

  deleteVaccination(parseInt(req.params.id));

  res.status(200).json({
    success: true,
    data: {}
  });
});

// Validation rules for creating/updating vaccination
exports.validateVaccination = [
  body('animal').notEmpty().withMessage('Animal is required'),
  body('vaccineName').notEmpty().withMessage('Vaccine name is required'),
  body('vaccinationDate').isISO8601().withMessage('Vaccination date must be a valid date'),
  body('nextDueDate').isISO8601().withMessage('Next due date must be a valid date')
];