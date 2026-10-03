# L.K.S.K Convent School — Environment Variables Reference

**Institution:** L.K.S.K Convent School  
**Campus Address:** Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188  
**Lead Developer:** Lav Pandey  

---

## 1. Backend Environment Variables (`backend/.env`)

| Variable | Required | Default / Example | Purpose |
| :--- | :---: | :--- | :--- |
| `PORT` | No | `5000` | Port on which the Express.js HTTP server listens. |
| `NODE_ENV` | Yes | `production` (in prod), `development` (in dev) | Activates production security policies, HSTS, and strict CORS. |
| `MONGODB_URI` | Yes | `mongodb://127.0.0.1:27017/lksk_school` | MongoDB connection URI (local or MongoDB Atlas connection string). |
| `JWT_SECRET` | Yes | *(Must be set)* | Cryptographic secret for signing administrative JWT tokens. |
| `JWT_EXPIRES_IN`| No | `7d` | Lifetime of admin session token. |
| `CLIENT_ORIGIN` | Yes | `https://yourdomain.com` | Allowed frontend origin for CORS requests. |
| `PUBLIC_SITE_URL`| Yes | `https://yourdomain.com` | Base public canonical URL used for XML sitemaps and Open Graph tags. |
| `TRUST_PROXY` | No | `1` | Enables reverse-proxy IP detection behind Nginx, Cloudflare, or AWS ALB. |
| `ADMIN_INITIAL_NAME` | No | `Lav Pandey` | Superadmin full name for `npm run seed:admin`. |
| `ADMIN_INITIAL_USERNAME`| Yes | `lavpandey` | Superadmin username for `npm run seed:admin`. |
| `ADMIN_INITIAL_EMAIL` | Yes | `lkskconventschool@gmail.com` | Superadmin email address. |
| `ADMIN_INITIAL_PASSWORD`| Yes | *(Set on first setup)* | Superadmin password for initial provisioning. |
| `SMTP_HOST` | No | `smtp.gmail.com` | Outgoing email server hostname. |
| `SMTP_PORT` | No | `587` | Outgoing email server port (usually 587 for TLS). |
| `SMTP_USER` | No | `lkskconventschool@gmail.com` | SMTP username / Google Account email. |
| `SMTP_PASSWORD` | No | `your_app_password` | SMTP App Password (do not use personal email password). |
| `MAIL_FROM` | No | `"L.K.S.K Convent School" <lkskconventschool@gmail.com>` | Sender header in outgoing inquiry notifications. |
| `MAIL_TO` | No | `lkskconventschool@gmail.com` | Administrative recipient of admission inquiry notices. |

---

## 2. Frontend Environment Variables (`frontend/.env`)

| Variable | Required | Default / Example | Purpose |
| :--- | :---: | :--- | :--- |
| `VITE_API_BASE_URL` | No | `/api` | Base path for frontend API requests (proxied by Nginx or Vite dev server). |

---

## 3. Important Rules

- **Never Commit Secrets:** Ensure `.env` is listed in `.gitignore`.
- **Do Not Expose Secrets in Frontend:** The Vite frontend must never reference backend secrets (e.g. `JWT_SECRET` or `MONGODB_URI`).
