/**
 * L.K.S.K Convent School - Object-Level ID Validation Middleware
 * Validates that MongoDB ObjectId parameters are valid 24-hex strings.
 * Blocks invalid IDs and path traversal attempts early.
 */

const mongoose = require('mongoose');
const ApiResponse = require('../utils/apiResponse');

const validateObjectId = (paramNames = ['id']) => {
  const params = Array.isArray(paramNames) ? paramNames : [paramNames];

  return (req, res, next) => {
    for (const param of params) {
      const val = req.params[param];
      if (val !== undefined) {
        // Test if valid 24-character hexadecimal ObjectId
        if (!mongoose.Types.ObjectId.isValid(val) || String(new mongoose.Types.ObjectId(val)) !== String(val)) {
          return ApiResponse.error(
            res,
            `Invalid identifier format for parameter: ${param}`,
            400,
            [{ field: param, message: 'Must be a valid 24-character hex string' }]
          );
        }
      }
    }
    next();
  };
};

module.exports = validateObjectId;
