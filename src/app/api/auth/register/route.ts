/**
 * Register API Route
 * POST /api/auth/register
 * 
 * Creates a new user with hashed password in MongoDB
 * Automatically creates session and logs user in
 * Supports both public signup (role = customer) and admin-created users
 */

import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/db/users';
import { createSession } from '@/lib/auth';
import type { UserRole } from '@/lib/db/users';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role = 'customer', firstName, lastName, phone } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { ok: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles: UserRole[] = ['customer', 'employee', 'manager', 'admin'];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser({
      email,
      plainPassword: password,
      role: role as UserRole,
      firstName,
      lastName,
      phone,
    });

    // Check if user has valid ID
    if (!user._id) {
      return NextResponse.json(
        { ok: false, error: 'Failed to create user - missing user ID' },
        { status: 500 }
      );
    }

    // Get client info for session
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';

    // Create session (using JWT-based createSession from lib/auth)
    const sessionToken = await createSession(
      user._id.toString(),
      user.email,
      user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.lastName,
      undefined, // device
      ip,
      userAgent
    );

    // Return user data (without password hash)
    // CRITICAL: Normalize role and status to lowercase for consistent comparisons
    const response = NextResponse.json({
      ok: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role.toLowerCase(),
        status: user.status.toLowerCase(),
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    // Set HTTP-only cookie on the response (same as login)
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;

  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle duplicate email
    if (error.message?.includes('already exists')) {
      return NextResponse.json(
        { ok: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { ok: false, error: 'Failed to create user', message: error.message },
      { status: 500 }
    );
  }
}

