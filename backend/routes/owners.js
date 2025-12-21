const express = require('express');
const {
  getOwners,
  getOwner,
  createOwner,
  updateOwner,
  deleteOwner,
  validateOwner
} = require('../controllers/ownerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getOwners)
  .post(protect, authorize('admin'), validateOwner, createOwner);

router
  .route('/:id')
  .get(protect, getOwner)
  .put(protect, authorize('admin'), validateOwner, updateOwner)
  .delete(protect, authorize('admin'), deleteOwner);

module.exports = router;