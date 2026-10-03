# API Documentation — L.K.S.K Convent School REST API

## Base URL
- Development: `http://localhost:5000/api` (or `/api` via Vite dev proxy at `http://localhost:5173/api`)
- Production: `https://<domain>/api`

---

## 1. Unified Response Formats

### Standard Success Response (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Standard Error Response (`400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `429 Too Many Requests`, `500 Internal Error`)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "A valid email address is required"
    }
  ]
}
```

---

## 2. API Route Catalog (17 Endpoints)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/health` | GET | Public | Service health & MongoDB telemetry status |
| `/api/auth/login` | POST | Public (Rate-limited) | Admin login with JWT token issuance |
| `/api/auth/me` | GET | Protected (Bearer) | Retrieve authenticated admin profile |
| `/api/auth/seed-admin` | POST | Bootstrap | Seed initial superadmin (only if collection empty) |
| `/api/settings` | GET | Public | Official school details & website metadata |
| `/api/settings` | PUT | Protected (Admin) | Update school details & settings |
| `/api/hero` | GET | Public | Active homepage hero banner slides |
| `/api/hero` | POST | Protected (Admin) | Create new hero slide |
| `/api/announcements` | GET | Public | Active ticker & notice board announcements |
| `/api/announcements` | POST | Protected (Admin) | Create announcement |
| `/api/admissions` | POST | Public (Rate-limited) | Submit student admission inquiry |
| `/api/admissions` | GET | Protected (Admin) | List admission inquiries with filtering |
| `/api/admissions/:id` | PATCH | Protected (Admin) | Update admission inquiry status & admin notes |
| `/api/contact` | POST | Public (Rate-limited) | Submit general public inquiry |
| `/api/contact` | GET | Protected (Admin) | List general inquiries with status filter |
| `/api/contact/:id` | PATCH | Protected (Admin) | Update contact message status & admin notes |
| `/api/staff` | GET | Public | Faculty list filtered by department & order |
| `/api/staff` | POST | Protected (Admin) | Add faculty member |
| `/api/gallery` | GET | Public | List active photo albums |
| `/api/gallery/:slug` | GET | Public | Retrieve album photos by slug |
| `/api/gallery` | POST | Protected (Admin) | Create photo album |
| `/api/gallery/:albumId/images` | POST | Protected (Admin) | Add photo to album |
| `/api/campus` | GET | Public | Campus infrastructure sections |
| `/api/facilities` | GET | Public | School facilities & amenities |
| `/api/achievements` | GET | Public | Academic, sports, and cultural achievements |
| `/api/achievements/toppers` | GET | Public | Board examination topper hall of fame |
| `/api/testimonials` | GET | Public | Verified parent, student, and alumni reviews |
| `/api/documents` | GET | Public | CBSE mandatory disclosures & official circulars |
| `/api/notices` | GET | Public | Public circulars (active & non-expired) |
| `/api/notices/all` | GET | Protected (Admin) | Full notice archive including drafts & expired |
| `/api/notices/:id` | GET | Public | View individual notice details |
| `/api/notices` | POST | Protected (Admin) | Publish new notice |
| `/api/notices/:id` | PUT | Protected (Admin) | Update notice |
| `/api/notices/:id` | DELETE | Protected (Admin) | Remove notice |
| `/api/academic` | GET | Public | Wings, streams, and curriculum overviews |
| `/api/legal/:slug` | GET | Public | Privacy policy, terms, and regulatory disclosures |

---

## 3. Representative Endpoints In Detail

### `GET /api/health`
```json
{
  "success": true,
  "message": "L.K.S.K Convent School REST API is running successfully",
  "data": {
    "status": "ok",
    "timestamp": "2026-10-02T14:41:20.123Z",
    "uptimeSeconds": 85,
    "environment": "development",
    "version": "1.0.0",
    "school": {
      "name": "L.K.S.K Convent School",
      "location": "Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188",
      "established": 2017,
      "email": "lkskconventschool@gmail.com"
    },
    "database": {
      "stateCode": 1,
      "status": "connected",
      "host": "127.0.0.1",
      "name": "lksk_school"
    }
  }
}
```

### `POST /api/contact`
#### Request Payload
```json
{
  "name": "Sunita Verma",
  "email": "sunita@example.com",
  "phone": "+919876543210",
  "subject": "Transportation Route Inquiry",
  "message": "Does the school transport service cover the Sohawal bypass route?"
}
```
#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Thank you for contacting L.K.S.K Convent School. Your message has been received.",
  "data": {
    "id": "6701a2b3c4d5e6f7a8b9c0d1",
    "createdAt": "2026-10-02T14:41:20.123Z"
  }
}
```
