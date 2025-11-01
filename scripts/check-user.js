#!/usr/bin/env node

/**
 * Check User Script
 * Checks if a user exists and their details
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental';

async function checkUser(email) {
  let client;
  
  try {
    console.log(`🔍 Checking user: ${email}`);
    console.log(`📍 Connection URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const users = db.collection('users');
    
    // Check if user exists
    const user = await users.findOne({ 
      email: email.toLowerCase()
    });
    
    if (!user) {
      console.log(`❌ User NOT found: ${email}`);
      console.log('\n📋 Available users:');
      const allUsers = await users.find({}).toArray();
      allUsers.forEach(u => {
        console.log(`   - ${u.email} (${u.role}, ${u.status})`);
      });
    } else {
      console.log(`✅ User FOUND!`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   Name: ${user.firstName || ''} ${user.lastName || ''}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Get email from command line or use default
const email = process.argv[2] || 'sss@gmail.com';

checkUser(email).catch(console.error);

