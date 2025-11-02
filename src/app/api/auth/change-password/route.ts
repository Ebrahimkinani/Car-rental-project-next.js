/**
 * Change Password API Route
 * POST /api/auth/change-password
 * 
 * Allows authenticated users to change their password by providing current password and new password
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { findUserById, validatePassword, updateUserPassword } from '@/lib/db/users';
import { createNotification } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    // Starting password change process

    // Get current user from session
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Find user
    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has password (not Google auth)
    if (!user.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'Password change is not available for Google accounts' },
        { status: 400 }
      );
    }

    // Validate current password
    const isValid = await validatePassword(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Check if new password is different from current
    const isSamePassword = await validatePassword(newPassword, user.passwordHash);
    if (isSamePassword) {
      return NextResponse.json(
        { success: false, error: 'New password must be different from current password' },
        { status: 400 }
      );
    }

    // Update password
    const success = await updateUserPassword(session.userId, newPassword);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update password' },
        { status: 500 }
      );
    }

    // Password updated successfully

    // Best-effort: notify user their password was changed
    (async () => {
      try {
        await createNotification({
          userId: String(session.userId),
          type: 'SECURITY',
          title: 'Password updated',
          message: 'Your account password was changed successfully. If this wasn\'t you, please contact support immediately.',
          actionUrl: '/profile',
        });
      } catch (e) {
        // ignore notification errors
      }
    })();

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error: any) {
    console.error('❌ CHANGE PASSWORD ERROR:', error);
    return NextResponse.json(
      { success: false, error: 'Password change failed', message: error.message },
      { status: 500 }
    );
  }
}

