/**
 * Canonical Session Verification
 * Single source of truth for session validation across the app
 * 
 * This function:
 * 1. Reads the "session" cookie from the request (JWT token)
 * 2. Verifies the JWT token
 * 3. Looks up the session in MongoDB to ensure it's active
 * 4. Fetches the user from MongoDB
 * 5. Returns a normalized user object with lowercase role/status
 * 
 * Returns null if: cookie missing, session invalid/expired, user not found
 */

import { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { findUserById } from '@/lib/db/users';

export interface VerifiedUser {
  id: string;
  email: string;
  role: string;   // ALWAYS lowercase
  status: string; // ALWAYS lowercase
  firstName?: string;
  lastName?: string;
  phone?: string;
}

/**
 * Verify session and return normalized user data
 * Returns null if session is invalid, expired, or user not found
 */
export async function verifySession(request: NextRequest): Promise<VerifiedUser | null> {
  try {
    // Get JWT session payload (this verifies JWT and checks MongoDB)
    const sessionPayload = await getSessionFromRequest(request);
    
    if (!sessionPayload) {
      return null;
    }

    // Get user from database using the userId from JWT payload
    const user = await findUserById(sessionPayload.userId);
    if (!user) {
      return null;
    }
    
    // Return normalized user data
    // CRITICAL: Normalize role and status to lowercase for consistent comparisons
    return {
      id: user._id!.toString(),
      email: user.email,
      role: user.role.toLowerCase(),
      status: user.status.toLowerCase(),
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    };
  } catch (error) {
    console.error('❌ Error verifying session:', error);
    return null;
  }
}
