import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Car } from '@/models/Car';
import { Category } from '@/models/Category';
import { transformCarForAPI, transformCarFromAPI } from '@/lib/transformers';
import { ObjectId } from 'mongodb';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const car = await Car.findById(id).populate('categoryId', 'name slug').lean();
    
    if (!car) {
      return NextResponse.json(
        { success: false, error: 'Car not found' },
        { status: 404 }
      );
    }
    
    // Transform database car to API format
    const transformedCar = transformCarForAPI(car);
    
    return NextResponse.json({
      success: true,
      data: transformedCar
    });
  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch car' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = await params;
    
    // Check if car exists
    const existingCar = await Car.findById(id);
    
    if (!existingCar) {
      return NextResponse.json(
        { success: false, error: 'Car not found' },
        { status: 404 }
      );
    }
    
    // If categoryId is being updated, verify it exists
    if (body.categoryId) {
      const category = await Category.findById(body.categoryId);
      
      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 400 }
        );
      }
    }
    
    // Transform API data to database format
    const updateData = transformCarFromAPI(body);
    
    // Convert categoryId to ObjectId if provided
    if (updateData.categoryId) {
      updateData.categoryId = new ObjectId(updateData.categoryId);
    }
    
    const updatedCar = await Car.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('categoryId', 'name slug');
    
    // Transform response to API format
    const transformedCar = transformCarForAPI(updatedCar.toObject());
    
    return NextResponse.json({
      success: true,
      data: transformedCar
    });
  } catch (error) {
    console.error('Error updating car:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update car' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    // Check if car exists
    const existingCar = await Car.findById(id);
    
    if (!existingCar) {
      return NextResponse.json(
        { success: false, error: 'Car not found' },
        { status: 404 }
      );
    }
    
    // Check if car has any bookings (you might want to add this check later)
    // const bookingsCount = await Booking.countDocuments({ carId: id });
    
    await Car.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete car' },
      { status: 500 }
    );
  }
}
