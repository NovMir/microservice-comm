
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGO_URI || '';
    
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Exit process on database connection failure
    process.exit(1);
  }
};

module.exports = connectDB;