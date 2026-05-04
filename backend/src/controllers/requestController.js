const requestModel = require('../models/requestModel');
const { VALID_BLOOD_TYPES, VALID_URGENCY_LEVELS, VALID_REQUEST_STATUSES } = require('../config/constants');
const { getEligibleDonors } = require('../services/matchingService');
const { calculateDistanceKm } = require('../utils/geo');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const createRequest = asyncHandler(async (req, res) => {
  const { bloodType, city, latitude, longitude, urgency } = req.body;

  if (!bloodType || !city || !urgency) {
    throw new ApiError(400, 'Blood type, city, and urgency are required');
  }

  if (!VALID_BLOOD_TYPES.includes(bloodType)) {
    throw new ApiError(400, 'Invalid blood type');
  }

  if (!VALID_URGENCY_LEVELS.includes(urgency)) {
    throw new ApiError(400, 'Invalid urgency level');
  }

  const request = await requestModel.createRequest({
    userId: req.user.id,
    bloodType,
    city,
    latitude,
    longitude,
    urgency,
  });

  const matches = await getEligibleDonors({
    bloodType,
    city,
    latitude,
    longitude,
    maxDistanceKm: Number(process.env.DEFAULT_SEARCH_RADIUS_KM || 50),
  });

  res.status(201).json({
    request,
    matches,
  });
});

const getRequests = asyncHandler(async (req, res) => {
  const { status = 'open', bloodType, city } = req.query;

  if (status && !VALID_REQUEST_STATUSES.includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  if (bloodType && !VALID_BLOOD_TYPES.includes(bloodType)) {
    throw new ApiError(400, 'Invalid blood type');
  }

  const locationLatitude = req.query.latitude ? Number(req.query.latitude) : null;
  const locationLongitude = req.query.longitude ? Number(req.query.longitude) : null;
  const requests = await requestModel.getRequests({ status, bloodType, city });

  res.json(
    requests.map((request) => ({
      ...request,
      distance_km: calculateDistanceKm(
        locationLatitude,
        locationLongitude,
        request.latitude,
        request.longitude
      ),
    }))
  );
});

const updateRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!VALID_REQUEST_STATUSES.includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const existingRequest = await requestModel.findById(id);
  if (!existingRequest) {
    throw new ApiError(404, 'Request not found');
  }

  if (existingRequest.user_id !== req.user.id) {
    throw new ApiError(403, 'You can only update your own request');
  }

  const updatedRequest = await requestModel.updateRequestStatus(id, status);
  res.json(updatedRequest);
});

module.exports = {
  createRequest,
  getRequests,
  updateRequest,
};
