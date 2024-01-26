const nodemailer = require('nodemailer');

// Generate a 6-digit OTP
exports.generateOTP = () => {
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

// Function to send email
exports.sendEmail = async (to, subject, text) => {
  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Send email
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: to,
    subject: subject,
    text: text
  });
};
