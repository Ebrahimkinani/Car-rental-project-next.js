import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { getSessionFromRequest } from '@/lib/auth';
import { Favorite } from '@/models/Favorite';
import { Car } from '@/models/Car';
import { transformCarsForAPI } from '@/lib/transformers';
import mongoose from 'mongoose';

// GET /api/favorites - Get user's favorite cars
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get user from authenticated request
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user's favorite car IDs
    const favorites = await Favorite.find({ userId: session.userId }).lean();
    const carIds = favorites.map(fav => fav.carId);
    
    // Get the actual car objects
    const cars = await Car.find({ 
      _id: { $in: carIds } 
    }).populate('categoryId', 'name slug').lean();
    
    // Transform database cars to API format
    const transformedCars = transformCarsForAPI(cars);
    
    return NextResponse.json(transformedCars);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Add car to favorites
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { carId } = await request.json();
    
    console.log('Favorites API - Received request:', { carId });
    
    if (!carId) {
      return NextResponse.json(
        { error: 'Car ID is required' },
        { status: 400 }
      );
    }
    
    // Get user from authenticated request
    const session = await getSessionFromRequest(request);
    console.log('Favorites API - Session:', session ? 'Found' : 'Not found');
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if car exists - convert string ID to ObjectId
    let carObjectId;
    try {
      carObjectId = new mongoose.Types.ObjectId(carId);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid car ID format' },
        { status: 400 }
      );
    }
    
    const car = await Car.findById(carObjectId);
    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }
    
    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ 
      userId: session.userId, 
      carId: carObjectId 
    });
    
    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Car already in favorites' },
        { status: 409 }
      );
    }
    
    // Add to favorites
    const favorite = new Favorite({
      userId: session.userId,
      carId: carObjectId,
    });
    
    await favorite.save();
    
    return NextResponse.json({ 
      message: 'Car added to favorites',
      favorite: favorite.toObject()
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { error: 'Failed to add to favorites' },
      { status: 500 }
    );
  }
}
