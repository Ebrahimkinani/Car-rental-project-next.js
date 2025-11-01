#!/usr/bin/env node

/**
 * Database Connection Test Script
 * This script tests the MongoDB connection and initializes the database
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental';

async function testConnection() {
  let client;
  
  try {
    console.log('🔌 Testing MongoDB connection...');
    console.log(`📍 Connection URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    // Test database operations
    const db = client.db();
    console.log(`📊 Database name: ${db.databaseName}`);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`📁 Collections: ${collections.map(c => c.name).join(', ') || 'None'}`);
    
    // Test basic operations
    const testCollection = db.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Test document inserted successfully');
    
    const testDoc = await testCollection.findOne({ test: true });
    console.log('✅ Test document retrieved successfully');
    
    await testCollection.deleteOne({ test: true });
    console.log('✅ Test document deleted successfully');
    
    console.log('\n🎉 Database connection test completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Visit: http://localhost:3000/api/init-db (POST) to initialize with sample data');
    console.log('3. Visit: http://localhost:3000/api/init-db (GET) to check database status');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MongoDB is running locally');
    console.log('2. Check your MONGODB_URI in .env.local');
    console.log('3. For local MongoDB: mongod --dbpath /path/to/your/db');
    console.log('4. For Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Connection closed');
    }
  }
}

// Run the test
testConnection().catch(console.error);
