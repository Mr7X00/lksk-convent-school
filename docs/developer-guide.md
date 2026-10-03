# L.K.S.K Convent School — Developer & Maintainer Guide

**Institution:** L.K.S.K Convent School  
**Location:** Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188  
**Lead Developer:** Lav Pandey  
**Official Email:** lkskconventschool@gmail.com  
**Repository Architecture:** Decoupled Monorepo (Node.js/Express REST API + HTML5/Tailwind/Vanilla JS Frontend)

---

## 1. System Architecture & Component Interactions

```text
Incoming Client Request (HTTPS)
        │
        ▼
   Reverse Proxy (Nginx / Cloudflare)
   ├── Static Files (`/`, `/assets/*`, `/gallery/*`, `/academic/*`) ──▶ Frontend Dist (`frontend/dist`)
   ├── Dynamic SEO (`/sitemap.xml`, `/robots.txt`) ─────────────────▶ Backend API (Express.js)
   └── API Endpoints (`/api/*`) ─────────────────────────────────────▶ Node.js REST API (Port 5000)
                                                                           │
                                          ┌────────────────────────────────┴─────────────────────────┐
                                          ▼                                                          ▼
                                MongoDB Database (Port 27017)                              SMTP Mail Transport
                                19 Mongoose Schemas (CMS, CRM, Auditing)                  (Async Inquiries Dispatch)
```

---

## 2. Directory Layout & Key Modules

```text
/
├── backend/
│   ├── src/
│   │   ├── config/            # MongoDB connection & readiness checks (db.js)
│   │   ├── controllers/       # HTTP request handlers (auth, content, health, inquiry, seo)
│   │   ├── middlewares/       # Security guards, JWT validation, rate-limiting, error handler
│   │   ├── models/            # 19 Mongoose schemas (Admin, Notice, Document, AuditLog, etc.)
│   │   ├── routes/            # Express route mountings
│   │   ├── services/          # Domain services (auth, content, email, inquiry, audit)
│   │   ├── utils/             # Helpers: apiResponse, apiError, logger, security, csvEscaper
│   │   ├── app.js             # Express application & middleware assembly
│   │   └── server.js          # HTTP listener with graceful SIGTERM/SIGINT shutdown
│   ├── tests/                 # 5 comprehensive test suites (165 automated tests)
│   ├── .env.example           # Backend environment configuration template
│   └── package.json           # Backend scripts and dependencies
├── frontend/
│   ├── public/                # Static assets (robots.txt, sitemap.xml, branding, photos)
│   ├── src/
│   │   ├── css/               # Tailwind input & custom styles
│   │   └── js/                # Client JavaScript ES modules & page controllers
│   ├── about/                 # About pages (history, manager, principal, faculty)
│   ├── academic/              # Academic pages (admissions, curriculum, notices, toppers)
│   ├── admin/                 # Administrator login and CMS single-page portal
│   ├── campus/                # 11 campus infrastructure showcase pages
│   ├── contact/               # Contact channels and Google Maps integration
│   ├── gallery/               # Photo gallery and category filter viewer
│   ├── legal/                 # Privacy Policy, Terms of Use, Disclaimer
│   ├── dist/                  # Compiled production static bundle
│   ├── index.html             # Homepage
│   ├── 404.html               # Custom 404 error page
│   ├── tailwind.config.js     # Custom design system tokens
│   ├── vite.config.js         # Multi-page build discovery and dev proxy
│   └── package.json           # Frontend tooling
├── docs/                      # Technical and operational documentation
├── scripts/                   # Verification and backup utility scripts
└── README.md                  # Quickstart and production reference
```

---

## 3. Database Models (19 Mongoose Schemas)

1. **Admin:** Administrator accounts with Bcrypt password hashing, account lockout (`failedLoginAttempts`, `lockUntil`), and `tokenVersion` for session revocation.
2. **AuditLog:** Records governance events (`LOGIN`, `LOGOUT`, `CONTENT_UPDATED`, `INQUIRY_STATUS_CHANGED`).
3. **WebsiteSettings:** Global school configuration (address, phone, email, affiliation codes, social links, Google Maps embed URL, WhatsApp number).
4. **HeroSlide:** Homepage carousel slides with image URLs, captions, order, and active flags.
5. **Announcement:** Top banner alerts with category and auto-expiration dates (`startDate`, `endDate`).
6. **AdmissionInquiry:** CRM records for student admission inquiries with honeypot bot detection and administrative notes.
7. **ContactInquiry:** General inquiries received through the contact page.
8. **Staff:** Faculty and administrative staff directory records.
9. **Notice:** Circulars and notices with category, publish date, and optional attachment.
10. **Document:** Academic PDFs, syllabi, holiday lists, and mandatory disclosures.
11. **GalleryAlbum:** Photo albums with slug, cover image, and category tags.
12. **GalleryImage:** Individual photographs associated with albums.
13. **CampusPage:** Dedicated content for the 11 campus infrastructure wings.
14. **Facility:** Highlights for classrooms, laboratories, sports, and transport.
15. **Achievement:** Student awards and competitive distinctions.
16. **Topper:** Board examination honors and academic milestones.
17. **Testimonial:** Verified parent and alumni endorsements.
18. **AcademicContent:** Curriculum structure and academic policies.
19. **LegalPage:** Stored policy documents.

---

## 4. Authentication, Authorization & Security Pipeline

- **Password Hashing:** 12-round Bcrypt via `Admin.hashPassword()`. Never stored in plaintext.
- **JWT Verification:** `verifyToken` middleware decodes Bearer token and validates `tokenVersion` against the database.
- **RBAC:** `restrictTo('superadmin', 'admin', 'editor')` restricts routes based on role.
- **NoSQL Injection Defense:** `express-mongo-sanitize` strips `$where`, `$ne`, `$gt`, and dot notation from all inputs.
- **ReDoS Mitigation:** `escapeRegex` truncates query inputs to safe limits (80–100 characters) and escapes regex characters.
- **Rate Limiting:**
  - Login attempts: 10 requests per 15 minutes (`/api/auth/login`).
  - Global API: 200 requests per 15 minutes (`/api/*`).
- **Security Headers:** Helmet enforces `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and HSTS.

---

## 5. Local Setup & Testing Workflow

```bash
# 1. Install dependencies across backend and frontend
npm run install:all

# 2. Copy and configure environment variables
cp .env.example backend/.env

# 3. Start local development servers
npm run dev:backend     # Express API on http://localhost:5000
npm run dev:frontend    # Vite HMR on http://localhost:5173

# 4. Seed initial superadmin account
npm run seed:admin

# 5. Run test suites
npm run test:all        # Runs backend verification and route integrity tests
```

---

## 6. Safe Dependency Update Guidelines

Before applying dependency updates:
1. Always check changelogs for breaking changes.
2. Run `npm --prefix backend audit --omit=dev` to verify production dependency status.
3. Test updates in an isolated environment before production deployment:
   ```bash
   npm --prefix backend update
   npm --prefix frontend update
   npm run test:all
   npm --prefix frontend run build
   ```
4. Never force major version updates with `npm audit fix --force` without verifying configuration compatibility (e.g. Tailwind v3 to v4).
