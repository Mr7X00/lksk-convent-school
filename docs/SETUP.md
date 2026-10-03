# L.K.S.K Convent School — Development Environment Setup

**Institution:** L.K.S.K Convent School  
**Campus Address:** Panditpur, Sohawal, Ayodhya, Uttar Pradesh — 224188  
**Lead Developer:** Lav Pandey  
**Official Email:** lkskconventschool@gmail.com  

---

## 1. Prerequisites

Ensure your workstation has the following installed:
- **Node.js:** v18.0.0 or higher (v20+ recommended LTS)
- **npm:** v9.0.0 or higher
- **MongoDB:** v6.0 or higher (locally installed or cloud connection via MongoDB Atlas)
- **Git:** Latest version

---

## 2. Step-by-Step Installation

### Step 2.1: Clone the Repository
```bash
git clone <repository-url>
cd School
```

### Step 2.2: Install Dependencies
Run the monorepo orchestration command to install all packages for both the Node.js backend and the Vite frontend:
```bash
npm run install:all
```
*(Or install manually: `cd backend && npm install && cd ../frontend && npm install`)*

### Step 2.3: Configure Environment Variables
Copy the root `.env.example` blueprint into `backend/.env`:
```bash
cp .env.example backend/.env
```
Open `backend/.env` and verify the minimum local parameters:
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/lksk_school
JWT_SECRET=dev_jwt_secret_lksk_school_2026_secure
CLIENT_ORIGIN=http://localhost:5173
PUBLIC_SITE_URL=http://localhost:5173
```

### Step 2.4: Seed Initial Administrator Account
Seed the initial database-backed superadministrator account (Lav Pandey):
```bash
npm run seed:admin
```
*(Note: If prompted, ensure `ADMIN_INITIAL_PASSWORD` is configured in `backend/.env` or note the output message).*

---

## 3. Running Local Servers

In separate terminal windows, start the backend and frontend:

```bash
# Terminal 1: Start Express.js REST API server (Port 5000)
npm run dev:backend

# Terminal 2: Start Vite Frontend server with Hot Module Reload (Port 5173)
npm run dev:frontend
```

Once running:
- **Public Website:** `http://localhost:5173`
- **Admin CMS Portal:** `http://localhost:5173/admin/`
- **API Health Endpoint:** `http://localhost:5000/api/health`

---

## 4. Running Verification Test Suites

```bash
# Run all automated verification tests (165 tests)
npm run test:all

# Or run specific test suites:
npm run test:backend   # Mongoose models & API route tests
npm run test:auth      # Security & authentication tests
npm run test:cms       # CMS dashboard & CRUD tests
npm run test:routes    # All 29 public page integrity tests
```
