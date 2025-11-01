#!/usr/bin/env node

/**
 * Initialize sample expenses data for testing
 * Run with: node scripts/init-expenses.js
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental';
const DB_NAME = process.env.MONGODB_DB || 'car_rental';

const sampleExpenses = [
  {
    date: new Date('2025-01-01'),
    category: 'Fuel',
    vendor: 'Woqod',
    description: 'Fuel top-up (fleet)',
    method: 'Card',
    status: 'Posted',
    amount: 380.25,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: new Date('2025-01-02'),
    category: 'Maintenance',
    vendor: 'Service Center A',
    description: 'Oil + filters',
    method: 'Money Transfer',
    status: 'Posted',
    amount: 620.00,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: new Date('2025-01-03'),
    category: 'Rent',
    vendor: 'Warehouse Lease',
    description: 'Monthly lease',
    method: 'Money Transfer',
    status: 'Posted',
    amount: 2100.00,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: new Date('2025-01-05'),
    category: 'Salaries',
    vendor: 'Payroll',
    description: 'Drivers + staff',
    method: 'Money Transfer',
    status: 'Posted',
    amount: 8600.00,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: new Date('2025-01-08'),
    category: 'Utilities',
    vendor: 'Kahramaa',
    description: 'Electricity bill',
    method: 'Card',
    status: 'Pending',
    amount: 940.75,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: new Date('2025-01-10'),
    category: 'Insurance',
    vendor: 'QIC',
    description: 'Annual premium',
    method: 'Card',
    status: 'Posted',
    amount: 3200.00,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: new Date('2025-01-12'),
    category: 'Maintenance',
    vendor: 'Service Center B',
    description: 'Brake pads',
    method: 'Cash',
    status: 'Posted',
    amount: 280.50,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: new Date('2025-01-13'),
    category: 'Fuel',
    vendor: 'Woqod',
    description: 'Fuel batch',
    method: 'Card',
    status: 'Posted',
    amount: 415.90,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: new Date('2025-01-15'),
    category: 'Other',
    vendor: 'OfficeMart',
    description: 'Stationery',
    method: 'Wallet',
    status: 'Refunded',
    amount: 75.00,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: new Date('2025-01-18'),
    category: 'Maintenance',
    vendor: 'Service Center A',
    description: 'Tires (2)',
    method: 'Card',
    status: 'Posted',
    amount: 520.00,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: new Date('2025-01-21'),
    category: 'Utilities',
    vendor: 'Ooredoo',
    description: 'Internet',
    method: 'Card',
    status: 'Posted',
    amount: 250.00,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    date: new Date('2025-01-22'),
    category: 'Fuel',
    vendor: 'Woqod',
    description: 'Fuel top-up',
    method: 'Card',
    status: 'Posted',
    amount: 395.60,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function initExpenses() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const expensesCollection = db.collection('expenses');
    
    // Clear existing expenses
    await expensesCollection.deleteMany({});
    console.log('🗑️  Cleared existing expenses');
    
    // Insert sample expenses
    const result = await expensesCollection.insertMany(sampleExpenses);
    console.log(`✅ Inserted ${result.insertedCount} sample expenses`);
    
    // Verify insertion
    const count = await expensesCollection.countDocuments();
    console.log(`📊 Total expenses in database: ${count}`);
    
  } catch (error) {
    console.error('❌ Error initializing expenses:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the initialization
initExpenses().catch(console.error);
