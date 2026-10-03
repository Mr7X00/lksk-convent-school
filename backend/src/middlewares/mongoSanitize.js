/**
 * L.K.S.K Convent School - NoSQL Injection Protection Middleware
 * Strips any object key that starts with "$" or contains "." from req.body, req.query, and req.params.
 * Protects against MongoDB operator injection attacks ($gt, $ne, $where, $regex, etc.).
 */

function sanitizeObject(target) {
  if (!target || typeof target !== 'object') {
    return;
  }

  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      if (typeof target[i] === 'object' && target[i] !== null) {
        sanitizeObject(target[i]);
      }
    }
    return;
  }

  for (const key of Object.keys(target)) {
    // If key starts with $ or contains a dot, delete it
    if (key.startsWith('$') || key.includes('.')) {
      delete target[key];
    } else if (typeof target[key] === 'object' && target[key] !== null) {
      sanitizeObject(target[key]);
    }
  }
}

const mongoSanitize = (req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
};

module.exports = mongoSanitize;
