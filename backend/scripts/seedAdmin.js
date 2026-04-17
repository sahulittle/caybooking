import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { User } from '../models/user.model.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Administrator';

    if (!adminEmail || !adminPassword) {
      console.error('Please set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file');
      process.exit(1);
    }

    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      if (!existing.roles.includes('admin')) {
        existing.roles = Array.from(new Set([...existing.roles, 'admin']));
        existing.activeRole = 'admin';
        await existing.save();
        console.log('Updated existing user to include admin role:', adminEmail);
      } else {
        console.log('Admin user already exists:', adminEmail);
      }
      process.exit(0);
    }

    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      roles: ['admin'],
      activeRole: 'admin'
    });

    await adminUser.save();

    console.log('Admin user created:', adminEmail);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
