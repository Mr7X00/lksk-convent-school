const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./routes');
const seoRoutes = require('./routes/seo.routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const mongoSanitize = require('./middlewares/mongoSanitize');
const ApiResponse = require('./utils/apiResponse');
const { logSecurityEvent } = require('./utils/security');

const app = express();

// Trust reverse proxy (load balancers, Cloudflare, Nginx) for accurate client IP in rate limiters
app.set('trust proxy', process.env.TRUST_PROXY ? Number(process.env.TRUST_PROXY) || 1 : 1);

// HTTP Response Compression (Gzip / Brotli)
app.use(
  compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 6,
  })
);

// Production-Grade Security HTTP Headers via Helmet
const isProduction = process.env.NODE_ENV === 'production';

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // Required for Vite dev & HTML inline scripts
          "'unsafe-eval'", // Vite HMR support in development
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
        ],
        fontSrc: [
          "'self'",
          'https://fonts.gstatic.com',
          'data:',
        ],
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
          'https:',
        ],
        frameSrc: [
          "'self'",
          'https://www.google.com',
          'https://maps.google.com',
          'https://www.youtube.com',
        ],
        connectSrc: [
          "'self'",
          'http://localhost:*',
          'http://127.0.0.1:*',
          'https:',
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"], // Clickjacking protection
        upgradeInsecureRequests: isProduction ? [] : null,
      },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: isProduction
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,
    noSniff: true,
  })
);

// Cross-Origin Resource Sharing (CORS) Hardening
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
];

if (process.env.PUBLIC_SITE_URL) {
  try {
    const parsed = new URL(process.env.PUBLIC_SITE_URL);
    if (!allowedOrigins.includes(parsed.origin)) {
      allowedOrigins.push(parsed.origin);
    }
  } catch {
    // Ignore invalid URL
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (isProduction) {
        logSecurityEvent('CORS_ORIGIN_REJECTED', { origin });
        return callback(new Error('Cross-Origin Request Blocked by CORS Policy'), false);
      }

      // Permissive during local development for developer convenience
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    maxAge: 86400, // 24 hours preflight cache
  })
);

// General Request Rate Limiter (200 requests per 15 minutes for APIs)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent('RATE_LIMIT_GLOBAL_API', { ip: req.ip, path: req.originalUrl });
    return ApiResponse.error(
      res,
      'Too many requests from this IP, please try again after 15 minutes.',
      429
    );
  },
});
app.use('/api', apiLimiter);

// HTTP request logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(isProduction ? 'combined' : 'dev'));
}

// Request Body Parsers with conservative size limits to prevent memory exhaustion
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// NoSQL Injection Sanitization: strips keys with $ or . from body, query, and params
app.use(mongoSanitize);

// Mount SEO routes at root (/sitemap.xml, /robots.txt)
app.use('/', seoRoutes);

// Mount API routes
app.use('/api', apiRoutes);

// Root informational API endpoint
app.get('/api/info', (req, res) => {
  return ApiResponse.success(res, 'L.K.S.K Convent School API Service', {
    health: '/api/health',
    documentation: '/docs',
    sitemap: '/sitemap.xml',
    robots: '/robots.txt',
  });
});

// Production Unified Static Frontend Serving (e.g. Render Web Service)
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/sitemap.xml' || req.path === '/robots.txt') {
      return next();
    }

    // If client specifically requests JSON at root, return API discovery info
    if (req.path === '/' && req.headers.accept && req.headers.accept.includes('application/json')) {
      return ApiResponse.success(res, 'L.K.S.K Convent School API Service', {
        health: '/api/health',
        documentation: '/docs',
        sitemap: '/sitemap.xml',
        robots: '/robots.txt',
      });
    }

    const cleanPath = req.path.replace(/\/+$/, '') || '/index';
    const directFile = path.join(frontendDistPath, req.path);
    const htmlFile = path.join(frontendDistPath, `${cleanPath}.html`);
    const indexInDir = path.join(frontendDistPath, req.path, 'index.html');

    if (fs.existsSync(directFile) && fs.statSync(directFile).isFile()) {
      return res.sendFile(directFile);
    }
    if (fs.existsSync(indexInDir)) {
      return res.sendFile(indexInDir);
    }
    if (fs.existsSync(htmlFile)) {
      return res.sendFile(htmlFile);
    }
    const errorPage = path.join(frontendDistPath, '404.html');
    if (fs.existsSync(errorPage)) {
      return res.status(404).sendFile(errorPage);
    }
    return res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // Root informational endpoint when frontend is running separately (e.g. local dev or test mode)
  app.get('/', (req, res) => {
    return ApiResponse.success(res, 'L.K.S.K Convent School API Service', {
      health: '/api/health',
      documentation: '/docs',
      sitemap: '/sitemap.xml',
      robots: '/robots.txt',
    });
  });
}

// 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
