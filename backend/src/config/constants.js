const BLOOD_COMPATIBILITY = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

const VALID_BLOOD_TYPES = Object.keys(BLOOD_COMPATIBILITY);
const VALID_URGENCY_LEVELS = ['low', 'medium', 'high'];
const VALID_REQUEST_STATUSES = ['open', 'closed'];
const VALID_LANGUAGES = ['en', 'fr', 'ar'];
const FACILITY_TYPES = ['hospital', 'blood_bank'];

module.exports = {
  BLOOD_COMPATIBILITY,
  VALID_BLOOD_TYPES,
  VALID_URGENCY_LEVELS,
  VALID_REQUEST_STATUSES,
  VALID_LANGUAGES,
  FACILITY_TYPES,
};
