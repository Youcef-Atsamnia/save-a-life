const userModel = require('../models/userModel');
const donationModel = require('../models/donationModel');
const { VALID_BLOOD_TYPES, VALID_LANGUAGES } = require('../config/constants');
const { getEligibleDonors } = require('../services/matchingService');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { calculateDistanceKm } = require('../utils/geo');
const { attachProfileStats } = require('../services/profileService');

const getUsers = asyncHandler(async (req, res) => {
  const { bloodType, city, available } = req.query;

  if (bloodType && !VALID_BLOOD_TYPES.includes(bloodType)) {
    throw new ApiError(400, 'Invalid blood type');
  }

  const locationLatitude = req.query.latitude ? Number(req.query.latitude) : null;
  const locationLongitude = req.query.longitude ? Number(req.query.longitude) : null;
  const maxDistanceKm =
    req.query.maxDistanceKm !== undefined
      ? Number(req.query.maxDistanceKm)
      : Number(process.env.DEFAULT_SEARCH_RADIUS_KM || 50);

  const donors = bloodType
    ? await getEligibleDonors({
        bloodType,
        city,
        latitude: locationLatitude,
        longitude: locationLongitude,
        maxDistanceKm,
      })
    : await userModel.getAllUsers({
        city,
        available: available === undefined ? undefined : available === 'true',
      });

  const donorHistory = await Promise.all(
    donors.map(async (donor) => {
      const lastDonation = await donationModel.getLastDonationByDonorId(donor.id);
      const computedDistance =
        donor.distance_km ??
        calculateDistanceKm(locationLatitude, locationLongitude, donor.latitude, donor.longitude);

      return {
        ...donor,
        distance_km: computedDistance,
        last_donation_date: lastDonation?.date || null,
      };
    })
  );

  res.json(donorHistory);
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isSelf = Number(id) === req.user.id;

  if (!isSelf) {
    throw new ApiError(403, 'You can only update your own profile');
  }

  const { city, latitude, longitude, available } = req.body;
  const preferredLanguage = req.body.preferredLanguage || req.body.preferred_language;

  if (preferredLanguage && !VALID_LANGUAGES.includes(preferredLanguage)) {
    throw new ApiError(400, 'Invalid preferred language');
  }

  const user = await userModel.updateUser(id, {
    city,
    latitude,
    longitude,
    available,
    preferredLanguage,
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json(await attachProfileStats(user));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id);
  res.json(await attachProfileStats(user));
});

module.exports = {
  getUsers,
  updateUser,
  getCurrentUser,
};
