const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

let cachedConnection = null;

/**
 * Connect to MongoDB using the URI from environment variables.
 * Gracefully logs status if MONGODB_URI is not yet configured.
 * Uses cached connection promise to avoid redundant connection attempts in serverless environments.
 */
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    try {
      return await cachedConnection;
    } catch (e) {
      cachedConnection = null;
    }
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[Database] MONGODB_URI is not defined in environment variables. MongoDB connection skipped.');
    return;
  }

  try {
    cachedConnection = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 20000
    });
    const conn = await cachedConnection;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    cachedConnection = null;
    console.error(`[Database] MongoDB connection error: ${error.message}`);
  }
};

module.exports = connectDB;
