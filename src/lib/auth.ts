/**
 * Authentication helper functions
 * Handles MongoDB session management and JWT operations
 */

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Session from '@/models/Session';

// Types
export interface SessionPayload {
  userId: string;
  email: string;
  displayName?: string;
  iat: number;
  exp: number;
}

// Constants
const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

/**
 * Create a new session in MongoDB
 */
export async function createSession(
  userId: string,
  email: string,
  displayName?: string,
  device?: string,
  ip?: string,
  userAgent?: string
): Promise<string> {
  try {
    await dbConnect();

    // Generate JWT token
    const payload: Omit<SessionPayload, 'iat' | 'exp'> = {
      userId,
      email,
      displayName,
    };

    const token = jwt.sign(payload, JWT_SECRET!, {
      expiresIn: '7d',
    });

    // Decode token to get expiration date
    const decoded = jwt.decode(token) as SessionPayload;
    const expiresAt = new Date(decoded.exp * 1000);

    // Save session to MongoDB
    const session = new Session({
      userId,
      token,
      expiresAt,
      device,
      ip,
      userAgent,
    });

    await session.save();

    return token;
  } catch (error) {
    console.error('Failed to create session:', error);
    throw error;
  }
}

/**
 * Verify internal JWT token
 */
export function verifyJWTToken(token: string): SessionPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as SessionPayload;
    return decoded;
  } catch (error) {
    console.error('JWT token verification failed:', error);
    throw new Error('Invalid session token');
  }
}

/**
 * Get session from cookie and verify it
 * NEVER throws - always returns null on failure
 */
export async function getSessionFromCookie(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return null;
    }

    // Verify JWT token (catch any errors)
    let payload: SessionPayload;
    try {
      payload = verifyJWTToken(sessionToken);
    } catch (error) {
      console.error('Failed to verify JWT token:', error);
      return null;
    }

    // Check if session exists and is active in MongoDB
    await dbConnect();
    const session = await Session.findOne({ 
      token: sessionToken, 
      isActive: true, 
      expiresAt: { $gt: new Date() } 
    });

    if (!session) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Failed to get session from cookie:', error);
    return null;
  }
}

/**
 * Get session from request headers (for API routes)
 * NEVER throws - always returns null on failure
 */
export async function getSessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  try {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    console.log('Session token from request:', sessionToken ? 'Present' : 'Missing');

    if (!sessionToken) {
      console.log('No session token found in request');
      return null;
    }

    await dbConnect();

    // Verify JWT token (catch any errors)
    let payload: SessionPayload;
    try {
      payload = verifyJWTToken(sessionToken);
      console.log('JWT payload verified:', { userId: payload.userId, email: payload.email });
    } catch (error) {
      console.error('Failed to verify JWT token:', error);
      return null;
    }

    // Check if session exists and is active in MongoDB
    const session = await Session.findOne({ 
      token: sessionToken, 
      isActive: true, 
      expiresAt: { $gt: new Date() } 
    });

    if (!session) {
      console.log('No active session found in MongoDB for token');
      return null;
    }

    console.log('Session found and active:', { userId: session.userId, isActive: session.isActive });
    return payload;
  } catch (error) {
    console.error('Failed to get session from request:', error);
    return null;
  }
}

/**
 * Deactivate a session by token
 */
export async function deactivateSession(token: string): Promise<boolean> {
  try {
    await dbConnect();
    const result = await Session.updateOne(
      { token, isActive: true },
      { isActive: false }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Failed to deactivate session:', error);
    return false;
  }
}

/**
 * Deactivate all sessions for a user
 */
export async function deactivateUserSessions(userId: string): Promise<boolean> {
  try {
    await dbConnect();
    const result = await Session.updateMany(
      { userId, isActive: true },
      { isActive: false }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Failed to deactivate user sessions:', error);
    return false;
  }
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    await dbConnect();
    const result = await Session.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    return result.deletedCount;
  } catch (error) {
    console.error('Failed to cleanup expired sessions:', error);
    return 0;
  }
}

/**
 * Get user agent and device info from request
 */
export function getDeviceInfo(request: NextRequest): { device?: string; userAgent?: string } {
  const userAgent = request.headers.get('user-agent') || undefined;
  
  // Simple device detection
  let device: string | undefined;
  if (userAgent) {
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      device = 'mobile';
    } else if (/Tablet|iPad/.test(userAgent)) {
      device = 'tablet';
    } else {
      device = 'desktop';
    }
  }

  return { device, userAgent };
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: NextRequest): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback to a default IP if none found
  return '127.0.0.1';
}

/**
 * Create session cookie options
 */
export function getSessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    value: '', // Will be set when creating the cookie
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
  };
}

/**
 * Clear session cookie
 */
export function getClearSessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
}

// Re-export verifySession for convenience
export { verifySession } from './auth/verifySession';
