const donationModel = require('../models/donationModel');
const requestModel = require('../models/requestModel');
const { canDonateToBloodType, getDaysSinceLastDonation } = require('../services/matchingService');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const userModel = require('../models/userModel');
const { buildProfileStats } = require('../services/profileService');

const createDonation = asyncHandler(async (req, res) => {
  const { requestId } = req.body;

  if (!requestId) {
    throw new ApiError(400, 'Request ID is required');
  }

  const request = await requestModel.findById(requestId);
  if (!request) {
    throw new ApiError(404, 'Request not found');
  }

  if (request.status !== 'open') {
    throw new ApiError(400, 'This request is already closed');
  }

  if (!req.user.available) {
    throw new ApiError(400, 'You must be marked as available to donate');
  }

  if (!canDonateToBloodType(req.user.blood_type, request.blood_type)) {
    throw new ApiError(400, 'Your blood type is not compatible with this request');
  }

  const lastDonation = await donationModel.getLastDonationByDonorId(req.user.id);
  const daysSinceLastDonation = getDaysSinceLastDonation(lastDonation?.date);

  if (daysSinceLastDonation !== null && daysSinceLastDonation < 90) {
    throw new ApiError(400, `You must wait ${90 - daysSinceLastDonation} more days before donating again`);
  }

  const donation = await donationModel.createDonation({
    donorId: req.user.id,
    requestId,
  });

  await requestModel.updateRequestStatus(requestId, 'closed');
  const refreshedUser = await userModel.findById(req.user.id);
  const stats = await buildProfileStats(refreshedUser);
  await userModel.syncDonorGamification(req.user.id, stats.donorPoints, stats.reputationScore);

  res.status(201).json(donation);
});

const getDonationHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (Number(id) !== req.user.id) {
    throw new ApiError(403, 'You can only access your own donation history');
  }

  const history = await donationModel.getDonationHistoryByUserId(id);
  res.json(history);
});

module.exports = {
  createDonation,
  getDonationHistory,
};
