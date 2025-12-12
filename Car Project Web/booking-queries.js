#!/usr/bin/env node

/**
 * Useful Database Queries for Bookings
 * Run these to explore your booking data
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental';

async function runQueries() {
  let client;
  
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db();
    const bookings = db.collection('bookings');
    
    console.log('🔍 USEFUL BOOKING QUERIES\n');
    console.log('=' .repeat(50));
    
    // Query 1: All bookings
    console.log('1️⃣ ALL BOOKINGS:');
    const allBookings = await bookings.find({}).toArray();
    console.log(`   Found ${allBookings.length} total bookings\n`);
    
    // Query 2: Bookings by status
    console.log('2️⃣ BOOKINGS BY STATUS:');
    const statusGroups = await bookings.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    
    statusGroups.forEach(group => {
      console.log(`   ${group._id.toUpperCase()}: ${group.count} bookings`);
    });
    console.log('');
    
    // Query 3: Bookings by user
    console.log('3️⃣ BOOKINGS BY USER:');
    const userGroups = await bookings.aggregate([
      { $group: { _id: '$userId', count: { $sum: 1 }, totalSpent: { $sum: '$totalAmount' } } },
      { $sort: { count: -1 } }
    ]).toArray();
    
    userGroups.forEach(group => {
      console.log(`   User ${group._id}: ${group.count} bookings, $${group.totalSpent} total`);
    });
    console.log('');
    
    // Query 4: Recent bookings (last 7 days)
    console.log('4️⃣ RECENT BOOKINGS (Last 7 days):');
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentBookings = await bookings.find({
      createdAt: { $gte: weekAgo }
    }).toArray();
    
    console.log(`   Found ${recentBookings.length} recent bookings`);
    recentBookings.forEach(booking => {
      console.log(`   - ${booking._id}: $${booking.totalAmount} (${booking.status})`);
    });
    console.log('');
    
    // Query 5: Total revenue
    console.log('5️⃣ REVENUE ANALYSIS:');
    const revenueStats = await bookings.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          averageBooking: { $avg: '$totalAmount' },
          maxBooking: { $max: '$totalAmount' },
          minBooking: { $min: '$totalAmount' }
        }
      }
    ]).toArray();
    
    if (revenueStats.length > 0) {
      const stats = revenueStats[0];
      console.log(`   Total Revenue: $${stats.totalRevenue}`);
      console.log(`   Average Booking: $${Math.round(stats.averageBooking)}`);
      console.log(`   Highest Booking: $${stats.maxBooking}`);
      console.log(`   Lowest Booking: $${stats.minBooking}`);
    }
    console.log('');
    
    // Query 6: Bookings with car details
    console.log('6️⃣ BOOKINGS WITH CAR DETAILS:');
    const bookingsWithCars = await bookings.aggregate([
      {
        $lookup: {
          from: 'cars',
          localField: 'carId',
          foreignField: '_id',
          as: 'car'
        }
      },
      { $limit: 3 }
    ]).toArray();
    
    bookingsWithCars.forEach((booking, index) => {
      const car = booking.car[0];
      console.log(`   Booking ${index + 1}:`);
      console.log(`     Car: ${car ? `${car.brand} ${car.model}` : 'Unknown'}`);
      console.log(`     Amount: $${booking.totalAmount}`);
      console.log(`     Status: ${booking.status}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run the queries
runQueries().catch(console.error);
