const donationModel = require('../models/donationModel');
const { getDaysSinceLastDonation } = require('./matchingService');

const DONATION_COOLDOWN_DAYS = 90;
const POINTS_PER_DONATION = 100;
const CERTIFICATE_THRESHOLD = 300;

const calculateReputationScore = ({ donationCount, available, emailVerified }) => {
  const score = donationCount * 20 + (available ? 10 : 0) + (emailVerified ? 10 : 0);
  return Math.min(100, score);
};

const buildProfileStats = async (user) => {
  const donationHistory = await donationModel.getDonationHistoryByUserId(user.id);
  const donationCount = donationHistory.length;
  const lastDonationDate = donationHistory[0]?.date || null;
  const daysSinceLastDonation = getDaysSinceLastDonation(lastDonationDate);
  const cooldownDaysRemaining =
    daysSinceLastDonation === null ? 0 : Math.max(0, DONATION_COOLDOWN_DAYS - daysSinceLastDonation);
  const nextEligibleDate =
    cooldownDaysRemaining > 0 && lastDonationDate
      ? new Date(new Date(lastDonationDate).getTime() + DONATION_COOLDOWN_DAYS * 24 * 60 * 60 * 1000).toISOString()
      : null;
  const donorPoints = donationCount * POINTS_PER_DONATION;
  const reputationScore = calculateReputationScore({
    donationCount,
    available: user.available,
    emailVerified: user.email_verified,
  });

  return {
    donationCount,
    donorPoints,
    reputationScore,
    cooldownDaysRemaining,
    nextEligibleDate,
    certificateEligible: donorPoints >= CERTIFICATE_THRESHOLD,
    pointsToNextCertificate: Math.max(0, CERTIFICATE_THRESHOLD - donorPoints),
  };
};

const attachProfileStats = async (user) => {
  const stats = await buildProfileStats(user);

  return {
    ...user,
    donor_points: stats.donorPoints,
    reputation_score: stats.reputationScore,
    profile_stats: stats,
  };
};

module.exports = {
  DONATION_COOLDOWN_DAYS,
  POINTS_PER_DONATION,
  CERTIFICATE_THRESHOLD,
  calculateReputationScore,
  buildProfileStats,
  attachProfileStats,
};
