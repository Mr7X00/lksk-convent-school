# L.K.S.K Convent School — Security Architecture & Guidelines

**Institution:** L.K.S.K Convent School  
**Campus Address:** Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188  
**Lead Developer:** Lav Pandey  
**Official Email:** lkskconventschool@gmail.com  

---

## 1. Security Architecture Summary

The platform employs a multi-tiered security defense-in-depth model:

| Layer | Implementation | Threat Addressed |
| :--- | :--- | :--- |
| **Authentication** | Bcrypt (12 rounds) + JWT (HMAC-SHA256) | Credential theft, unauthorized access |
| **Session Control** | Database-backed `tokenVersion` | Lingering sessions after logout or credential change |
| **Brute-Force Guard** | Express Rate Limit (10 req / 15 min on `/api/auth/login`) | Credential stuffing, dictionary attacks |
| **API Rate Limiting** | Express Rate Limit (200 req / 15 min on `/api/*`) | Denial of Service (DoS), API abuse |
| **NoSQL Sanitization** | `express-mongo-sanitize` | NoSQL query injection (`$where`, `$ne`, `$gt`, etc.) |
| **ReDoS Defense** | `escapeRegex` (bounds length to <= 100 chars) | Catastrophic regular expression backtracking |
| **CSV Injection** | `escapeCsvCell` (escapes `=`, `+`, `-`, `@`, `\t`) | Formula execution in spreadsheet viewers |
| **HTTP Headers** | Helmet (CSP, HSTS, frame-ancestors `'self'`, nosniff) | XSS, Clickjacking, MIME-confusion, Insecure Transport |
| **CORS** | Strict production domain allowlisting with credentials | Cross-site unauthorized API invocations |
| **Audit Logging** | `AuditLog` model & service | Governance auditing and tracking administrative actions |

---

## 2. Sensitive Credential Handling Rules

1. **Passwords:** Never stored in plaintext. Passwords are encrypted using modern 12-round Bcrypt salts. The `passwordHash` field has `select: false` in Mongoose and is never returned in API responses.
2. **Tokens & Secrets:** `JWT_SECRET` must be generated randomly in production (min 32 bytes). It must never be committed to Git or exposed in frontend code.
3. **Logging Hygiene:** The logger utility strictly redacts passwords, tokens, hashes, and secrets before outputting to stdout or log files.
4. **Environment Isolation:** Local `.env` files are excluded in `.gitignore`. Production secrets are stored solely on the host server.

---

## 3. Vulnerability Reporting & Response

If a security flaw or unexpected data exposure is detected:
1. Contact the lead developer immediately at: **`lkskconventschool@gmail.com`**.
2. Include reproduction steps and HTTP request traces.
3. Do not disclose vulnerabilities publicly before patch deployment.
4. Active administrative sessions can be revoked immediately by incrementing `tokenVersion` across all Admin accounts.
