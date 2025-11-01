/**
 * requireAuth Helper
 * Server-side authentication and authorization for API routes
 * 
 * Usage:
 * const { user } = await requireAuth(request);
 * const { user } = await requireAuth(request, ['admin', 'manager']);
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/verifySession';
import { getSessionByToken } from '@/lib/db/sessions';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  status: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AuthContext {
  user: AuthenticatedUser;
  session: any;
}

/**
 * Require authentication for API routes
 * Uses canonical verifySession() for consistent auth across the app
 * 
 * @param request - Next.js request object
 * @param requiredRoles - Optional array of allowed roles (defaults to ['admin','manager','employee'])
 * @returns { user, session } - Authenticated user and session data
 * @throws {NextResponse} - Returns 401/403 response if not authenticated
 */
export async function requireAuth(
  request: NextRequest,
  requiredRoles?: string[]
): Promise<AuthContext> {
  // Use canonical session verification
  const user = await verifySession(request);
  
  if (!user) {
    throw NextResponse.json(
      { error: 'Unauthorized', message: 'No valid session found' },
      { status: 401 }
    );
  }

  // Check if user is active (already normalized to lowercase by verifySession)
  if (user.status !== 'active') {
    throw NextResponse.json(
      { 
        error: 'Forbidden', 
        message: `Account status: ${user.status}`,
        status: user.status 
      },
      { status: 403 }
    );
  }

  // Check role if required (already normalized to lowercase by verifySession)
  const allowedRoles = requiredRoles || ['admin', 'manager', 'employee'];
  if (!allowedRoles.includes(user.role)) {
    throw NextResponse.json(
      { 
        error: 'Forbidden', 
        message: `Required role: ${allowedRoles.join(', ')}. Your role: ${user.role}` 
      },
      { status: 403 }
    );
  }

  // Get session for return value (for compatibility)
  const sessionToken = request.cookies.get('session')?.value;
  const session = sessionToken ? await getSessionByToken(sessionToken) : null;

  return {
    user,
    session,
  };
}

/**
 * Get current user (returns null if not authenticated)
 * Use this when you need to check auth but not require it
 */
export async function getCurrentUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const { user } = await requireAuth(request);
    return user;
  } catch {
    return null;
  }
}

/**
 * Check if user has specific role
 */
export function hasRole(user: AuthenticatedUser, roles: string[]): boolean {
  return roles.includes(user.role);
}

/**
 * Get user's display name
 */
export function getUserDisplayName(user: AuthenticatedUser): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) {
    return user.firstName;
  }
  return user.email.split('@')[0];
}

