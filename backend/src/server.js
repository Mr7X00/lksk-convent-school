const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Initialize Database connection
connectDB();

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`L.K.S.K Convent School API running on port ${PORT}`);
  console.log(`Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

const mongoose = require('mongoose');

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n[Server] ${signal} signal received: closing HTTP server...`);
  server.close(async () => {
    console.log('[Server] HTTP server closed.');
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        console.log('[MongoDB] Database connection closed safely.');
      }
      process.exit(0);
    } catch (err) {
      console.error('[MongoDB] Error during connection close:', err.message);
      process.exit(1);
    }
  });

  // Force shutdown after 10-second timeout if hanging
  setTimeout(() => {
    console.error('[Server] Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught Exception thrown:', err);
  process.exit(1);
});
