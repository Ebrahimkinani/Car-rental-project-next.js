/**
 * Reset Password API Route
 * POST /api/auth/reset-password
 * 
 * Validates token and updates user password
 * 
 * Request: { token: string, newPassword: string }
 * Response: { success: boolean, message: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { validatePasswordResetToken, markTokenAsUsed } from '@/lib/db/passwordResetTokens';
import { updateUserPassword } from '@/lib/db/users';
import { getDb } from '@/lib/db/mongo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    // Validate input
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Reset token is required' },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json(
        { success: false, error: 'New password is required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Validate token
    const tokenDoc = await validatePasswordResetToken(token);

    if (!tokenDoc) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Update user password
    const success = await updateUserPassword(tokenDoc.userId, newPassword);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update password' },
        { status: 500 }
      );
    }

    // Mark token as used
    await markTokenAsUsed(token);

    // Invalidate all existing sessions for security
    try {
      const db = await getDb();
      const sessions = db.collection('sessions');
      await sessions.deleteMany({ 
        userId: tokenDoc.userId 
      });
    } catch (err) {
      console.error('Error deleting user sessions:', err);
      // Don't fail the password reset if session cleanup fails
    }

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. Please login with your new password.',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reset password',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

