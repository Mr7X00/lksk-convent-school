# Deploying L.K.S.K Convent School on Render (Free Tier)

This guide walks you through deploying the complete website, Admin CMS, and API on **Render** (free tier) in under 5 minutes.

---

## Step 1: Push Code to GitHub

1. Ensure your latest code is committed and pushed to your GitHub repository:
   ```bash
   git add .
   git commit -m "Prepare production deployment for Render"
   git push origin main
   ```

---

## Step 2: Set Up Free Cloud MongoDB (MongoDB Atlas)

Render provides web hosting, but MongoDB needs to be hosted on a cloud database like **MongoDB Atlas** (100% free):

1. Go to [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and sign up (free).
2. Create a **Free Shared Cluster (M0)**.
3. Under **Security**:
   - **Database Access:** Add a new user (e.g., username `admin` and choose a secure password).
   - **Network Access:** Add IP `0.0.0.0/0` (Allow access from anywhere).
4. Click **Connect** &rarr; **Drivers** (Node.js) &rarr; Copy the connection URI:
   ```text
   mongodb+srv://admin:<your_password>@cluster0.xxxx.mongodb.net/lksk_school?retryWrites=true&w=majority
   ```

---

## Step 3: Create a Web Service on Render

1. Log in to [dashboard.render.com](https://dashboard.render.com/).
2. Click **New +** &rarr; **Web Service**.
3. Select **"Build and deploy from a Git repository"** and select your GitHub repository.
4. Fill in the service settings:
   - **Name:** `lksk-convent-school` (or your preferred name)
   - **Region:** `Singapore` (closest to India) or your nearest region
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     npm run build
     ```
   - **Start Command:**
     ```bash
     npm start
     ```
   - **Plan:** `Free`

---

## Step 4: Add Environment Variables in Render

Scroll down to the **Environment Variables** section in Render and add:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations & security |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string from Step 2 |
| `JWT_SECRET` | *(click "Generate" or type a 32+ char secret)* | Secret for admin authentication |
| `TRUST_PROXY` | `1` | Enables reverse-proxy IP tracking |
| `ADMIN_INITIAL_PASSWORD`| `YourSecurePassword2026!` | Password for first-time admin login |
| `PUBLIC_SITE_URL` | `https://lksk-convent-school.onrender.com` | Your Render URL (update once assigned) |
| `CLIENT_ORIGIN` | `https://lksk-convent-school.onrender.com` | Same as PUBLIC_SITE_URL |

---

## Step 5: Deploy & First-Time Admin Login

1. Click **Create Web Service**.
2. Render will build the frontend assets, install dependencies, and start the unified server.
3. Once the deployment says **"Live"**, open your assigned URL:
   ```text
   https://lksk-convent-school.onrender.com
   ```
4. Seed your admin account on Render:
   - Go to your Render Web Service dashboard &rarr; **Shell** tab.
   - Run:
     ```bash
     npm run seed:admin
     ```
5. You can now access your Admin Portal live on the internet at:
   ```text
   https://lksk-convent-school.onrender.com/admin/login
   ```
   - **Username:** `lavpandey`
   - **Password:** The password you set in `ADMIN_INITIAL_PASSWORD`.
