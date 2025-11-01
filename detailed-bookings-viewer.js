#!/usr/bin/env node

/**
 * Detailed Bookings Viewer
 * Shows comprehensive booking information with car details
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental';

async function viewDetailedBookings() {
  let client;
  
  try {
    console.log('🔍 Detailed Bookings Viewer\n');
    console.log('=' .repeat(60));
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db();
    
    // Get all bookings with car details
    const bookings = await db.collection('bookings').aggregate([
      {
        $lookup: {
          from: 'cars',
          localField: 'carId',
          foreignField: '_id',
          as: 'carDetails'
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]).toArray();
    
    console.log(`📊 Total Bookings: ${bookings.length}\n`);
    
    if (bookings.length === 0) {
      console.log('❌ No bookings found.');
      return;
    }
    
    // Display each booking in detail
    bookings.forEach((booking, index) => {
      const car = booking.carDetails[0] || {};
      
      console.log(`🚗 BOOKING #${index + 1}`);
      console.log('─'.repeat(40));
      console.log(`📋 Booking ID: ${booking._id}`);
      console.log(`👤 User ID: ${booking.userId}`);
      console.log(`📅 Booking Date: ${new Date(booking.bookingDate).toLocaleString()}`);
      console.log(`📅 Created: ${new Date(booking.createdAt).toLocaleString()}`);
      console.log(`📅 Updated: ${new Date(booking.updatedAt).toLocaleString()}`);
      console.log('');
      
      console.log('🚙 Car Details:');
      console.log(`   Name: ${car.name || 'Unknown'}`);
      console.log(`   Model: ${car.model || 'Unknown'}`);
      console.log(`   Brand: ${car.brand || 'Unknown'}`);
      console.log(`   Year: ${car.year || 'Unknown'}`);
      console.log(`   Price: $${car.price || 0}/day`);
      console.log('');
      
      console.log('📅 Rental Details:');
      console.log(`   Pickup Date: ${new Date(booking.pickupDate).toLocaleDateString()}`);
      console.log(`   Return Date: ${new Date(booking.returnDate).toLocaleDateString()}`);
      console.log(`   Pickup Time: ${booking.pickupTime}`);
      console.log(`   Return Time: ${booking.returnTime}`);
      console.log(`   Rental Days: ${booking.rentalDays}`);
      console.log(`   Daily Rate: $${booking.dailyRate}`);
      console.log(`   Total Amount: $${booking.totalAmount}`);
      console.log('');
      
      console.log('📍 Location Details:');
      console.log(`   Pickup Location: ${booking.pickupLocation}`);
      console.log(`   Return Location: ${booking.returnLocation || 'Same as pickup'}`);
      console.log('');
      
      console.log('👨‍💼 Driver Details:');
      console.log(`   Driver Age: ${booking.driverAge || 'Not specified'}`);
      console.log(`   Additional Driver: ${booking.additionalDriver ? 'Yes' : 'No'}`);
      console.log(`   Insurance: ${booking.insurance || 'Not specified'}`);
      console.log('');
      
      console.log('💳 Payment & Status:');
      console.log(`   Status: ${booking.status.toUpperCase()}`);
      console.log(`   Payment Status: ${booking.paymentStatus.toUpperCase()}`);
      console.log('');
      
      if (booking.notes) {
        console.log('📝 Notes:');
        console.log(`   ${booking.notes}`);
        console.log('');
      }
      
      console.log('=' .repeat(60));
      console.log('');
    });
    
    // Summary statistics
    const statusCounts = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});
    
    const paymentStatusCounts = bookings.reduce((acc, booking) => {
      acc[booking.paymentStatus] = (acc[booking.paymentStatus] || 0) + 1;
      return acc;
    }, {});
    
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    console.log('📊 SUMMARY STATISTICS');
    console.log('─'.repeat(30));
    console.log(`Total Bookings: ${bookings.length}`);
    console.log(`Total Revenue: $${totalRevenue}`);
    console.log('');
    console.log('Status Breakdown:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status.toUpperCase()}: ${count}`);
    });
    console.log('');
    console.log('Payment Status Breakdown:');
    Object.entries(paymentStatusCounts).forEach(([status, count]) => {
      console.log(`  ${status.toUpperCase()}: ${count}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run the script
viewDetailedBookings().catch(console.error);
