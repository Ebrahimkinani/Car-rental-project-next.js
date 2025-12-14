const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function compareUsers() {
  try {
    console.log('🔍 Comparing users in both collections...');
    
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db();
    
    const email = 'sss@gmail.com';
    
    // Get from both collections
    const userInUsers = await db.collection('users').findOne({ email });
    const userInAdminUsers = await db.collection('adminUsers').findOne({ email });
    
    console.log('\n📋 From "users" collection (used by login):');
    if (userInUsers) {
      console.log({
        _id: userInUsers._id.toString(),
        email: userInUsers.email,
        role: userInUsers.role,
        status: userInUsers.status
      });
    } else {
      console.log('❌ NOT FOUND');
    }
    
    console.log('\n📋 From "adminUsers" collection (reference only):');
    if (userInAdminUsers) {
      console.log({
        _id: userInAdminUsers._id.toString(),
        email: userInAdminUsers.email,
        role: userInAdminUsers.role,
        status: userInAdminUsers.status
      });
    } else {
      console.log('❌ NOT FOUND');
    }
    
    // Check which one login API uses
    console.log('\n🔐 Login API uses: "users" collection');
    console.log('✅ Role in login collection:', userInUsers?.role);
    
    await client.close();
    
  } catch (error) {
    console.error('Error:', error);
  }
}

compareUsers();
