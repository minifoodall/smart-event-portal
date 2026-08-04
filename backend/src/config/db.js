const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_event_portal';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Don't crash immediately in container; health/ready probes will report not-ready
    setTimeout(connectDB, 5000);
  }
}

module.exports = connectDB;
