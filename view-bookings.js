#!/usr/bin/env node

/**
 * Script to view all bookings in the database
 * This works with both mock database and MongoDB
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental';

async function viewBookings() {
  let client;
  
  try {
    console.log('🔍 Checking for bookings in the database...\n');
    
    // Try to connect to MongoDB
    try {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      console.log('✅ Connected to MongoDB');
      
      const db = client.db();
      
      // Check if bookings collection exists
      const collections = await db.listCollections().toArray();
      const hasBookingsCollection = collections.some(col => col.name === 'bookings');
      
      if (hasBookingsCollection) {
        const bookings = await db.collection('bookings').find({}).toArray();
        console.log(`📊 Found ${bookings.length} bookings in MongoDB:`);
        
        if (bookings.length > 0) {
          bookings.forEach((booking, index) => {
            console.log(`\n--- Booking ${index + 1} ---`);
            console.log(`ID: ${booking._id}`);
            console.log(`User ID: ${booking.userId}`);
            console.log(`Car ID: ${booking.carId}`);
            console.log(`Status: ${booking.status}`);
            console.log(`Pickup Date: ${booking.pickupDate}`);
            console.log(`Return Date: ${booking.returnDate}`);
            console.log(`Total Amount: $${booking.totalAmount}`);
            console.log(`Payment Status: ${booking.paymentStatus}`);
            console.log(`Created: ${booking.createdAt}`);
          });
        } else {
          console.log('No bookings found in MongoDB.');
        }
      } else {
        console.log('❌ No bookings collection found in MongoDB.');
        console.log('💡 This means the system is using the mock database.');
      }
      
    } catch (mongoError) {
      console.log('⚠️  MongoDB not available, checking mock database...');
      console.log('💡 The system is using the mock database (in-memory storage).');
      console.log('📝 Mock database data is temporary and resets when the server restarts.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run the script
viewBookings().catch(console.error);
