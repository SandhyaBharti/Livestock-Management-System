const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { body, validationResult } = require('express-validator');
const Vaccination = require('../models/Vaccination');
const Animal = require('../models/Animal');

const ownershipFilter = (user) => user.role === 'admin' ? {} : { user: user.id };

exports.getVaccinations = asyncHandler(async (req, res) => {
  const vaccinations = await Vaccination.find(ownershipFilter(req.user)).populate('animal');

  res.status(200).json({
    success: true,
    count: vaccinations.length,
    data: vaccinations
  });
});

exports.getVaccination = asyncHandler(async (req, res, next) => {
  const vaccination = await Vaccination.findOne({
    _id: req.params.id,
    ...ownershipFilter(req.user)
  }).populate('animal');

  if (!vaccination) {
    return next(new ErrorResponse(`Vaccination not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: vaccination });
});

exports.createVaccination = asyncHandler(async (req, res, next) => {
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

  const vaccination = await Vaccination.create({ ...req.body, user: req.user.id });
  await vaccination.populate('animal');
  res.status(201).json({ success: true, data: vaccination });
});

exports.updateVaccination = asyncHandler(async (req, res, next) => {
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

  const existingVaccination = await Vaccination.findOne({
    _id: req.params.id,
    ...ownershipFilter(req.user)
  });
  if (!existingVaccination) {
    return next(new ErrorResponse(`Vaccination not found with id of ${req.params.id}`, 404));
  }

  const vaccination = await Vaccination.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).populate('animal');

  if (!vaccination) {
    return next(new ErrorResponse(`Vaccination not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: vaccination });
});

exports.deleteVaccination = asyncHandler(async (req, res, next) => {
  const vaccination = await Vaccination.findOneAndDelete({
    _id: req.params.id,
    ...ownershipFilter(req.user)
  });

  if (!vaccination) {
    return next(new ErrorResponse(`Vaccination not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: {} });
});

exports.getDueVaccinations = asyncHandler(async (req, res) => {
  const days = req.query.days === undefined ? 30 : Number(req.query.days);
  if (!Number.isInteger(days) || days < 0) {
    return res.status(400).json({ success: false, message: 'days must be a non-negative integer' });
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + days);
  const match = { nextDueDate: { $lte: cutoff } };
  if (req.user.role !== 'admin') {
    match.user = req.user._id;
  }

  const vaccinations = await Vaccination.aggregate([
    { $match: match },
    { $sort: { nextDueDate: 1 } },
    {
      $lookup: {
        from: 'animals',
        localField: 'animal',
        foreignField: '_id',
        as: 'animal'
      }
    },
    { $unwind: '$animal' }
  ]);

  res.status(200).json({
    success: true,
    count: vaccinations.length,
    data: vaccinations
  });
});

exports.validateVaccination = [
  body('animal').notEmpty().withMessage('Animal is required'),
  body('vaccineName').notEmpty().withMessage('Vaccine name is required'),
  body('vaccinationDate').isISO8601().withMessage('Vaccination date must be a valid date'),
  body('nextDueDate').isISO8601().withMessage('Next due date must be a valid date')
];
