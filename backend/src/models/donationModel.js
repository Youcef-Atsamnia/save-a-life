const db = require('../config/db');

const createDonation = async ({ donorId, requestId }) => {
  const result = await db.query(
    `INSERT INTO donations (donor_id, request_id)
     VALUES ($1, $2)
     RETURNING id, donor_id, request_id, date`,
    [donorId, requestId]
  );

  return result.rows[0];
};

const getDonationHistoryByUserId = async (userId) => {
  const result = await db.query(
    `SELECT
       d.id,
       d.donor_id,
       d.request_id,
       d.date,
       dr.blood_type,
       dr.city,
       dr.urgency,
       u.name AS requester_name
     FROM donations d
     JOIN donation_requests dr ON dr.id = d.request_id
     JOIN users u ON u.id = dr.user_id
     WHERE d.donor_id = $1
     ORDER BY d.date DESC`,
    [userId]
  );

  return result.rows;
};

const getLastDonationByDonorId = async (donorId) => {
  const result = await db.query(
    'SELECT id, donor_id, request_id, date FROM donations WHERE donor_id = $1 ORDER BY date DESC LIMIT 1',
    [donorId]
  );

  return result.rows[0] || null;
};

const countDonationsByDonorId = async (donorId) => {
  const result = await db.query('SELECT COUNT(*)::int AS count FROM donations WHERE donor_id = $1', [donorId]);
  return result.rows[0]?.count || 0;
};

module.exports = {
  createDonation,
  getDonationHistoryByUserId,
  getLastDonationByDonorId,
  countDonationsByDonorId,
};
