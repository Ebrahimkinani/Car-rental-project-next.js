import { NextResponse } from 'next/server';
import { initializeDatabase } from '../../../../lib/init-db';
import { dbConnect } from '@/lib/mongodb';

export async function POST() {
  try {
    // Initialize database with sample data
    await initializeDatabase();
    
    // Get database statistics
    const mongoose = await dbConnect();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error('Database connection not established');
    }
    
    const categoriesCount = await db.collection('categories').countDocuments();
    const carsCount = await db.collection('cars').countDocuments();
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      data: {
        categories: categoriesCount,
        cars: carsCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to initialize database',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Checking database status
    
    const mongoose = await dbConnect();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error('Database connection not established');
    }
    
    const categoriesCount = await db.collection('categories').countDocuments();
    const carsCount = await db.collection('cars').countDocuments();
    
    // Check if database is already initialized
    const isInitialized = categoriesCount > 0 && carsCount > 0;
    
    return NextResponse.json({
      success: true,
      message: 'Database status retrieved successfully',
      data: {
        isInitialized,
        categories: categoriesCount,
        cars: carsCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Error checking database status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check database status',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
