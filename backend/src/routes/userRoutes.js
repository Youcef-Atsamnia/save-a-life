const express = require('express');

const { getUsers, updateUser, getCurrentUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getUsers);
router.get('/me', protect, getCurrentUser);
router.put('/:id', protect, updateUser);

module.exports = router;
