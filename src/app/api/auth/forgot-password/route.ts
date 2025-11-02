/**
 * Forgot Password API Route
 * POST /api/auth/forgot-password
 * 
 * Generates a password reset token and sends it via email
 * 
 * Request: { email: string }
 * Response: { success: boolean, message: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/db/users';
import { createPasswordResetToken } from '@/lib/db/passwordResetTokens';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await findUserByEmail(email);

    // For security, don't reveal whether email exists
    // Always return success message
    if (!user) {
      // Return success to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      // Don't reveal account status, just return generic message
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Create password reset token
    const { token, expiresAt: _expiresAt } = await createPasswordResetToken(user._id!);

    // TODO: Send email with password reset link
    // For now, we'll log it to console in development
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('[forgot-password] Password Reset Link:', resetLink);
      console.warn('[forgot-password] Would send email to:', user.email);
    }

    // In production, you would send an email here:
    // await sendPasswordResetEmail(user.email, resetLink, expiresAt);

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process password reset request',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

