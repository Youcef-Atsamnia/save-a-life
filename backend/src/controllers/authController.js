const bcrypt = require('bcryptjs');

const userModel = require('../models/userModel');
const donationModel = require('../models/donationModel');
const { VALID_BLOOD_TYPES, VALID_LANGUAGES } = require('../config/constants');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../utils/auth');
const { generateOtp, getOtpExpiry } = require('../utils/otp');
const { attachProfileStats } = require('../services/profileService');

const buildAuthPayload = async (user) => ({
  user: await attachProfileStats(user),
  token: signToken({ id: user.id }),
  donationHistory: await donationModel.getDonationHistoryByUserId(user.id),
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password, bloodType, city, latitude, longitude, preferredLanguage = 'en' } = req.body;

  if (!name || !email || !password || !bloodType || !city) {
    throw new ApiError(400, 'Name, email, password, blood type, and city are required');
  }

  if (!VALID_BLOOD_TYPES.includes(bloodType)) {
    throw new ApiError(400, 'Invalid blood type');
  }

  if (!VALID_LANGUAGES.includes(preferredLanguage)) {
    throw new ApiError(400, 'Invalid preferred language');
  }

  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    throw new ApiError(409, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = generateOtp();
  const verificationExpiresAt = getOtpExpiry();
  const user = await userModel.createUser({
    name,
    email,
    password: hashedPassword,
    bloodType,
    city,
    latitude,
    longitude,
    preferredLanguage,
    verificationCode,
    verificationExpiresAt,
  });

  res.status(201).json({
    ...(await buildAuthPayload(user)),
    otpPreview: verificationCode,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const existingUser = await userModel.findByEmail(email);
  if (!existingUser) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const user = await userModel.findById(existingUser.id);
  res.json(await buildAuthPayload(user));
});

const sendOtp = asyncHandler(async (req, res) => {
  const verificationCode = generateOtp();
  const verificationExpiresAt = getOtpExpiry();

  await userModel.setVerificationCode(req.user.id, verificationCode, verificationExpiresAt);

  res.json({
    message: 'Verification code generated',
    otpPreview: verificationCode,
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    throw new ApiError(400, 'Verification code is required');
  }

  if (!req.user.verification_code || !req.user.verification_expires_at) {
    throw new ApiError(400, 'No verification code is pending');
  }

  if (req.user.verification_code !== String(code)) {
    throw new ApiError(400, 'Invalid verification code');
  }

  if (new Date(req.user.verification_expires_at).getTime() < Date.now()) {
    throw new ApiError(400, 'Verification code expired');
  }

  const user = await userModel.verifyEmail(req.user.id);

  res.json(await buildAuthPayload(user));
});

module.exports = {
  register,
  login,
  sendOtp,
  verifyOtp,
};
