const mongoose = require('mongoose');
const connectDB = require('../config/db');

/**
 * initApp()
 * - Uses process.env.MONGO_URI if provided, otherwise falls back to mongodb://127.0.0.1:27017/tipko_test
 * - Calls the project's connectDB() to establish a real mongoose connection
 * - Imports and returns the express `app` exported by server.js
 * - Returns { app }
 */
async function initApp() {
  process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tipko_test';
  // ensure a deterministic jwt secret for tests
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';

  // Connect using project's connectDB which reads process.env.MONGO_URI
  await connectDB();

  const app = require('../server');

  // Wait until mongoose connection is open
  await new Promise((resolve, reject) => {
    if (mongoose.connection.readyState === 1) return resolve();
    mongoose.connection.once('open', resolve);
    mongoose.connection.once('error', reject);
  });

  return { app };
}

async function stop() {
  try {
    if (mongoose.connection && mongoose.connection.db) {
      // Drop test database to leave a clean state
      await mongoose.connection.db.dropDatabase();
    }
  } catch (e) {
    // ignore
  }
  try {
    await mongoose.disconnect();
  } catch (e) {
    // ignore
  }
}

module.exports = { initApp, stop };
