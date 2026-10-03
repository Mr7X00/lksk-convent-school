/**
 * In-Memory Safe Caching Middleware
 * Used for public read-heavy endpoints (e.g. /api/settings, /api/hero, /api/campus, /api/notices)
 * Automatically bypassed for authenticated / admin requests or non-GET requests.
 * L.K.S.K Convent School
 */

const cacheStore = new Map();

/**
 * Cache middleware generator
 * @param {number} durationSeconds - Cache time to live in seconds (default 300s = 5 minutes)
 */
function cacheResponse(durationSeconds = 300) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Do NOT cache authenticated admin requests or private session requests
    if (req.headers.authorization || req.headers.cookie?.includes('token')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return next();
    }

    // Key includes URL and query parameters
    const cacheKey = req.originalUrl || req.url;
    const now = Date.now();
    const cachedEntry = cacheStore.get(cacheKey);

    if (cachedEntry && cachedEntry.expiresAt > now) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', `public, max-age=${durationSeconds}, stale-while-revalidate=120`);
      return res.status(cachedEntry.status).json(cachedEntry.body);
    }

    // Set cache headers
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', `public, max-age=${durationSeconds}, stale-while-revalidate=120`);

    // Override res.json to capture response
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      // Only cache successful 200 responses
      if (res.statusCode === 200) {
        cacheStore.set(cacheKey, {
          status: res.statusCode,
          body,
          expiresAt: Date.now() + durationSeconds * 1000,
        });
      }
      return originalJson(body);
    };

    next();
  };
}

/**
 * Clear cached entries by prefix or clear all
 * @param {string} [prefix] - Route prefix to invalidate (e.g. '/api/notices', '/api/settings')
 */
function clearCache(prefix) {
  if (!prefix) {
    cacheStore.clear();
    return;
  }
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key);
    }
  }
}

/**
 * Get count of active cache items
 */
function getCacheSize() {
  const now = Date.now();
  let count = 0;
  for (const [key, entry] of cacheStore.entries()) {
    if (entry.expiresAt > now) {
      count++;
    } else {
      cacheStore.delete(key);
    }
  }
  return count;
}

module.exports = {
  cacheResponse,
  clearCache,
  getCacheSize,
};
