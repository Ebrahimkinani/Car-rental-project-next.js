const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function testUser() {
  try {
    console.log('🧪 Testing user data...');
    
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
      status: user.status,
      roleType: typeof user.role
    }, null, 2));
    
    // Check role matching
    const staffRoles = ['admin', 'manager', 'employee'];
    const isStaff = staffRoles.includes(user.role);
    console.log('\n🔍 Role check:');
    console.log(`role: "${user.role}"`);
    console.log(`staffRoles: ${JSON.stringify(staffRoles)}`);
    console.log(`includes check: ${isStaff}`);
    
    await client.close();
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testUser();
