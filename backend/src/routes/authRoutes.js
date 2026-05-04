const express = require('express');

const { login, register, sendOtp, verifyOtp } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', protect, sendOtp);
router.post('/verify-otp', protect, verifyOtp);

module.exports = router;
