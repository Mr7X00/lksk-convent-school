# L.K.S.K Convent School — Known Limitations & Operational Constraints

**Institution:** L.K.S.K Convent School  
**Campus Address:** Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188  
**Lead Developer:** Lav Pandey  
**Baseline Version:** v1.0.0 (Release Freeze)  

---

## 1. External & Deployment-Dependent Items

The following items cannot be fully automated within the local repository and require operational provisioning during live server deployment:

| Item | Current Status | Production Dependency |
| :--- | :--- | :--- |
| **Domain & DNS Delegation** | Not configured | Pending client purchase and DNS record mapping of final official `.com` domain. |
| **SSL/TLS Certificates** | Local/Proxy ready | Requires live domain resolution to execute Let's Encrypt / Certbot issuance. |
| **Transactional SMTP** | Resilient fallback active | If SMTP credentials (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`) are not supplied, inquiry emails are logged safely to the server console and persisted to MongoDB without throwing errors to applicants. |
| **Live Uptime Monitoring** | Telemetry ready (`/api/health`) | External ping monitoring (e.g. UptimeRobot, BetterStack) must be linked to the live public domain once active. |
| **Remote Database Cluster** | Local daemon / URI ready | MongoDB connection URI (`MONGODB_URI`) points to `mongodb://127.0.0.1:27017/lksk_school` by default; requires connection string update if using cloud-managed MongoDB Atlas. |

---

## 2. Institutional Information Awaiting Administrative Supply

In accordance with strict content verification rules, no institutional information has been fabricated. The following items remain pending official provision by school management and can be populated via the CMS:

| Information | Current Display State | Administrative Resolution Method |
| :--- | :--- | :--- |
| **Primary School Telephone** | Hidden / Neutral CMS state | Configured in Admin Portal under `Website Settings` &rarr; `Contact Details`. |
| **Official WhatsApp Number** | Floating button suppressed | Configured in Admin Portal under `Website Settings` &rarr; `WhatsApp Configuration`. |
| **Board Affiliation Number** | Stored as neutral placeholder | Configured in Admin Portal under `Website Settings` &rarr; `School Identity`. |
| **District School Code** | Stored as neutral placeholder | Configured in Admin Portal under `Website Settings` &rarr; `School Identity`. |
| **Manager Signed Message** | Neutral institutional card | Uploaded via Admin Portal &rarr; `About Desk`. |
| **Principal Signed Message** | Neutral institutional card | Uploaded via Admin Portal &rarr; `About Desk`. |
| **Official Faculty Roster** | Empty state (`UIStates.empty`) | Uploaded via Admin Portal &rarr; `Faculty Directory`. |
| **Syllabus & Calendar PDFs** | Empty state (`UIStates.empty`) | Uploaded via Admin Portal &rarr; `Document Center`. |
| **Promotional Drone Video** | Campus photo poster active | Hosted on YouTube/Vimeo and configured via CMS Settings. |

---

## 3. Technical & Browser Limitations

1. **Build Tooling Dependencies:** 5 high-severity vulnerabilities are reported by `npm audit` in frontend devDependencies (`chokidar -> braces`). These are locked inside Tailwind CSS v3's file-watcher ecosystem. Upgrading to Tailwind v4 would be a breaking rewrite. These dependencies are strictly build-time and are never served or executed in client browsers.
2. **Browser Compatibility:** Legacy Internet Explorer (IE11) is not supported. All modern Evergreen browsers (Google Chrome, Mozilla Firefox, Microsoft Edge, Apple Safari, and mobile equivalents on iOS/Android) are fully supported.
3. **Session Lifetime:** Administrative JWT tokens expire after 7 days by default, or immediately upon manual logout via database-backed `tokenVersion` revocation.
