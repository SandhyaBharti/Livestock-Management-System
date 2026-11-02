const express = require('express');
const {
  getOwners,
  getOwner,
  createOwner,
  updateOwner,
  deleteOwner,
  validateOwner
} = require('../controllers/ownerController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getOwners)
  .post(protect, validateOwner, createOwner);

router
  .route('/:id')
  .get(protect, getOwner)
  .put(protect, validateOwner, updateOwner)
  .delete(protect, deleteOwner);

module.exports = router;