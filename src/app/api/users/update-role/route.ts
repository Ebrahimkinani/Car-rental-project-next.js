/**
 * Update User Role API Route
 * Updates user role in MongoDB
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { dbConnect } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    // Verify session token
    await requireAuth(request, ['admin', 'manager']);

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, role' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['admin', 'manager', 'user', 'guest'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }
    const usersCollection = db.collection('users');

    // Import ObjectId for MongoDB
    const { ObjectId } = mongoose.Types;

    // Update user role
    const updatedUser = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $set: {
          role,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // User role updated - logging for monitoring

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
