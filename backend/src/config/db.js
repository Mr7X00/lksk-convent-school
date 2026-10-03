const mongoose = require('mongoose');

const connectionStateMap = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

// Fail fast when database is not connected rather than waiting for 10-second default buffer timeout
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lksk_school';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Connection note: ${error.message}`);
    console.warn('[MongoDB] Server is running in disconnected mode. Database operations will report 503 until MongoDB is reachable.');
    return null;
  }
};

mongoose.connection.on('connected', () => {
  console.log('[MongoDB] Connection established');
});

mongoose.connection.on('disconnected', () => {
  console.log('[MongoDB] Connection lost');
});

mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB] Runtime error: ${err.message}`);
});

const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

const getDatabaseStatus = () => {
  const stateCode = mongoose.connection.readyState;
  return {
    stateCode,
    status: connectionStateMap[stateCode] || 'unknown',
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
};

module.exports = {
  connectDB,
  isDatabaseConnected,
  getDatabaseStatus,
};
