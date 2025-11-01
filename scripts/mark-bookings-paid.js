#!/usr/bin/env node

// Batch mark bookings as paid (excluding cancelled)
// Usage:
//   node scripts/mark-bookings-paid.js               # mark all pending/confirmed/active as paid
//   node scripts/mark-bookings-paid.js --ids a,b,c   # mark specific booking IDs

require('dotenv').config({ path: '.env.local' });
try {
  require('ts-node/register/transpile-only');
} catch (error) {
  console.error('ts-node is required to run this script. Install it with "npm install -D ts-node".');
  process.exit(1);
}

const mongoose = require('mongoose');
const { dbConnect } = require('../src/lib/mongodb');

const BookingSchema = new mongoose.Schema({
  status: String,
  paymentStatus: String,
  totalAmount: Number,
}, { collection: 'bookings' });

const Booking = mongoose.models._TmpBooking || mongoose.model('_TmpBooking', BookingSchema);

async function run() {
  const argIds = process.argv.find(a => a.startsWith('--ids='))?.split('=')[1];
  const ids = argIds ? argIds.split(',').map(s => s.trim()).filter(Boolean) : [];

  await dbConnect();

  const filter = ids.length
    ? { _id: { $in: ids.map(id => new mongoose.Types.ObjectId(id)) } }
    : { status: { $nin: ['cancelled'] }, paymentStatus: { $ne: 'paid' } };

  const toUpdate = await Booking.find(filter, { _id: 1, status: 1, paymentStatus: 1, totalAmount: 1 }).lean();
  if (!toUpdate.length) {
    console.log('No bookings to update.');
    await mongoose.disconnect();
    return;
  }

  console.log(`Will mark ${toUpdate.length} booking(s) as paid.`);
  const res = await Booking.updateMany(
    { _id: { $in: toUpdate.map(b => b._id) } },
    { $set: { paymentStatus: 'paid' }, $setOnInsert: {} }
  );

  console.log(`Matched: ${res.matchedCount ?? res.n}, Modified: ${res.modifiedCount ?? res.nModified}`);
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error(err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});


