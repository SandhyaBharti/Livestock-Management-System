const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { body, validationResult } = require('express-validator');
const { 
  findAllOwners, 
  findOwnerById, 
  createOwner, 
  updateOwner, 
  deleteOwner 
} = require('../utils/mockDB');

// @desc    Get all owners
// @route   GET /api/v1/owners
// @access  Private
exports.getOwners = asyncHandler(async (req, res, next) => {
  const owners = findAllOwners();

  res.status(200).json({
    success: true,
    count: owners.length,
    data: owners
  });
});

// @desc    Get single owner
// @route   GET /api/v1/owners/:id
// @access  Private
exports.getOwner = asyncHandler(async (req, res, next) => {
  const owner = findOwnerById(parseInt(req.params.id));

  if (!owner) {
    return next(
      new ErrorResponse(`Owner not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: owner
  });
});

// @desc    Create new owner
// @route   POST /api/v1/owners
// @access  Private
exports.createOwner = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const owner = createOwner(req.body);

  res.status(201).json({
    success: true,
    data: owner
  });
});

// @desc    Update owner
// @route   PUT /api/v1/owners/:id
// @access  Private
exports.updateOwner = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let owner = findOwnerById(parseInt(req.params.id));

  if (!owner) {
    return next(
      new ErrorResponse(`Owner not found with id of ${req.params.id}`, 404)
    );
  }

  owner = updateOwner(parseInt(req.params.id), req.body);

  res.status(200).json({
    success: true,
    data: owner
  });
});

// @desc    Delete owner
// @route   DELETE /api/v1/owners/:id
// @access  Private
exports.deleteOwner = asyncHandler(async (req, res, next) => {
  const owner = findOwnerById(parseInt(req.params.id));

  if (!owner) {
    return next(
      new ErrorResponse(`Owner not found with id of ${req.params.id}`, 404)
    );
  }

  deleteOwner(parseInt(req.params.id));

  res.status(200).json({
    success: true,
    data: {}
  });
});

// Validation rules for creating/updating owner
exports.validateOwner = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.zipCode').notEmpty().withMessage('Zip code is required'),
  body('address.country').notEmpty().withMessage('Country is required')
];