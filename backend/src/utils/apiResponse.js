/**
 * Standardized API Response Formatter
 */
class ApiResponse {
  /**
   * Send success JSON response
   * @param {import('express').Response} res
   * @param {string} message
   * @param {any} data
   * @param {number} statusCode
   */
  static success(res, message = 'Success', data = null, statusCode = 200) {
    const payload = {
      success: true,
      message,
    };

    if (data !== null && data !== undefined) {
      payload.data = data;
    }

    return res.status(statusCode).json(payload);
  }

  /**
   * Send error JSON response
   * @param {import('express').Response} res
   * @param {string} message
   * @param {number} statusCode
   * @param {any[]} errors
   */
  static error(res, message = 'An error occurred', statusCode = 500, errors = []) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: Array.isArray(errors) ? errors : [errors],
    });
  }
}

module.exports = ApiResponse;
