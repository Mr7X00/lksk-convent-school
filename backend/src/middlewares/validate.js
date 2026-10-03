const ApiError = require('../utils/apiError');

/**
 * Validate request body, query, or params using a validation schema function
 * @param {Function} validatorFn - Function receiving req that returns array of errors: [{ field, message }]
 */
const validate = (validatorFn) => (req, res, next) => {
  const errors = validatorFn(req);
  if (errors && errors.length > 0) {
    return next(ApiError.badRequest('Validation failed', errors));
  }
  next();
};

module.exports = validate;
