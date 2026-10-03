/**
 * L.K.S.K Convent School - Production Security Utilities
 * Provides regex escaping, URL scheme safety, and security monitoring.
 */

/**
 * Escapes regex metacharacters and enforces a safe maximum length
 * Protects against ReDoS (Regular Expression Denial of Service)
 * @param {string} str - User-supplied search string
 * @param {number} [maxLength=100] - Maximum allowed length
 * @returns {string} - Escaped safe regex string
 */
function escapeRegex(str, maxLength = 100) {
  if (typeof str !== 'string') return '';
  const truncated = str.trim().slice(0, maxLength);
  return truncated.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validates that a URL does not use dangerous schemes like javascript:, vbscript:, data:
 * Allows relative paths, https://, and http://
 * @param {string} url - Target URL
 * @returns {boolean}
 */
function isSafeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();

  // Allow relative URLs starting with / (e.g. /academic/admission-inquiry, /assets/...)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return true;
  }

  // Reject dangerous schemes
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:')
  ) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Escapes a cell value for safe CSV generation to prevent formula injection
 * Neutralizes characters (=, +, -, @, tab, newline, pipe, percent)
 * @param {any} cell
 * @returns {string}
 */
function escapeCsvCell(cell) {
  if (cell === null || cell === undefined) return '""';
  let str = String(cell);
  // Neutralize formula triggers even with leading whitespace
  const trimmed = str.trimStart();
  if (/^[=+\-@\t\r|%]/.test(trimmed)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Lightweight structured security event logger
 * Never logs passwords, secrets, or tokens
 * @param {string} eventType - e.g. AUTH_FAILED, ACCOUNT_LOCKED, RATE_LIMIT_EXCEEDED, UNAUTHORIZED_ACCESS
 * @param {object} metadata - context details
 */
function logSecurityEvent(eventType, metadata = {}) {
  const timestamp = new Date().toISOString();
  const safeMeta = { ...metadata };

  // Strict sanitization: ensure no passwords, tokens, or credentials can ever be logged
  delete safeMeta.password;
  delete safeMeta.passwordHash;
  delete safeMeta.token;
  delete safeMeta.jwt;
  delete safeMeta.authorization;

  if (process.env.NODE_ENV !== 'test') {
    console.warn(`[SECURITY][${timestamp}][${eventType}]`, JSON.stringify(safeMeta));
  }
}

module.exports = {
  escapeRegex,
  isSafeUrl,
  escapeCsvCell,
  logSecurityEvent,
};
