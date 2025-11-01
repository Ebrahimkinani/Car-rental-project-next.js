import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { transformCarsForAPI } from '@/lib/transformers';
import { Car } from '@/models/Car';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    
    // Validate categoryId format
    if (!categoryId || typeof categoryId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid categoryId: must be a non-empty string' },
        { status: 400 }
      );
    }
    
    // Validate ObjectId format
    let categoryObjectId: ObjectId;
    try {
      categoryObjectId = new ObjectId(categoryId);
    } catch (objectIdError) {
      console.error('Invalid categoryId format:', categoryId, objectIdError);
      return NextResponse.json(
        { success: false, error: `Invalid categoryId format: ${categoryId}` },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Use Car model to query cars by categoryId
    const cars = await Car.find({ 
      categoryId: categoryObjectId
    }).populate('categoryId', 'name slug').lean();
    
    // Transform database cars to API format
    const transformedCars = transformCarsForAPI(cars);
    
    return NextResponse.json({
      success: true,
      data: transformedCars
    });
  } catch (error) {
    console.error('Error fetching cars by category:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Failed to fetch cars: ${errorMessage}` },
      { status: 500 }
    );
  }
}
