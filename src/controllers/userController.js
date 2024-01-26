const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { generateOTP, sendEmail } = require('../utils/otpHelper');

// User registration handler
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    // Create user (but don't save it yet)
    user = new User({ name, email, password: hashedPassword, otp });

    // Save the user with the OTP
    await user.save();

    // Send OTP to user's email
    await sendEmail(user.email, 'Your OTP', `Your OTP is: ${otp}`);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Registration Error:', error); // Enhanced error logging
    res.status(500).json({ message: error.message });
  }
};

// OTP verification handler
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }

    // Compare the provided OTP with the stored OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.status(200).json({ message: 'Account verified successfully' });
  } catch (error) {
    console.error('OTP Verification Error:', error); // Enhanced error logging
    res.status(500).json({ message: error.message });
  }
};





exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Ensure the user is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: 'User is not verified' });
    }

    // Create and assign a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
