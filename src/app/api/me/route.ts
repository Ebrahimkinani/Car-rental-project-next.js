/**
 * Current User API Route
 * GET /api/me
 * 
 * Returns the current user's role, status, and permissions from MongoDB.
 * CRITICAL: This endpoint NEVER throws. It always returns { user: null } on failure.
 * 
 * Returns:
 * {
 *   user: { id, email, firstName, lastName, role, status } | null
 * }
 */

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { getSessionFromCookie } from '@/lib/auth';
import { findUserById } from '@/lib/db/users';

export async function GET() {
  try {
    console.log('📋 /api/me: Checking session');
    
    // Connect to database
    await dbConnect();
    
    // Get session payload from cookie
    const sessionPayload = await getSessionFromCookie();
    
    if (!sessionPayload) {
      console.log('📋 /api/me: No session found, returning null');
      return NextResponse.json({ user: null }, { status: 200 });
    }
    
    console.log('📋 /api/me: Session found for', sessionPayload.email);
    
    // Get user from database
    const user = await findUserById(sessionPayload.userId);
    if (!user) {
      console.log('📋 /api/me: User not found in database');
      return NextResponse.json({ user: null }, { status: 200 });
    }
    
    console.log('📋 /api/me: Returning user data for', user.email);
    
    // Return user data (NEVER return password or sensitive auth data)
    return NextResponse.json({
      user: {
        id: user._id!.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role.toLowerCase(),
        status: user.status.toLowerCase(),
        authProvider: user.authProvider || 'email',
      },
    });
    
  } catch (error: any) {
    console.error('❌ Error in /api/me:', error);
    // NEVER throw - always return null user
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
