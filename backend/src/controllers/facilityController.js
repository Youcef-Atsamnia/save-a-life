const facilityModel = require('../models/facilityModel');
const { FACILITY_TYPES } = require('../config/constants');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const getFacilities = asyncHandler(async (req, res) => {
  const { city, type } = req.query;

  if (type && !FACILITY_TYPES.includes(type)) {
    throw new ApiError(400, 'Invalid facility type');
  }

  const facilities = await facilityModel.getFacilities({ city, type });
  res.json(facilities);
});

module.exports = {
  getFacilities,
};
