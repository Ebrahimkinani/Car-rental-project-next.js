import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { getSessionFromRequest } from '@/lib/auth';
import { Favorite } from '@/models/Favorite';
import mongoose from 'mongoose';

// DELETE /api/favorites/[carId] - Remove car from favorites
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  try {
    await dbConnect();
    const { carId } = await params;
    
    // Get user from authenticated request
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Convert string ID to ObjectId
    let carObjectId;
    try {
      carObjectId = new mongoose.Types.ObjectId(carId);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid car ID format' },
        { status: 400 }
      );
    }
    
    // Remove from favorites
    const result = await Favorite.deleteOne({ 
      userId: session.userId, 
      carId: carObjectId
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Car removed from favorites' 
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { error: 'Failed to remove from favorites' },
      { status: 500 }
    );
  }
}
