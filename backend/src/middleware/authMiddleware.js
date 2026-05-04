const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userModel.findAuthById(decoded.id);

  if (!user) {
    throw new ApiError(401, 'Invalid token');
  }

  req.user = user;
  next();
});

module.exports = {
  protect,
};
