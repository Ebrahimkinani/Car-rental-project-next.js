/**
 * User Sync API Route
 * Syncs user data to MongoDB (legacy route - no longer needed with MongoDB auth)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { dbConnect } from '@/lib/mongodb';
import mongoose from 'mongoose';
import type { User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    // Verify session token
    const { user } = await requireAuth(request);

    // This route is deprecated - user sync is handled by MongoDB auth
    return NextResponse.json(
      { success: false, error: 'This endpoint is deprecated. Please use MongoDB authentication.' },
      { status: 410 }
    );
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
