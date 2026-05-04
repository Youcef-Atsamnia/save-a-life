const generateOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;

const getOtpExpiry = () => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10);
  return expiry;
};

module.exports = {
  generateOtp,
  getOtpExpiry,
};
