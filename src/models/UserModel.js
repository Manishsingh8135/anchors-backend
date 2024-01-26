const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String }, // Add OTP field
  isVerified: { type: Boolean, default: false } // Add verification status
});

module.exports = mongoose.model('User', userSchema);
