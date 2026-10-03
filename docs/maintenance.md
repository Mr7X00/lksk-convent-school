# L.K.S.K Convent School — Operations & Maintenance Manual

Institution: **L.K.S.K Convent School**  
Location: **Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188**  
Lead Developer: **Lav Pandey**  
Official Contact Email: **lkskconventschool@gmail.com**

---

## 1. Content Management Workflows (Admin CMS)

Access the Administrator Portal at: `https://<your-domain>/admin/login`

### 1.1 Managing Announcements & Urgent Alerts
1. Log in to the Admin Portal and navigate to **Announcements**.
2. Click **Create Announcement**.
3. Enter title, message, category (e.g. `Admissions`, `Examinations`, `Urgent`), start date, and end date.
4. Set status to **Active** to broadcast the banner across all website pages immediately.
5. Outdated notices can be unpublished or deleted with a single click.

### 1.2 Managing Admissions Inquiries & CRM Inbox
1. Navigate to **Admission Inquiries**.
2. Review real-time parent submissions (student name, grade, parent contact details, address, submission timestamp).
3. Update inquiry status: `New` &rarr; `In Review` &rarr; `Contacted` &rarr; `Enrolled` / `Rejected`.
4. Add internal administrative notes.
5. Export full inquiry rosters to sanitized CSV format via **Export CSV** for offline committee review.

### 1.3 Updating Official School Documents & Circulars
1. Navigate to **Documents** in the sidebar.
2. Select document category: `Mandatory Disclosure`, `Syllabus`, `Academic Calendar`, `Holiday List`, or `Fee Structure`.
3. Provide the official title, academic session (e.g. `2026–2027`), and upload the PDF file.
4. Click **Publish**. The file is immediately accessible to parents under `/academic/` without code deployment.

### 1.4 Managing Campus Infrastructure & Photo Gallery
1. Navigate to **Gallery & Media**.
2. Create an album (e.g. `Annual Sports Meet`, `Science Exhibition`, `Campus Infrastructure`).
3. Upload WebP/JPEG images. Provide descriptive alt text for accessibility.
4. Set publish status to **Active**.

### 1.5 Managing School Settings & Contact Channels
1. Navigate to **Website Settings**.
2. Update the institutional contact telephone number, official WhatsApp Business number, affiliation code, or school code.
3. Paste the official Google Maps embed iframe URL.
4. Click **Save Settings**. Public footer, contact cards, and WhatsApp triggers update immediately.

---

## 2. Technical Operations & Maintenance

### 2.1 Health Check Monitoring
The application exposes a lightweight, public health endpoint:
```bash
curl -I https://<your-domain>/api/health
```
Expected output:
```json
{
  "status": "ok",
  "institution": "L.K.S.K Convent School",
  "database": {
    "status": "connected"
  }
}
```

### 2.2 Server Log Inspection
When running under PM2:
```bash
# View live real-time unified logs
pm2 logs lksk-school-api

# View error log exclusively
tail -n 100 logs/pm2-error.log
```

### 2.3 Executing Database Backups
Execute the backup utility:
```bash
node scripts/backup-db.js
```
Or directly with MongoDB Database Tools:
```bash
mongodump --uri="$MONGODB_URI" --archive="/backups/lksk_$(date +%F).gz" --gzip
```

### 2.4 Restoring Database from Backup
```bash
mongorestore --uri="$MONGODB_URI" --drop --gzip --archive="/backups/lksk_YYYY-MM-DD.gz"
```
*(Never execute a destructive restore against a live production database without a verified safety copy).*

### 2.5 Deploying a New Release / Code Update
1. Pull new code from the repository:
   ```bash
   git pull origin main
   ```
2. Build updated frontend assets:
   ```bash
   npm --prefix frontend run build
   ```
3. Restart backend service gracefully:
   ```bash
   pm2 reload lksk-school-api
   ```
   *(PM2 reload performs zero-downtime rolling restart).*

### 2.6 Dependency Audits & Routine Updates
```bash
# Audit backend production packages
npm --prefix backend audit --omit=dev

# Update patch/minor dependencies safely
npm --prefix backend update
npm --prefix frontend update
```
