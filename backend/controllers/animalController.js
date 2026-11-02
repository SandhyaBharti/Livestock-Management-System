const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { body, validationResult } = require('express-validator');
const Animal = require('../models/Animal');
const Owner = require('../models/Owner');

const ownershipFilter = (user) => user.role === 'admin' ? {} : { user: user.id };

exports.getAnimals = asyncHandler(async (req, res) => {
  const animals = await Animal.find(ownershipFilter(req.user)).populate('owner');

  res.status(200).json({
    success: true,
    count: animals.length,
    data: animals
  });
});

exports.getAnimal = asyncHandler(async (req, res, next) => {
  const animal = await Animal.findOne({
    _id: req.params.id,
    ...ownershipFilter(req.user)
  }).populate('owner');

  if (!animal) {
    return next(new ErrorResponse(`Animal not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: animal });
});

exports.createAnimal = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const owner = await Owner.exists({
    _id: req.body.owner,
    ...ownershipFilter(req.user)
  });
  if (!owner) {
    return next(new ErrorResponse('Owner not found or not accessible', 404));
  }

  const animal = await Animal.create({ ...req.body, user: req.user.id });
  await animal.populate('owner');
  res.status(201).json({ success: true, data: animal });
});

exports.updateAnimal = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const updates = { ...req.body };
  delete updates.user;
  if (updates.owner) {
    const owner = await Owner.exists({
      _id: updates.owner,
      ...ownershipFilter(req.user)
    });
    if (!owner) {
      return next(new ErrorResponse('Owner not found or not accessible', 404));
    }
  }

  const existingAnimal = await Animal.findOne({
    _id: req.params.id,
    ...ownershipFilter(req.user)
  });
  if (!existingAnimal) {
    return next(new ErrorResponse(`Animal not found with id of ${req.params.id}`, 404));
  }

  const animal = await Animal.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).populate('owner');

  if (!animal) {
    return next(new ErrorResponse(`Animal not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: animal });
});

exports.deleteAnimal = asyncHandler(async (req, res, next) => {
  const animal = await Animal.findOneAndDelete({
    _id: req.params.id,
    ...ownershipFilter(req.user)
  });

  if (!animal) {
    return next(new ErrorResponse(`Animal not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: {} });
});

exports.getSpeciesStats = asyncHandler(async (req, res) => {
  const match = req.user.role === 'admin' ? [] : [{ $match: { user: req.user._id } }];
  const stats = await Animal.aggregate([
    ...match,
    { $group: { _id: '$species', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } }
  ]);

  res.status(200).json({ success: true, count: stats.length, data: stats });
});

exports.validateAnimal = [
  body('tagId').notEmpty().withMessage('Tag ID is required'),
  body('species').notEmpty().withMessage('Species is required'),
  body('breed').notEmpty().withMessage('Breed is required'),
  body('age').isNumeric().withMessage('Age must be a number'),
  body('owner').notEmpty().withMessage('Owner is required')
];
