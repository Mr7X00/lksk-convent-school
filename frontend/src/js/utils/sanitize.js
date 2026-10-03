/**
 * L.K.S.K Convent School - Frontend Sanitization & Security Utilities
 * Protects against XSS and open redirect/unsafe protocol injection.
 */

/**
 * Escapes characters to prevent HTML/XSS injection
 * @param {any} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validates that a URL uses a safe protocol (http, https, or relative path /)
 * Rejects javascript:, data:, vbscript:
 * @param {string} url
 * @param {string} [fallback='#']
 * @returns {string}
 */
export function sanitizeUrl(url, fallback = '#') {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();

  // Allow relative URLs starting with /
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:')
  ) {
    return fallback;
  }

  if (lower.startsWith('https://') || lower.startsWith('http://') || lower.startsWith('tel:') || lower.startsWith('mailto:')) {
    return trimmed;
  }

  return fallback;
}
