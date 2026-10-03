# L.K.S.K Convent School — Official Web Platform & Production Deployment Guide

Official, production-engineered web platform and administrative Content Management System (CMS) for **L.K.S.K Convent School**, Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188.

- **Developer & System Administrator:** Lav Pandey
- **Institutional Year of Establishment:** 2017
- **Official Institutional Email:** lkskconventschool@gmail.com
- **Architecture Pattern:** Decoupled HTML5 / Tailwind CSS / Vanilla JS Frontend + Express.js REST API + MongoDB / Mongoose

---

## 1. Architectural Overview & System Stack

The web platform is designed as an accessible, high-performance, and secure system compliant with CBSE/State institutional disclosure standards.

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, Tailwind CSS (JIT), Vanilla JavaScript | Responsive client interface, semantic UI, accessibility (`prefers-reduced-motion`) |
| **Frontend Tooling** | Vite v6 | Fast local HMR development and optimized production asset compilation |
| **Backend REST API** | Node.js (>= 18), Express.js v4 | Centralized REST endpoints (`/api/*`), validation, and business logic |
| **Database** | MongoDB with Mongoose v8 ODM | Persistent document database for 18 institutional models and CMS schemas |
| **Authentication & RBAC** | JWT (jsonwebtoken), 12-round Bcrypt (bcryptjs) | Administrator authentication, session revocation, and role-based guards |
| **Security & Headers** | Helmet, Express-Rate-Limit, CORS, Mongo-Sanitize | CSP, Clickjacking mitigation, NoSQL injection defenses, and brute-force protection |
| **Notification Engine** | Nodemailer | Asynchronous SMTP dispatch for admission and contact notifications |

---

## 2. Directory Structure

```text
/
├── assets/                     # Raw branding, high-res crests, and media
│   └── branding/               # Transparent school logos, crest graphics
├── backend/                    # Node.js + Express REST API
│   ├── src/
│   │   ├── config/             # MongoDB connection & runtime options
│   │   ├── controllers/        # Route controllers (auth, content, health, inquiry, seo)
│   │   ├── middlewares/        # Auth, rate limiting, validation, NoSQL sanitize, errors
│   │   ├── models/             # 18 Mongoose models (Admin, Notice, Document, etc.)
│   │   ├── routes/             # REST route endpoints
│   │   ├── scripts/            # Admin provisioning script (seedAdmin.js)
│   │   ├── services/           # Business services (auth, inquiry, content, email)
│   │   ├── utils/              # Security helpers, regex escaping, CSV formula sanitization
│   │   ├── app.js              # Express app definition & security middlewares
│   │   └── server.js           # Server bootstrap & graceful shutdown listeners
│   ├── tests/                  # 5 automated test verification suites (164 tests)
│   ├── .env.example            # Backend environment blueprint
│   └── package.json            # Backend scripts and dependencies
├── frontend/                   # Client-side web application
│   ├── public/                 # Static public files (robots.txt, sitemap.xml, assets)
│   ├── src/                    # Source styles and component scripts
│   ├── about/                  # About institution, Manager, Principal, Faculty pages
│   ├── academic/               # Admissions, Toppers, Achievements, Notices, Calendar
│   ├── admin/                  # Secure administrator login and CMS portal
│   ├── campus/                 # 10 infrastructure showcase pages
│   ├── contact/                # Official contact channels and interactive location
│   ├── gallery/                # Category-filtered media gallery & album viewer
│   ├── dist/                   # Production build artifact (compiled via Vite)
│   ├── index.html              # Institutional homepage
│   ├── 404.html                # Branded error page
│   ├── tailwind.config.js      # Custom school design system theme tokens
│   ├── vite.config.js          # Multi-page build discovery & dev proxy
│   └── package.json
├── docs/                       # Project architectural & operational documentation
│   ├── SETUP.md                # Development environment setup & onboarding
│   ├── DEPLOYMENT.md           # Production VPS & Docker deployment manual
│   ├── SECURITY.md             # Security architecture & vulnerability guidelines
│   ├── ENVIRONMENT.md          # Environment variable reference
│   ├── BACKUP-RECOVERY.md      # Database backup & safe disaster recovery
│   ├── admin-guide.md          # Non-technical Administrator CMS user manual
│   ├── developer-guide.md      # Full technical architecture & maintainer manual
│   ├── maintenance.md          # Operational routine maintenance manual
│   └── disaster-recovery.md    # Emergency incident response procedures
├── scripts/                    # Verification and backup utility scripts
├── .env.example                # Root environment guide
├── package.json                # Monorepo task orchestration
├── CHANGELOG.md                # Version history & release notes
└── README.md                   # This production manual
```

