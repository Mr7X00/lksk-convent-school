/**
 * L.K.S.K Convent School - Structured Production Logger
 * Provides standardized INFO, WARN, and ERROR log streams.
 * Strictly redacts sensitive credentials, tokens, and secrets.
 */

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'token',
  'jwt',
  'authorization',
  'secret',
  'jwt_secret',
  'smtp_password',
  'cookie',
  'session',
]);

function sanitizeLogData(data) {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeLogData);
  }

  const clean = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      clean[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      clean[key] = sanitizeLogData(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

function formatLog(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const safeMeta = sanitizeLogData(meta);
  const metaStr = Object.keys(safeMeta).length > 0 ? ` ${JSON.stringify(safeMeta)}` : '';
  return `[${level}][${timestamp}] ${message}${metaStr}`;
}

const logger = {
  info(message, meta) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(formatLog('INFO', message, meta));
    }
  },
  warn(message, meta) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(formatLog('WARN', message, meta));
    }
  },
  error(message, meta) {
    if (process.env.NODE_ENV !== 'test') {
      console.error(formatLog('ERROR', message, meta));
    }
  },
};

module.exports = logger;
