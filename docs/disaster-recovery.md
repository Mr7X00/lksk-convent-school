# L.K.S.K Convent School — Disaster Recovery & Incident Response Plan

**Institution:** L.K.S.K Convent School  
**Campus Location:** Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188  
**Lead Developer & System Administrator:** Lav Pandey  
**Official Email:** lkskconventschool@gmail.com  
**Last Updated:** Academic Session 2026–2027

---

## 1. Objectives & Guiding Principles

This document outlines the standard operating procedures (SOPs) to detect, mitigate, and recover from operational emergencies, system outages, data corruption, and security incidents affecting the official web platform of L.K.S.K Convent School.

**Core Principles:**
1. **Safety of Institutional Data:** Protect personal student and guardian inquiry data from unauthorized access or destruction.
2. **Business Continuity:** Maintain public availability of academic announcements, admission deadlines, and official contact channels.
3. **Transparency & Verification:** Never declare an incident resolved without formal smoke-testing and database integrity verification.

---

## 2. Emergency Disaster Scenarios & Recovery Procedures

### Scenario A: Application Failure (Node.js API Crashed / Non-Responsive)
- **Detection:**
  - Automated uptime monitor detects HTTP 502/503/504 or timeouts on `/api/health`.
  - PM2 logs show restart loops (`pm2 status`).
- **Immediate Action:**
  1. SSH into the server host.
  2. Inspect real-time error logs:
     ```bash
     pm2 logs lksk-school-api --lines 50
     tail -n 100 logs/pm2-error.log
     ```
  3. Verify Node.js process state:
     ```bash
     pm2 restart lksk-school-api
     ```
- **Recovery:**
  - If a corrupted release was deployed, revert to the last stable build:
    ```bash
    git checkout <last-stable-commit-hash>
    npm --prefix frontend run build
    pm2 reload lksk-school-api
    ```
- **Verification:**
  - Execute `curl -I https://<domain>/api/health` and verify HTTP 200 with status `"ok"`.

---

### Scenario B: Database Failure (MongoDB Outage or Unreachable)
- **Detection:**
  - `/api/health` reports HTTP 200 with database status `"disconnected"`.
  - Public forms report friendly 503 "Database service temporarily unavailable" messages.
- **Immediate Action:**
  1. Check MongoDB daemon status:
     ```bash
     systemctl status mongod
     # or for Docker:
     docker ps | grep mongo
     ```
  2. If inactive, restart the service:
     ```bash
     systemctl start mongod
     ```
  3. Inspect disk space and system memory:
     ```bash
     df -h
     free -m
     ```
- **Recovery & Restoration:**
  - If MongoDB database files are corrupted, restore from the latest verified automated snapshot into an isolated verification instance before applying to production:
    ```bash
    mongorestore --uri="$MONGODB_URI" --drop --gzip --archive="/backups/lksk_backup_YYYY-MM-DD.gz"
    ```
- **Verification:**
  - Verify record counts across collections:
    ```bash
    node -e "const { connectDB } = require('./backend/src/config/db'); const { AdmissionInquiry } = require('./backend/src/models'); connectDB().then(async () => { console.log('Inquiries:', await AdmissionInquiry.countDocuments()); process.exit(0); });"
    ```

---

### Scenario C: Media Asset Failure (Corrupted or Missing Photos/PDFs)
- **Detection:**
  - Images fail to load (HTTP 404 in browser console on `/assets/...`).
  - Hero carousel or gallery shows empty fallback boxes.
- **Immediate Action:**
  1. Inspect file system permissions on `frontend/public/assets/` and `frontend/dist/assets/`.
  2. Confirm directory ownership is set to the web process user (e.g. `www-data` or node user).
- **Recovery:**
  - Re-extract assets from Git repository:
    ```bash
    git checkout HEAD -- frontend/public/assets/
    npm --prefix frontend run build
    ```
- **Verification:**
  - Open `/assets/branding/new%20logo%20transparent.png` and `/assets/hero/slide-campus.jpg` directly in browser.

---

### Scenario D: Domain & DNS Failure
- **Detection:**
  - DNS resolution fails (`NXDOMAIN` or `SERVFAIL`).
  - Visitors report site unreachable while server IP is active.
- **Immediate Action:**
  1. Verify domain registration status with registrar (check expiry date and payment status).
  2. Check nameserver propagation via `dig` or `nslookup`:
     ```bash
     dig +short A yourdomain.com
     ```
  3. Ensure DNS records point to the valid public IPv4/IPv6 address of the server.
- **Prevention:**
  - Enable domain auto-renewal with primary and backup payment methods.
  - Set DNS record TTL to 3600 seconds (1 hour) to enable rapid cutovers if required.

---

### Scenario E: Security Incident & Credential Compromise
- **Detection:**
  - `[SECURITY]` warning log indicates unauthorized administrative actions or token abuse.
  - Admin notices unexpected data modifications or unapproved circulars.
- **Immediate Action (Containment):**
  1. Invalidate all active administrator sessions immediately by incrementing `tokenVersion` across all Admin accounts:
     ```bash
     node -e "const { connectDB } = require('./backend/src/config/db'); const Admin = require('./backend/src/models/Admin'); connectDB().then(async () => { await Admin.updateMany({}, { \$inc: { tokenVersion: 1 } }); console.log('All admin sessions revoked'); process.exit(0); });"
     ```
  2. Rotate `JWT_SECRET` in `backend/.env`.
  3. Rotate MongoDB database passwords and SMTP email credentials.
  4. Change the primary administrator password for Lav Pandey.
- **Recovery & Eradication:**
  1. Review `AuditLog` collection to trace unauthorized changes:
     ```bash
     node -e "const { connectDB } = require('./backend/src/config/db'); const { AuditLog } = require('./backend/src/models'); connectDB().then(async () => { const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(20); console.log(JSON.stringify(logs, null, 2)); process.exit(0); });"
     ```
  2. Revert any fraudulent notices or unapproved content changes.
  3. Restart the backend API: `pm2 reload lksk-school-api`.
- **Post-Incident Reporting:**
  - Document the incident timeline, root cause, affected accounts, and mitigation steps taken in an internal post-mortem.

---

## 3. Contact Matrix During Operational Contingencies

| Role | Contact Entity | Responsibility |
| :--- | :--- | :--- |
| **System Architect / Admin** | Lav Pandey | Technical infrastructure, database restoration, server maintenance |
| **Institutional Governance** | L.K.S.K Convent School Office | School authority, public communication, policy decisions |
| **Official Email Channel** | `lkskconventschool@gmail.com` | Primary institutional communication |
