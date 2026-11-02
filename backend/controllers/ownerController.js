const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { body, validationResult } = require('express-validator');
const Owner = require('../models/Owner');
const Animal = require('../models/Animal');

const ownershipFilter = (user) => user.role === 'admin' ? {} : { user: user.id };

exports.getOwners = asyncHandler(async (req, res) => {
  const owners = await Owner.find(ownershipFilter(req.user));

  res.status(200).json({
    success: true,
    count: owners.length,
    data: owners
  });
});

exports.getOwner = asyncHandler(async (req, res, next) => {
  const owner = await Owner.findOne({
    _id: req.params.id,
    ...ownershipFilter(req.user)
  });

  if (!owner) {
    return next(new ErrorResponse(`Owner not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: owner });
});

exports.createOwner = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const owner = await Owner.create({ ...req.body, user: req.user.id });
  res.status(201).json({ success: true, data: owner });
});

exports.updateOwner = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const updates = { ...req.body };
  delete updates.user;
  const existingOwner = await Owner.findOne({
    _id: req.params.id,
    ...ownershipFilter(req.user)
  });
  if (!existingOwner) {
    return next(new ErrorResponse(`Owner not found with id of ${req.params.id}`, 404));
  }

  const owner = await Owner.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  if (!owner) {
    return next(new ErrorResponse(`Owner not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: owner });
});

exports.deleteOwner = asyncHandler(async (req, res, next) => {
  const owner = await Owner.findOne({
    _id: req.params.id,
    ...ownershipFilter(req.user)
  });

  if (!owner) {
    return next(new ErrorResponse(`Owner not found with id of ${req.params.id}`, 404));
  }

  if (await Animal.exists({ owner: owner._id })) {
    return next(new ErrorResponse('Cannot delete an owner while animals still reference them', 400));
  }

  await owner.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

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
