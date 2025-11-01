/**
 * Session Management API Route
 * DEPRECATED: Use /api/auth/login instead
 * This route was for Firebase token verification, which is no longer used.
 * All authentication now uses MongoDB with bcrypt password hashing.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'This endpoint is deprecated',
      message: 'This endpoint used Firebase authentication, which has been replaced with MongoDB-based authentication. Please use /api/auth/login instead.',
      deprecated: true
    },
    { status: 410 }
  );
}

export async function GET(request: NextRequest) {
  try {
    // Use requireAuth for session verification with MongoDB
    const { getCurrentUser } = await import('@/lib/auth/requireAuth');
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });

  } catch (error) {
    console.error('Session verification failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to verify session',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { deleteSession } = await import('@/lib/db/sessions');

    // Get the session token from the request
    const sessionToken = request.cookies.get('session')?.value;
    if (sessionToken) {
      // Delete session in MongoDB
      await deleteSession(sessionToken);
    }

    // Clear the session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Session terminated successfully'
    });

    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;

  } catch (error) {
    console.error('Session termination failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to terminate session',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
