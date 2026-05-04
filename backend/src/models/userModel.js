const db = require('../config/db');

const sanitizeUser = `
  id,
  name,
  email,
  blood_type,
  city,
  latitude,
  longitude,
  available,
  preferred_language,
  email_verified,
  donor_points,
  reputation_score,
  created_at
`;

const createUser = async ({
  name,
  email,
  password,
  bloodType,
  city,
  latitude,
  longitude,
  preferredLanguage,
  verificationCode,
  verificationExpiresAt,
}) => {
  const result = await db.query(
    `INSERT INTO users (
       name,
       email,
       password,
       blood_type,
       city,
       latitude,
       longitude,
       available,
       preferred_language,
       verification_code,
       verification_expires_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8, $9, $10)
     RETURNING ${sanitizeUser}`,
    [
      name,
      email,
      password,
      bloodType,
      city,
      latitude ?? null,
      longitude ?? null,
      preferredLanguage || 'en',
      verificationCode ?? null,
      verificationExpiresAt ?? null,
    ]
  );

  return result.rows[0];
};

const findByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
  return result.rows[0] || null;
};

const findById = async (id) => {
  const result = await db.query(`SELECT ${sanitizeUser} FROM users WHERE id = $1 LIMIT 1`, [id]);
  return result.rows[0] || null;
};

const findAuthById = async (id) => {
  const result = await db.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
  return result.rows[0] || null;
};

const getAllUsers = async ({ bloodType, city, available }) => {
  const filters = [];
  const values = [];

  if (bloodType) {
    values.push(bloodType);
    filters.push(`blood_type = $${values.length}`);
  }

  if (city) {
    values.push(city);
    filters.push(`LOWER(city) = LOWER($${values.length})`);
  }

  if (available !== undefined) {
    values.push(available);
    filters.push(`available = $${values.length}`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const result = await db.query(
    `SELECT ${sanitizeUser} FROM users ${whereClause} ORDER BY available DESC, created_at DESC`,
    values
  );

  return result.rows;
};

const updateUser = async (id, { city, latitude, longitude, available, preferredLanguage }) => {
  const result = await db.query(
    `UPDATE users
     SET city = COALESCE($2, city),
         latitude = COALESCE($3, latitude),
         longitude = COALESCE($4, longitude),
         available = COALESCE($5, available),
         preferred_language = COALESCE($6, preferred_language)
     WHERE id = $1
     RETURNING ${sanitizeUser}`,
    [id, city ?? null, latitude ?? null, longitude ?? null, available, preferredLanguage ?? null]
  );

  return result.rows[0] || null;
};

const setVerificationCode = async (id, verificationCode, verificationExpiresAt) => {
  const result = await db.query(
    `UPDATE users
     SET verification_code = $2,
         verification_expires_at = $3
     WHERE id = $1
     RETURNING ${sanitizeUser}`,
    [id, verificationCode, verificationExpiresAt]
  );

  return result.rows[0] || null;
};

const verifyEmail = async (id) => {
  const result = await db.query(
    `UPDATE users
     SET email_verified = true,
         verification_code = null,
         verification_expires_at = null
     WHERE id = $1
     RETURNING ${sanitizeUser}`,
    [id]
  );

  return result.rows[0] || null;
};

const syncDonorGamification = async (id, donorPoints, reputationScore) => {
  const result = await db.query(
    `UPDATE users
     SET donor_points = $2,
         reputation_score = $3
     WHERE id = $1
     RETURNING ${sanitizeUser}`,
    [id, donorPoints, reputationScore]
  );

  return result.rows[0] || null;
};

module.exports = {
  createUser,
  findByEmail,
  findById,
  findAuthById,
  getAllUsers,
  updateUser,
  setVerificationCode,
  verifyEmail,
  syncDonorGamification,
};
