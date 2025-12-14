/**
 * Current User API Route
 * Get and update current user profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { findUserById, updateUserProfile } from '@/lib/db/users';
import type { User } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Verify session
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find user by MongoDB ObjectId (from session.userId)
    const dbUser = await findUserById(session.userId);

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userData: User = {
      id: dbUser._id!.toString(),
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      avatar: dbUser.avatar,
      role: dbUser.role as User['role'],
      status: dbUser.status as User['status'],
      authProvider: dbUser.authProvider,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify session
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, avatar } = body;

    // Update user profile using MongoDB ObjectId
    const updatedUser = await updateUserProfile(session.userId, {
      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName }),
      ...(avatar !== undefined && { avatar }),
    });

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userData: User = {
      id: updatedUser._id!.toString(),
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      avatar: updatedUser.avatar,
      role: updatedUser.role as User['role'],
      status: updatedUser.status as User['status'],
      authProvider: updatedUser.authProvider,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
