// Quick test to simulate login and check response
const fetch = require('node-fetch');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function testLogin() {
  try {
    console.log('🧪 Testing login flow...');
    
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db();
    
    // Get user
    const user = await db.collection('users').findOne({ email: 'sss@gmail.com' });
    console.log('\n📋 User from database:');
    console.log(JSON.stringify({
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      status: user.status
    }, null, 2));
    
    await client.close();
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testLogin();
