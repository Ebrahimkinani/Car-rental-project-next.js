import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { transformCarForAPI, transformCarsForAPI } from '@/lib/transformers';
import { Car } from '@/models/Car';
import { Category } from '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    // Build query based on search parameters
    const query: any = {};
    
    if (searchParams.get('available') === 'true') {
      query.available = true;
    }
    
    if (searchParams.get('categoryId')) {
      query.categoryId = searchParams.get('categoryId');
    }
    
    if (searchParams.get('brandId')) {
      query.brandId = searchParams.get('brandId');
    }
    
    if (searchParams.get('minPrice')) {
      query.price = { ...query.price, $gte: parseFloat(searchParams.get('minPrice')!) };
    }
    
    if (searchParams.get('maxPrice')) {
      query.price = { ...query.price, $lte: parseFloat(searchParams.get('maxPrice')!) };
    }
    
    if (searchParams.get('seats')) {
      query.seats = { $gte: parseInt(searchParams.get('seats')!) };
    }
    
    if (searchParams.get('fuelType')) {
      query.fuelType = searchParams.get('fuelType');
    }
    
    if (searchParams.get('transmission')) {
      query.transmission = searchParams.get('transmission');
    }
    
    const cars = await Car.find(query).populate('categoryId', 'name slug').lean();
    
    // Transform database cars to API format
    const transformedCars = transformCarsForAPI(cars);
    
    return NextResponse.json({
      success: true,
      data: transformedCars
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cars' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'model', 'brand', 'categoryId', 'price', 'description', 'seats', 'doors'];
    const missingFields = requiredFields.filter(field => {
      const value = body[field];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate price is a positive number
    if (typeof body.price !== 'number' || body.price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be a positive number' },
        { status: 400 }
      );
    }
    
    // Validate seats and doors are positive numbers
    if (typeof body.seats !== 'number' || body.seats <= 0) {
      return NextResponse.json(
        { success: false, error: 'Seats must be a positive number' },
        { status: 400 }
      );
    }
    
    if (typeof body.doors !== 'number' || body.doors <= 0) {
      return NextResponse.json(
        { success: false, error: 'Doors must be a positive number' },
        { status: 400 }
      );
    }
    
    // Validate categoryId format before converting
    if (!body.categoryId || typeof body.categoryId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid categoryId: must be a non-empty string' },
        { status: 400 }
      );
    }
    
    // Convert categoryId string to ObjectId with error handling
    let categoryObjectId;
    try {
      categoryObjectId = new ObjectId(body.categoryId);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid categoryId format' },
        { status: 400 }
      );
    }
    
    // Verify category exists
    const category = await Category.findById(categoryObjectId);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 400 }
      );
    }
    
    // Prepare car data with proper ObjectId
    const carData = {
      name: body.name,
      model: body.model,
      brand: body.brand,
      categoryId: categoryObjectId, // Keep as ObjectId
      description: body.description,
      price: body.price,
      seats: body.seats,
      doors: body.doors,
      available: body.available !== undefined ? body.available : true,
      status: body.status || 'available',
      images: body.images || [],
      features: body.features || [],
      rentalTerms: body.rentalTerms || [],
      weeklyRate: body.weeklyRate,
      weeklyRateEnabled: body.weeklyRateEnabled,
      monthlyRate: body.monthlyRate,
      luggageCapacity: body.luggageCapacity,
      engineType: body.engineType,
      horsepower: body.horsepower,
      acceleration: body.acceleration,
      topSpeed: body.topSpeed,
      year: body.year,
      location: body.location,
      mileage: body.mileage,
      fuelType: body.fuelType,
      transmission: body.transmission,
      color: body.color,
      vin: body.vin,
      licensePlate: body.licensePlate,
      branch: body.branch,
      cancellationPolicy: body.cancellationPolicy,
      isPopular: body.isPopular,
      popularSince: body.popularSince
    };
    
    // Remove undefined and empty string values
    Object.keys(carData).forEach(key => {
      const value = carData[key as keyof typeof carData];
      if (value === undefined || value === '') {
        delete carData[key as keyof typeof carData];
      }
    });
    
    // Log the data being saved for debugging
    const logData = { ...carData, categoryId: carData.categoryId.toString() };
    console.log('Creating car with data:', JSON.stringify(logData, null, 2));
    
    // Validate the car data before saving
    if (!carData.name || !carData.model || !carData.brand || !carData.categoryId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields for car creation' },
        { status: 400 }
      );
    }
    
    let savedCar;
    try {
      const car = new Car(carData);
      savedCar = await car.save();
    } catch (saveError: any) {
      // Handle specific MongoDB errors
      if (saveError.code === 11000) {
        // Duplicate key error
        const field = Object.keys(saveError.keyPattern || {})[0];
        return NextResponse.json(
          { success: false, error: `${field} already exists` },
          { status: 400 }
        );
      }
      // Re-throw other errors to be caught by outer catch
      throw saveError;
    }
    
    // Populate the categoryId field for the response
    await savedCar.populate('categoryId', 'name slug');
    
    // Transform response to API format
    const responseData = transformCarForAPI(savedCar.toObject());
    
    return NextResponse.json({
      success: true,
      data: responseData
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating car:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', { message: errorMessage, stack: errorStack });
    return NextResponse.json(
      { success: false, error: errorMessage || 'Failed to create car' },
      { status: 500 }
    );
  }
}
