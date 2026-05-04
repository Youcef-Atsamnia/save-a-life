const db = require('../config/db');

const requestSelect = `
  dr.id,
  dr.user_id,
  dr.blood_type,
  dr.city,
  dr.latitude,
  dr.longitude,
  dr.urgency,
  dr.status,
  dr.created_at,
  u.name AS requester_name
`;

const createRequest = async ({ userId, bloodType, city, latitude, longitude, urgency }) => {
  const result = await db.query(
    `INSERT INTO donation_requests (user_id, blood_type, city, latitude, longitude, urgency, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'open')
     RETURNING id, user_id, blood_type, city, latitude, longitude, urgency, status, created_at`,
    [userId, bloodType, city, latitude ?? null, longitude ?? null, urgency]
  );

  return result.rows[0];
};

const getRequests = async ({ status, bloodType, city }) => {
  const values = [];
  const filters = [];

  if (status) {
    values.push(status);
    filters.push(`dr.status = $${values.length}`);
  }

  if (bloodType) {
    values.push(bloodType);
    filters.push(`dr.blood_type = $${values.length}`);
  }

  if (city) {
    values.push(city);
    filters.push(`LOWER(dr.city) = LOWER($${values.length})`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const result = await db.query(
    `SELECT ${requestSelect}
     FROM donation_requests dr
     JOIN users u ON u.id = dr.user_id
     ${whereClause}
     ORDER BY
       CASE dr.urgency WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
       dr.created_at DESC`,
    values
  );

  return result.rows;
};

const findById = async (id) => {
  const result = await db.query(
    `SELECT ${requestSelect}
     FROM donation_requests dr
     JOIN users u ON u.id = dr.user_id
     WHERE dr.id = $1
     LIMIT 1`,
    [id]
  );

  return result.rows[0] || null;
};

const updateRequestStatus = async (id, status) => {
  const result = await db.query(
    `UPDATE donation_requests
     SET status = $2
     WHERE id = $1
     RETURNING id, user_id, blood_type, city, latitude, longitude, urgency, status, created_at`,
    [id, status]
  );

  return result.rows[0] || null;
};

module.exports = {
  createRequest,
  getRequests,
  findById,
  updateRequestStatus,
};
