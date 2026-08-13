const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('../config/db');
const User = require('../models/User');

const seedAdmin = async () => {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error('ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD are required');
  }

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters');
  }

  await connectDB();

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    if (existingAdmin.email === email) {
      console.log('The configured admin already exists');
      return;
    }

    throw new Error('An admin already exists; refusing to create another bootstrap admin');
  }

  const existingUser = await User.findOne({ email }).select('+password');
  if (existingUser) {
    existingUser.name = name;
    existingUser.password = password;
    existingUser.role = 'admin';
    await existingUser.save();
    console.log('Existing staff user promoted to admin');
    return;
  }

  await User.create({ name, email, password, role: 'admin' });
  console.log('Admin user created');
};

if (require.main === module) {
  seedAdmin()
    .catch((error) => {
      console.error(`Admin seed failed: ${error.message}`);
      process.exitCode = 1;
    })
    .finally(async () => {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    });
}

module.exports = seedAdmin;
