const express = require('express');
const {
  register,
  login,
  getMe,
  updateMe,
  validateRegister,
  validateLogin,
  validateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.put('/me', protect, validateProfile, updateMe);

module.exports = router;