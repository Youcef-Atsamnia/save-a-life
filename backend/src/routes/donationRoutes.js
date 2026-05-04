const express = require('express');

const { createDonation, getDonationHistory } = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createDonation);
router.get('/user/:id', protect, getDonationHistory);

module.exports = router;
