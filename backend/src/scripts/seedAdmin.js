require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const { connectDB } = require('../config/db');

async function seedAdmin() {
  console.log('[Seed] Connecting to MongoDB...');
  await connectDB();

  if (mongoose.connection.readyState !== 1) {
    console.error('[Seed] Could not establish MongoDB connection. Please ensure MongoDB is running and MONGODB_URI is set.');
    process.exit(1);
  }

  if (!process.env.ADMIN_INITIAL_PASSWORD && process.env.NODE_ENV === 'production') {
    console.error('[Seed] Security Error: ADMIN_INITIAL_PASSWORD environment variable must be explicitly defined in production.');
    process.exit(1);
  }

  const name = process.env.ADMIN_INITIAL_NAME || 'Lav Pandey';
  const username = (process.env.ADMIN_INITIAL_USERNAME || 'lavpandey').toLowerCase().trim();
  const email = (process.env.ADMIN_INITIAL_EMAIL || 'lkskconventschool@gmail.com').toLowerCase().trim();
  const password = process.env.ADMIN_INITIAL_PASSWORD || 'LKSK@Admin2026!';

  try {
    let existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }],
    });

    if (existingAdmin) {
      console.log(`[Seed] Administrator '${existingAdmin.username}' (${existingAdmin.email}) already exists.`);
      console.log(`[Seed] ID: ${existingAdmin._id}, Role: ${existingAdmin.role}, Active: ${existingAdmin.isActive}`);
    } else {
      const passwordHash = await Admin.hashPassword(password);
      const newAdmin = await Admin.create({
        name,
        username,
        email,
        passwordHash,
        role: 'superadmin',
        isActive: true,
        tokenVersion: 0,
      });

      console.log(`[Seed] Successfully provisioned administrator account!`);
      console.log(`[Seed] Name: ${newAdmin.name}`);
      console.log(`[Seed] Username: ${newAdmin.username}`);
      console.log(`[Seed] Email: ${newAdmin.email}`);
      console.log(`[Seed] Role: ${newAdmin.role}`);
    }
  } catch (err) {
    console.error('[Seed] Error provisioning administrator:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] Database connection closed.');
    process.exit(0);
  }
}

seedAdmin();
