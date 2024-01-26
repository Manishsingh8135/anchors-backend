require('dotenv').config();

const mongoose = require('mongoose');
const con_str = 'mongodb+srv://manishsingh8135:fmxZqJJqt7POcJPQ@cluster0.nzy5ifp.mongodb.net/recruitify?retryWrites=true&w=majority'

const connectDB = async () => {
  try {
    await mongoose.connect(con_str, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