---

## 2.1 Documentation Index

| Guide | Description | Audience |
| :--- | :--- | :--- |
| [docs/SETUP.md](file:///c:/Users/lavpa/Desktop/School/docs/SETUP.md) | Local development setup, prerequisites, seed commands | Developers |
| [docs/DEPLOYMENT.md](file:///c:/Users/lavpa/Desktop/School/docs/DEPLOYMENT.md) | Ubuntu VPS, Nginx, Let's Encrypt, PM2, Docker guide | DevOps / SysAdmins |
| [docs/SECURITY.md](file:///c:/Users/lavpa/Desktop/School/docs/SECURITY.md) | Threat mitigation, headers, Bcrypt, NoSQL sanitize | Security / Developers |
| [docs/ENVIRONMENT.md](file:///c:/Users/lavpa/Desktop/School/docs/ENVIRONMENT.md) | Complete environment variable specifications | All Engineers |
| [docs/BACKUP-RECOVERY.md](file:///c:/Users/lavpa/Desktop/School/docs/BACKUP-RECOVERY.md) | MongoDB backup procedures and isolated restore testing | SysAdmins |
| [docs/admin-guide.md](file:///c:/Users/lavpa/Desktop/School/docs/admin-guide.md) | Non-technical visual guide for CMS content updates | School Staff / Admin |
| [docs/developer-guide.md](file:///c:/Users/lavpa/Desktop/School/docs/developer-guide.md) | In-depth engineering manual, models, routes, pipeline | Lead Developers |
| [docs/maintenance.md](file:///c:/Users/lavpa/Desktop/School/docs/maintenance.md) | Operational routine maintenance & health monitoring | SysAdmins |
| [docs/disaster-recovery.md](file:///c:/Users/lavpa/Desktop/School/docs/disaster-recovery.md) | Emergency incident response & outage playbooks | Technical Team |
| [CHANGELOG.md](file:///c:/Users/lavpa/Desktop/School/CHANGELOG.md) | Semantic version release history (Phases 1–16) | All |

---

## 3. Environment Configuration

All environment variables must be configured before running or deploying. **Never commit `.env` files to version control.**

### Backend Configuration (`backend/.env`)

```ini
# Application Mode and Port
PORT=5000
NODE_ENV=production

# Database Connection (MongoDB Local or MongoDB Atlas Cloud)
MONGODB_URI=mongodb://127.0.0.1:27017/lksk_school

# Client URL & CORS Allowed Origin
CLIENT_ORIGIN=https://lkskconvent.com
PUBLIC_SITE_URL=https://lkskconvent.com

# Reverse Proxy Trust (1 if behind Nginx, Caddy, Cloudflare, or AWS ALB)
TRUST_PROXY=1

# JWT Secret (Generate a strong random 64-character secret in production)
JWT_SECRET=generate_strong_random_secret_using_crypto
JWT_EXPIRES_IN=7d

# Initial Administrator Profile (Used by `npm run seed:admin`)
ADMIN_INITIAL_NAME=Lav Pandey
ADMIN_INITIAL_USERNAME=lavpandey
ADMIN_INITIAL_EMAIL=lkskconventschool@gmail.com
ADMIN_INITIAL_PASSWORD=ChooseStrongAdminPassword#2026

# SMTP Email Notification Credentials (Optional, falls back gracefully if unset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
MAIL_FROM="L.K.S.K Convent School" <noreply@lkskconvent.com>
MAIL_TO=lkskconventschool@gmail.com
```

### Frontend Configuration (`frontend/.env`)

```ini
# Base URL for API requests
VITE_API_BASE_URL=/api
```

---

## 4. Local Development Workflow

### Step 1: Install Dependencies
```bash
npm run install:all
```

### Step 2: Start Development Servers
Open two terminal windows:

```bash
# Terminal 1 — Backend Express REST API (port 5000):
npm run dev:backend

# Terminal 2 — Frontend Client via Vite (port 5173 with HMR):
npm run dev:frontend
```

The frontend client will be available at `http://localhost:5173` and automatically proxies `/api/*` requests to the backend server at `http://localhost:5000`.

---

## 5. Automated Verification & Test Suites

The project includes 5 comprehensive verification test suites comprising **164 automated assertions**:

```bash
# Run all backend and security verification suites:
npm run test:backend

# Run route, page file integrity, and HTTP status verification:
npm run test:routes

# Run full project test verification:
npm run test:all
```

### Verification Test Breakdown

| Suite | File | Tests | Coverage |
| :--- | :--- | :---: | :--- |
| **Model & Schemas** | `backend/tests/verify-backend.js` | 37 | 18 Mongoose models, validation rules, 404 handler, health endpoint |
| **Authentication & Auth** | `backend/tests/verify-auth.js` | 28 | Bcrypt salt/hash, lockout logic, JWT verification, token expiration, rate limiter |
| **CMS & Dashboard** | `backend/tests/verify-cms.js` | 29 | Stats aggregation, protected CRUD operations across all content sections |
| **CRM & Inquiries** | `backend/tests/verify-phase8.js` | 28 | Admissions inbox, contact inquiries, honeypot spam protection, CSV export guards |
| **Security Hardening** | `backend/tests/verify-phase11-security.js` | 42 | NoSQL operator stripping, mass-assignment blocking, ReDoS escaping, Helmet headers |
| **Total** | | **164** | **100% Pass Rate (0 Failures)** |

---

## 6. Initial Administrator Account Provisioning

To securely provision the primary administrator account (**Lav Pandey**) in a fresh database:

```bash
# Ensure MONGODB_URI and ADMIN_INITIAL_PASSWORD are set in backend/.env
npm run seed:admin
```

- In production (`NODE_ENV=production`), the script strictly requires `ADMIN_INITIAL_PASSWORD` to be explicitly defined.
- If the account already exists, the script prevents duplicate creation and reports existing record status without overwriting passwords.
- The web endpoint `/api/auth/seed-admin` is permanently disabled in production mode (`403 Forbidden`).

---

## 7. Production Build & Deployment Architecture

### Step 1: Compile Optimized Frontend Assets
```bash
npm run build:frontend
```
This runs Vite in production mode, compiling all 28 HTML pages, minifying JavaScript modules, tree-shaking Tailwind CSS down to ~10 kB gzipped, and emitting the static build into `frontend/dist`.

### Step 2: Deployment Topologies

#### Topology A: Standard Reverse Proxy (Recommended)
Use **Nginx** or **Caddy** to serve static files from `frontend/dist` directly with caching, and reverse-proxy `/api` requests to the Node.js backend.

**Sample Nginx Configuration (`/etc/nginx/sites-available/lkskconvent.conf`):**
```nginx
server {
    listen 80;
    server_name lkskconvent.com www.lkskconvent.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name lkskconvent.com www.lkskconvent.com;

    ssl_certificate /etc/letsencrypt/live/lkskconvent.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lkskconvent.com/privkey.pem;

    # Static Frontend Build
    root /var/www/lksk-school/frontend/dist;
    index index.html;

    # Gzip / Brotli Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Static Cache Rules
    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # API Proxy to Express Backend
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Sitemap and Robots Proxy
    location = /sitemap.xml {
        proxy_pass http://127.0.0.1:5000/sitemap.xml;
    }

    location = /robots.txt {
        proxy_pass http://127.0.0.1:5000/robots.txt;
    }

    # Frontend Page Fallback
    location / {
        try_files $uri $uri/ $uri.html /index.html =404;
    }
}
```

#### Topology B: Process Management (PM2)
Manage the Express server using PM2 to guarantee zero downtime and automatic recovery across restarts:

```bash
# Install PM2 globally
npm install -g pm2

# Start backend process in production mode
NODE_ENV=production pm2 start backend/src/server.js --name "lksk-api"

# Save process list for system reboot persistence
pm2 save
pm2 startup
```

---

## 8. Database Backup & Disaster Recovery Procedure

### Automated Backup via `mongodump`
Schedule a daily cron job to create encrypted archive dumps:

```bash
# Local or Remote MongoDB Backup Command:
mongodump --uri="mongodb://127.0.0.1:27017/lksk_school" --gzip --archive="/backups/lksk_school_$(date +%F).gz"
```

### Database Restoration via `mongorestore`
```bash
# Restore from archive dump:
mongorestore --uri="mongodb://127.0.0.1:27017/lksk_school" --drop --gzip --archive="/backups/lksk_school_YYYY-MM-DD.gz"
```

### Retention Policy Recommendation
- **Daily Backups:** Retain for 14 days.
- **Weekly Backups:** Retain for 8 weeks.
- **Monthly Backups:** Retain for 12 months.
- If utilizing **MongoDB Atlas**, enable Automated Continuous Cloud Backups with point-in-time recovery.

---

## 9. Production Readiness Checklist

Before public domain DNS cutover, verify:

### Infrastructure & Server
- [ ] Node.js v18+ installed on production host.
- [ ] MongoDB connection verified with strong authentication.
- [ ] Production environment variables (`.env`) securely placed on server.
- [ ] `NODE_ENV=production` is set.
- [ ] Strong random `JWT_SECRET` generated (min 32 bytes).
- [ ] Reverse proxy `trust proxy` configured for real IP forwarding.
- [ ] SSL/TLS Certificate installed and active (HTTPS enforced).
- [ ] PM2 or systemd service active for backend process monitoring.

### Application & Security
- [ ] Initial administrator created via `npm run seed:admin`.
- [ ] Default administrator password changed immediately upon first login.
- [ ] Rate limiters active on `/api/auth/login` (10 req/15 min) and `/api` (200 req/15 min).
- [ ] Helmet security headers verified (`X-Content-Type-Options: nosniff`, `frame-ancestors 'self'`).
- [ ] Production health check `/api/health` returns status `ok` with database host masked.
- [ ] Frontend production build completed without errors (`npm run build:frontend`).

### Content & Institutional Data
- [ ] School contact telephone verified and updated via Admin Settings.
- [ ] CBSE/State Board Affiliation Code entered in Admin Settings.
- [ ] District School Registration Code entered in Admin Settings.
- [ ] Official Google Maps iframe embed URL configured in Admin Settings.
- [ ] WhatsApp Business number confirmed.
- [ ] High-resolution campus and faculty photography uploaded via Admin CMS.

---

## 10. Troubleshooting Guide

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **MongoDB Connection Failure** | Daemon not running or URI malformed | Verify `mongod` is active (`systemctl status mongod`) and check `MONGODB_URI` in `backend/.env`. |
| **CORS Rejected in Browser** | Origin mismatch | Update `CLIENT_ORIGIN` in `backend/.env` to match the exact protocol and domain of the frontend. |
| **Rate Limit 429 Errors** | Forwarded IPs not trusted | Ensure `TRUST_PROXY=1` is set in `backend/.env` so Express reads real client IPs from `X-Forwarded-For`. |
| **SMTP Delivery Failure** | Missing credentials or port blocked | Verify SMTP host, port 587, and App Password. Check application logs; inquiries are still saved safely in MongoDB even if SMTP is offline. |
| **Admin Login "Invalid credentials"** | Incorrect password or unseeded admin | Run `npm run seed:admin` with `ADMIN_INITIAL_PASSWORD` set in `backend/.env`. |
| **Frontend 404 on Refresh** | Web server not rewriting clean URLs | Configure Nginx `try_files $uri $uri/ $uri.html /index.html =404;`. |

---

## 11. Known Verified Institutional Information

The following records have been formally established in the system:

```text
Institution:      L.K.S.K Convent School
Address:          Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188
Established:      2017
Official Email:   lkskconventschool@gmail.com
Lead Developer:   Lav Pandey
```

*Note on Pending Real Information:*  
Items requiring final real-world values from the school administration (primary telephone number, official affiliation code, district school code, faculty member biographies, student enrollment figures, and actual photo album files) can be configured directly at any time through the **Administrator CMS Portal** (`/admin`) without modifying codebase files.

---

## 12. Support & Maintenance

Developed and maintained by **Lav Pandey** for **L.K.S.K Convent School**.
For technical inquiries or administration access support, contact `lkskconventschool@gmail.com`.
