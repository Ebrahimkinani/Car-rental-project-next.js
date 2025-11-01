/**
 * Logout API Route
 * Handles session termination and cookie clearing
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/db/sessions';

export async function POST(request: NextRequest) {
  try {
    // Get session token from cookie to delete it
    const sessionToken = request.cookies.get('session')?.value;
    
    if (sessionToken) {
      // Delete session in MongoDB
      await deleteSession(sessionToken);
    }

    // Clear the session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
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
    console.error('Logout failed:', error);
    
    // Even if there's an error, we should clear the cookie
    const response = NextResponse.json(
      { 
        error: 'Logout completed with warnings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 200 } // Return 200 even with errors since we clear the cookie
    );

    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    return response;
  }
}

export async function GET(request: NextRequest) {
  // Allow GET requests for logout (useful for logout links)
  return POST(request);
}
