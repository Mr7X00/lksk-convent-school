const { getDatabaseStatus } = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

/**
 * Controller to handle API health check
 * GET /api/health
 * Masks internal database host and server specifics in production.
 */
const getHealthStatus = (req, res) => {
  const dbStatus = getDatabaseStatus();
  const isProd = process.env.NODE_ENV === 'production';

  const safeDatabaseInfo = isProd
    ? {
        stateCode: dbStatus.stateCode,
        status: dbStatus.status,
      }
    : dbStatus;

  return ApiResponse.success(res, 'L.K.S.K Convent School REST API is running successfully', {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    school: {
      name: 'L.K.S.K Convent School',
      location: 'Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188',
      established: 2017,
      email: 'lkskconventschool@gmail.com',
    },
    database: safeDatabaseInfo,
  });
};

module.exports = {
  getHealthStatus,
};
