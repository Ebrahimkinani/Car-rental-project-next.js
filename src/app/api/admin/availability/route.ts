import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Car } from '@/models/Car';
import { Category } from '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const carType = searchParams.get('carType');
    const branch = searchParams.get('branch');
    const date = searchParams.get('date');
    const time = searchParams.get('time');

    // Build query for available cars
    const query: any = {
      status: 'available',
      available: true
    };

    // Filter by branch if provided
    if (branch && branch !== '') {
      query.branch = branch;
    }

    // Filter by car type (category) if provided
    if (carType && carType !== '') {
      // First find the category ID by name
      const category = await Category.findOne({ name: carType });
      if (category) {
        query.categoryId = category._id;
      }
    }

    // TODO: Add booking conflict checking (requires date range overlap logic)
    // This would involve checking if any bookings overlap with the requested date/time
    // For now, we just return cars that are marked as available

    const availableCars = await Car.find(query).countDocuments();

    return NextResponse.json({
      success: true,
      data: {
        availableCount: availableCars,
        filters: {
          carType: carType || null,
          branch: branch || null,
          date: date || null,
          time: time || null
        }
      }
    });

  } catch (error) {
    console.error('Error checking car availability:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check car availability',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
