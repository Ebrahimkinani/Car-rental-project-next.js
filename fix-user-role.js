const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function fixUserRole() {
  let client;
  
  try {
    console.log('🔧 Fixing user role casing...');
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // Check both collections
    const users = db.collection('users');
    const adminUsers = db.collection('adminUsers');
    
    const email = 'sss@gmail.com';
    
    // Check users collection
    const userInMain = await users.findOne({ email });
    console.log('\n📋 User in "users" collection:');
    console.log(JSON.stringify(userInMain, null, 2));
    
    // Check adminUsers collection
    const userInAdmin = await adminUsers.findOne({ email });
    console.log('\n📋 User in "adminUsers" collection:');
    console.log(JSON.stringify(userInAdmin, null, 2));
    
    // Fix users collection
    if (userInMain && userInMain.role !== userInMain.role.toLowerCase()) {
      console.log('\n🔧 Updating role in users collection from', userInMain.role, 'to', userInMain.role.toLowerCase());
      await users.updateOne(
        { email },
        { $set: { role: userInMain.role.toLowerCase() } }
      );
      console.log('✅ Updated users collection');
    }
    
    // Note: adminUsers collection keeps the capital case for display
    // That's okay as it's only for admin reference
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (client) await client.close();
  }
}

fixUserRole().catch(console.error);
