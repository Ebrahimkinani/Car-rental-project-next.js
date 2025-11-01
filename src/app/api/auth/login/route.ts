/**
 * Login API Route
 * POST /api/auth/login
 * 
 * Authenticates user with email/password
 * Creates session and sets HTTP-only cookie
 */

import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, validatePassword } from '@/lib/db/users';
import { createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 LOGIN: Starting login process');
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 LOGIN: Validating input for', email);

    // Validate input
    if (!email || !password) {
      console.log('❌ LOGIN: Missing email or password');
      return NextResponse.json(
        { ok: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await findUserByEmail(email);

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user has valid ID
    if (!user._id) {
      return NextResponse.json(
        { ok: false, error: 'Invalid user data' },
        { status: 500 }
      );
    }

    // Check if user is active (case-insensitive)
    if (user.status.toLowerCase() !== 'active') {
      return NextResponse.json(
        { ok: false, error: 'Account is not active', status: user.status },
        { status: 403 }
      );
    }

    // Validate password
    const isValid = await validatePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Get client info for session
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';

    // Create session (using JWT-based createSession from lib/auth)
    console.log('🔐 LOGIN: Creating session for user', user._id.toString());
    const sessionToken = await createSession(
      user._id.toString(),
      user.email,
      user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.lastName,
      undefined, // device
      ip,
      userAgent
    );
    console.log('✅ LOGIN: Session created, token length:', sessionToken.length);

    // Return user data (without password hash)
    // CRITICAL: Normalize role and status to lowercase for consistent comparisons
    const response = NextResponse.json({
      ok: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role.toLowerCase(),
        status: user.status.toLowerCase(), // Normalize status to lowercase
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    console.log('🔐 LOGIN: Setting session cookie');
    // Set HTTP-only cookie on the response
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    console.log('✅ LOGIN: Cookie set, returning response');
    return response;
  } catch (error: any) {
    console.error('❌ LOGIN ERROR:', error);
    return NextResponse.json(
      { ok: false, error: 'Login failed', message: error.message },
      { status: 500 }
    );
  }
}

