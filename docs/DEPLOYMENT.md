# L.K.S.K Convent School — Production Deployment Manual

**Institution:** L.K.S.K Convent School  
**Campus Address:** Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188  
**Lead Developer:** Lav Pandey  
**Official Email:** lkskconventschool@gmail.com  

---

## 1. Production Architecture Overview

The system is deployed using a decoupled reverse-proxy architecture:

```text
Visitor HTTPS Request (Port 443)
              │
              ▼
    Nginx Reverse Proxy
    ├── `/` & static assets ──▶ `/var/www/lksk-school/frontend/dist`
    ├── `/sitemap.xml` ────────▶ Proxy to Backend Port 5000
    ├── `/robots.txt` ─────────▶ Proxy to Backend Port 5000
    └── `/api/*` ──────────────▶ Proxy to Express API (Node.js Port 5000)
                                      │
                                      ▼
                               MongoDB Database (Port 27017 or Atlas)
```

---

## 2. Server Provisioning Steps (Ubuntu / Debian VPS)

### Step 2.1: System Packages & Node.js
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx ufw certbot python3-certbot-nginx

# Install Node.js v20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 Process Manager globally
sudo npm install -g pm2
```

### Step 2.2: Clone Codebase & Install
```bash
sudo mkdir -p /var/www/lksk-school
sudo chown -R $USER:$USER /var/www/lksk-school
git clone <repository-url> /var/www/lksk-school
cd /var/www/lksk-school

# Install dependencies
npm run install:all
```

### Step 2.3: Production Environment Variables
Create `/var/www/lksk-school/backend/.env`:
```ini
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://127.0.0.1:27017/lksk_school
JWT_SECRET=replace_with_strong_64_character_random_hex_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=https://yourdomain.com
PUBLIC_SITE_URL=https://yourdomain.com
TRUST_PROXY=1
ADMIN_INITIAL_NAME=Lav Pandey
ADMIN_INITIAL_USERNAME=lavpandey
ADMIN_INITIAL_EMAIL=lkskconventschool@gmail.com
ADMIN_INITIAL_PASSWORD=replace_with_secure_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=lkskconventschool@gmail.com
SMTP_PASSWORD=your_google_app_password
MAIL_FROM="L.K.S.K Convent School" <lkskconventschool@gmail.com>
MAIL_TO=lkskconventschool@gmail.com
```

### Step 2.4: Build Frontend Assets
Compile the static client bundle:
```bash
npm --prefix frontend run build
```
Verify that `frontend/dist/` contains `index.html` and assets.

### Step 2.5: Seed Admin & Start Backend with PM2
```bash
# Seed initial administrator
npm run seed:admin

# Start API service using the production ecosystem configuration
pm2 start ecosystem.config.js --env production

# Persist across system reboots
pm2 save
pm2 startup
```

### Step 2.6: Configure Nginx & SSL/TLS
1. Copy [nginx.conf.example](file:///c:/Users/lavpa/Desktop/School/nginx.conf.example) to `/etc/nginx/sites-available/lksk-school`.
2. Replace `yourdomain.com` with your registered `.com` domain.
3. Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/lksk-school /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```
4. Obtain free SSL/TLS certificate via Let's Encrypt:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

---

## 3. Alternative: Docker & Docker Compose Deployment

If deploying to a container host:
```bash
# Set production variables in .env
docker compose up -d --build
```
This automatically compiles the frontend, links the Node.js API with a dedicated MongoDB container, and starts the service on port 5000.

---

## 4. "Before Going Live" Verification Checklist

Execute this checklist prior to official public announcement:

- [ ] Official `.com` domain registered and DNS A/AAAA records point to server IP.
- [ ] SSL/TLS Certificate active and HTTPS redirection verified.
- [ ] Production `.env` placed securely in `backend/` with strong random `JWT_SECRET`.
- [ ] MongoDB production database connected with authentication enabled.
- [ ] Initial superadmin seeded via `npm run seed:admin` with a strong password.
- [ ] Primary institutional contact telephone number entered in Admin Settings.
- [ ] Official WhatsApp Business number configured in Admin Settings.
- [ ] School Affiliation Number and District School Code entered in Admin Settings.
- [ ] Google Maps embed iframe URL verified and saved in Admin Settings.
- [ ] Manager's Desk and Principal's Desk messages reviewed and published via CMS.
- [ ] Official Faculty Directory reviewed and published via CMS.
- [ ] Academic session 2026–2027 calendar and syllabus PDFs uploaded via Document Center.
- [ ] Automated database backup cron (`scripts/backup-db.js`) scheduled and verified.
- [ ] Health telemetry endpoint (`/api/health`) responding with HTTP 200 and `"status": "ok"`.

---

## 5. "After Going Live" Verification Checklist

Execute this checklist immediately following domain cutover:

- [ ] Open homepage (`https://yourdomain.com`): verify SSL lock icon and loader.
- [ ] Test desktop navigation and mobile drawer menu.
- [ ] Submit a test admission inquiry on `/academic/admission-inquiry/`: verify confirmation box.
- [ ] Submit a test contact inquiry on `/contact/`: verify confirmation feedback.
- [ ] Log in to Admin Portal (`/admin/login`): verify dashboard metrics reflect test submissions.
- [ ] Update test admission inquiry status to `Contacted` and verify CSV export.
- [ ] Click WhatsApp floating button: verify correct phone number and prefilled message.
- [ ] Test Google Maps link on `/contact/`: verify campus destination in Ayodhya.
- [ ] Verify dynamic sitemap at `/sitemap.xml`: confirm URLs use production domain.
- [ ] Verify robots policy at `/robots.txt`: confirm `/admin/` and `/api/` are disallowed.
- [ ] Inspect error log (`pm2 logs lksk-school-api --lines 50`): confirm zero uncaught exceptions.

