# L.K.S.K Convent School — Database Backup & Recovery Guide

**Institution:** L.K.S.K Convent School  
**Campus Address:** Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188  
**Lead Developer:** Lav Pandey  

---

## 1. Automated Backup Utility

The application provides an automated backup script at `scripts/backup-db.js`.

### Running Manual Backup
```bash
node scripts/backup-db.js
```
This executes `mongodump` against the configured `MONGODB_URI` and generates a timestamped, gzip-compressed archive in `backups/lksk_backup_YYYY-MM-DDTHH-MM-SS.gz`.

### Direct Command via mongodump
```bash
mongodump --uri="mongodb://127.0.0.1:27017/lksk_school" --archive="/backups/lksk_$(date +%F).gz" --gzip
```

---

## 2. Retention Policy

- **Daily Backups:** Retain for 14 days.
- **Weekly Backups:** Retain for 8 weeks.
- **Monthly Backups:** Retain for 12 months.
- If using **MongoDB Atlas**, enable Automated Continuous Cloud Backups with point-in-time recovery.

---

## 3. Safe Restore Testing Procedure

**CRITICAL RULE:** Never execute a restore test directly against the live production database!

### Step 3.1: Spin Up Isolated Test Database
```bash
mongorestore --uri="mongodb://127.0.0.1:27017/lksk_test_restore" --gzip --archive="/backups/lksk_backup_YYYY-MM-DD.gz"
```

### Step 3.2: Verify Record Counts in Test Database
```bash
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://127.0.0.1:27017/lksk_test_restore').then(async () => { const names = await mongoose.connection.db.listCollections().toArray(); console.log('Restored Collections:', names.map(c => c.name)); process.exit(0); });"
```

### Step 3.3: Drop Isolated Test Database After Verification
```bash
mongosh mongodb://127.0.0.1:27017/lksk_test_restore --eval "db.dropDatabase()"
```

---

## 4. Production Database Disaster Recovery

In the event of physical host loss or database corruption:
1. Provision fresh MongoDB instance.
2. Restore verified archive dump:
   ```bash
   mongorestore --uri="$MONGODB_URI" --drop --gzip --archive="/backups/latest_verified_backup.gz"
   ```
3. Restart backend service:
   ```bash
   pm2 restart lksk-school-api
   ```
4. Verify `/api/health` reports status `"ok"` and `"connected"`.
