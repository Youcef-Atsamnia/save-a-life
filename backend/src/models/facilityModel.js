const db = require('../config/db');

const getFacilities = async ({ city, type }) => {
  const values = [];
  const filters = ['verified = true'];

  if (city) {
    values.push(city);
    filters.push(`LOWER(city) = LOWER($${values.length})`);
  }

  if (type) {
    values.push(type);
    filters.push(`type = $${values.length}`);
  }

  const result = await db.query(
    `SELECT id, name, type, city, address, phone, verified, latitude, longitude, created_at
     FROM verified_facilities
     WHERE ${filters.join(' AND ')}
     ORDER BY city ASC, name ASC`,
    values
  );

  return result.rows;
};

module.exports = {
  getFacilities,
};
