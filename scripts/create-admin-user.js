#!/usr/bin/env node

/**
 * Create Admin User Script
 * Creates a default admin user if one doesn't exist
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental';

async function createAdminUser() {
  let client;
  
  try {
    console.log('🔐 Creating admin user...');
    console.log(`📍 Connection URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const users = db.collection('users');
    const adminUsers = db.collection('adminUsers');
    
    // Check if admin user already exists in both collections
    const existingAdminUser = await users.findOne({ 
      email: 'admin@wheelzie.com',
      role: 'admin'
    });
    
    const existingAdminUserData = await adminUsers.findOne({ 
      email: 'admin@wheelzie.com'
    });
    
    if (existingAdminUser && existingAdminUserData) {
      console.log('ℹ️  Admin user already exists in both collections');
      console.log('ℹ️  Skipping creation...');
      return;
    }
    
    // Hash password
    const password = 'admin123';
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Admin permissions - full access
    const adminPermissions = [
      { module: 'dashboard', view: true },
      { module: 'bookings', view: true, create: true, edit: true, delete: true, export: true },
      { module: 'units', view: true, create: true, edit: true, delete: true, export: true },
      { module: 'clients', view: true, create: true, edit: true, delete: true, export: true },
      { module: 'financials_income', view: true, export: true },
      { module: 'financials_expenses', view: true, export: true },
      { module: 'calendar', view: true, create: true, edit: true, delete: true },
      { module: 'messages', view: true, create: true, delete: true },
      { module: 'settings', view: true, edit: true },
      { module: 'permissions', view: true }
    ];
    
    // Create admin user in users collection (for authentication)
    if (!existingAdminUser) {
      const adminUser = {
        email: 'admin@wheelzie.com',
        passwordHash,
        role: 'admin',
        status: 'active',
        firstName: 'Admin',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await users.insertOne(adminUser);
      console.log('✅ Created user in users collection (for login)');
    }
    
    // Create admin user in adminUsers collection (for admin panel)
    if (!existingAdminUserData) {
      const now = new Date();
      const adminUserData = {
        name: 'Admin User',
        email: 'admin@wheelzie.com',
        password: password, // For admin reference
        role: 'Admin',
        branch: 'Main Branch',
        status: 'Active',
        permissions: adminPermissions,
        createdAt: now,
        updatedAt: now
      };
      
      await adminUsers.insertOne(adminUserData);
      console.log('✅ Created user in adminUsers collection (for admin panel)');
    }
    
    console.log('\n✅ Admin user created successfully in both collections!');
    console.log('\n📋 Login Credentials:');
    console.log(`   Email: admin@wheelzie.com`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: admin`);
    console.log('\n⚠️  Remember to change the password after first login!');
    
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Connection closed');
    }
  }
}

// Run the script
createAdminUser().catch(console.error);

