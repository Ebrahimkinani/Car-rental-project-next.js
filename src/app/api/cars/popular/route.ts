import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Car } from '@/models/Car';
import { transformCarsForAPI } from '@/lib/transformers';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Query for popular cars only
    const cars = await Car.find(
      { isPopular: true },
      {
        name: 1,
        brand: 1,
        model: 1,
        year: 1,
        seats: 1,
        horsepower: 1,
        transmission: 1,
        price: 1,
        images: 1,
        isPopular: 1,
        fuelType: 1,
        description: 1,
        available: 1,
        status: 1
      }
    )
      .sort({ popularSince: -1 })
      .limit(10)
      .lean();

    // Transform database cars to API format
    const transformedCars = transformCarsForAPI(cars);

    return NextResponse.json({
      success: true,
      data: transformedCars
    });
  } catch (error) {
    console.error('Error fetching popular cars:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch popular cars' },
      { status: 500 }
    );
  }
}
