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
import { USE_MOCK_DATA } from '@/lib/data-source';
import { findMockUserById, toPublicMockUser } from '@/lib/mock-auth-store';

export async function GET() {
  try {
    const sessionPayload = await getSessionFromCookie();
    
    if (!sessionPayload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    if (USE_MOCK_DATA) {
      const mockUser = findMockUserById(sessionPayload.userId);
      if (!mockUser) {
        return NextResponse.json({ user: null }, { status: 200 });
      }
      return NextResponse.json({ user: toPublicMockUser(mockUser) });
    }

    await dbConnect();
    
    const user = await findUserById(sessionPayload.userId);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    
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
