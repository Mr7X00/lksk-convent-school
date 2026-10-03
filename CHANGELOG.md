# Changelog

All notable changes to the **L.K.S.K Convent School** official web platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-03 — Production-Ready Release

### Added
- **Complete Institutional Frontend:** 33 HTML5 entry points styled with custom Tailwind CSS design system tokens (navy/slate/amber/emerald palette).
- **Core Pages:** Homepage, About (History, Principal's Desk, Manager's Desk, Mission & Vision, Faculty), Academic (Admission Process, Online Inquiry, Toppers, Achievements, Co-curricular, Calendar, Syllabus, Timetable, Notices, Holidays), Campus Infrastructure (11 dedicated wings), Photo Gallery with category filtering, and Contact channels.
- **Institutional Legal Policies:** Comprehensive [frontend/legal/index.html](file:///c:/Users/lavpa/Desktop/School/frontend/legal/index.html) covering student data protection (Privacy Policy), website acceptable use (Terms of Use), and administrative circular precedence (Disclaimer).
- **Administrative CMS Portal:** Secured portal at `/admin/` with dynamic management for Notices, Documents, Staff, Photo Gallery, Testimonials, Achievements, Toppers, and Website Settings.
- **Admission CRM:** Online inquiry intake form with bot-honeypot defenses, input sanitization, and administrative CSV export.
- **Security Hardening:**
  - Database-backed authentication with 12-round Bcrypt password hashing.
  - Brute-force rate limiting on login (10 attempts/15 min).
  - Stateless JWT sessions with database-backed `tokenVersion` for instantaneous session revocation upon logout.
  - NoSQL injection defense via `express-mongo-sanitize`.
  - CSV formula injection escaping.
  - Helmet CSP headers, HSTS, frame-ancestors `'self'`, and nosniff protection.
- **Operational Infrastructure:**
  - Automated database backup utility (`scripts/backup-db.js`).
  - Structured production logger (`backend/src/utils/logger.js`) with automatic credential redacting.
  - Administrative Audit Log model and service (`AuditLog` and `audit.service.js`).
  - Docker containerization (`Dockerfile`, `docker-compose.yml`) and process management (`ecosystem.config.js`).
  - Nginx reverse proxy configuration (`nginx.conf.example`).
  - Disaster recovery and incident response manual (`docs/disaster-recovery.md`).
  - Operations and maintenance manual (`docs/maintenance.md`).

### Changed
- Standardized institutional email to verified `lkskconventschool@gmail.com` across all templates and layout scripts.
- Replaced hardcoded dummy contact telephone numbers with CMS-managed conditional links.
- Updated copyright to `© 2024–2030 L.K.S.K Convent School. All Rights Reserved.` with credit to `Lav Pandey`.
- Aligned dynamic sitemap `/sitemap.xml` and robots `/robots.txt` to reflect production routes including `/legal/`.

### Fixed
- Sanitized test data: removed mock toppers, fake testimonials, and dummy telephone numbers.
- Deployed standardized institutional empty states (`UIStates.empty`) for unpopulated CMS collections.
- Corrected email notification sender and admin dashboard URLs to dynamic environment-based base URLs.

### Security
- Audited production dependencies: 0 known vulnerabilities in production runtime dependencies.
- Verified CORS strict allowlisting in production mode.
- Verified rate limiting on all public API endpoints (200 requests/15 min) and authentication routes (10 requests/15 min).
