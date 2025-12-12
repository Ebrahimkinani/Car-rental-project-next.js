const { MongoClient } = require('mongodb');

async function clearDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/car-rental');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('car-rental');
    
    // Clear all collections
    await db.collection('cars').deleteMany({});
    await db.collection('categories').deleteMany({});
    
    console.log('✅ Database cleared successfully');
    console.log('All sample data has been removed');
    console.log('The database now contains only real data that you add through the admin interface');
    
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await client.close();
  }
}

clearDatabase();
