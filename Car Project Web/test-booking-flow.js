#!/usr/bin/env node

/**
 * Test Booking Flow
 * This demonstrates how bookings work in your system
 */

const fetch = require('node-fetch');

async function testBookingFlow() {
  console.log('🧪 Testing Booking Flow\n');
  console.log('=' .repeat(50));
  
  try {
    // Step 1: Check if server is running
    console.log('1️⃣ Checking server status...');
    try {
      const response = await fetch('http://localhost:3000/api/init-db');
      const data = await response.json();
      console.log('✅ Server is running');
      console.log(`   Database status: ${data.data.isInitialized ? 'Initialized' : 'Not initialized'}`);
      console.log(`   Categories: ${data.data.categories}`);
      console.log(`   Cars: ${data.data.cars}\n`);
    } catch (error) {
      console.log('❌ Server is not running. Please start it with: npm run dev\n');
      return;
    }
    
    // Step 2: Try to get bookings (this will show mock database)
    console.log('2️⃣ Checking existing bookings...');
    try {
      const response = await fetch('http://localhost:3000/api/bookings', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const bookings = await response.json();
        console.log(`✅ Found ${bookings.length} bookings in mock database`);
        
        if (bookings.length > 0) {
          console.log('   Recent bookings:');
          bookings.slice(0, 3).forEach((booking, index) => {
            console.log(`   ${index + 1}. ${booking.carName} - $${booking.totalAmount} (${booking.status})`);
          });
        } else {
          console.log('   No bookings found. This is normal for a fresh start.');
        }
      } else {
        console.log('⚠️  Could not fetch bookings (authentication required)');
      }
    } catch (error) {
      console.log('⚠️  Could not fetch bookings:', error.message);
    }
    
    console.log('\n3️⃣ How to create a booking:');
    console.log('   a) Go to http://localhost:3000');
    console.log('   b) Browse cars and click on any car');
    console.log('   c) Fill out the booking form');
    console.log('   d) Complete the payment process');
    console.log('   e) Your booking will be saved to the mock database');
    
    console.log('\n4️⃣ How to view your bookings:');
    console.log('   a) Go to http://localhost:3000/bookings');
    console.log('   b) Or use the API: GET http://localhost:3000/api/bookings');
    
    console.log('\n5️⃣ Database Information:');
    console.log('   📍 Current: Mock Database (in-memory)');
    console.log('   📍 Location: src/lib/mock-db.ts');
    console.log('   📍 Storage: Map<string, MockBooking>');
    console.log('   ⚠️  Note: Data resets when server restarts');
    
    console.log('\n6️⃣ To use MongoDB instead:');
    console.log('   a) Set up MongoDB Atlas or local MongoDB');
    console.log('   b) Update MONGODB_URI in .env.local');
    console.log('   c) Restart the server');
    console.log('   d) Bookings will be stored persistently');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testBookingFlow().catch(console.error);
