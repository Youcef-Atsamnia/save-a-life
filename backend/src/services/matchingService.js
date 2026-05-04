const userModel = require('../models/userModel');
const donationModel = require('../models/donationModel');
const { BLOOD_COMPATIBILITY } = require('../config/constants');
const { calculateDistanceKm } = require('../utils/geo');

const canDonateToBloodType = (donorBloodType, requestedBloodType) =>
  Boolean(BLOOD_COMPATIBILITY[requestedBloodType]?.includes(donorBloodType));

const getDaysSinceLastDonation = (lastDonationDate) => {
  if (!lastDonationDate) {
    return null;
  }

  const diffMs = Date.now() - new Date(lastDonationDate).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

const getEligibleDonors = async ({ bloodType, city, latitude, longitude, maxDistanceKm }) => {
  const donors = await userModel.getAllUsers({ city, available: true });

  const donorChecks = await Promise.all(
    donors.map(async (donor) => {
      if (!canDonateToBloodType(donor.blood_type, bloodType)) {
        return null;
      }

      const lastDonation = await donationModel.getLastDonationByDonorId(donor.id);
      const daysSinceLastDonation = getDaysSinceLastDonation(lastDonation?.date);

      if (daysSinceLastDonation !== null && daysSinceLastDonation < 90) {
        return null;
      }

      const distanceKm = calculateDistanceKm(latitude, longitude, donor.latitude, donor.longitude);

      if (distanceKm !== null && maxDistanceKm && distanceKm > maxDistanceKm) {
        return null;
      }

      return {
        ...donor,
        distance_km: distanceKm,
      };
    })
  );

  return donorChecks
    .filter(Boolean)
    .sort((a, b) => {
      if (a.distance_km === null) {
        return 1;
      }

      if (b.distance_km === null) {
        return -1;
      }

      return a.distance_km - b.distance_km;
    });
};

module.exports = {
  canDonateToBloodType,
  getDaysSinceLastDonation,
  getEligibleDonors,
};
