/**
 * Password Reset Token Management
 * Generates, stores, and validates password reset tokens in MongoDB
 */

import { getDb } from './mongo';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

export interface PasswordResetToken {
  _id?: ObjectId;
  userId: ObjectId;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

// Token expiration: 1 hour
const TOKEN_EXPIRATION_HOURS = 1;

/**
 * Generate a secure random token
 */
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create a password reset token for a user
 */
export async function createPasswordResetToken(
  userId: string | ObjectId
): Promise<{ token: string; expiresAt: Date }> {
  try {
    const db = await getDb();
    const tokens = db.collection<PasswordResetToken>('passwordResetTokens');

    const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    const token = generateToken();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000);

    await tokens.insertOne({
      userId: objectId,
      token,
      expiresAt,
      used: false,
      createdAt: new Date(),
    });

    return { token, expiresAt };
  } catch (error) {
    console.error('Error creating password reset token:', error);
    throw error;
  }
}

/**
 * Validate a password reset token
 */
export async function validatePasswordResetToken(
  token: string
): Promise<PasswordResetToken | null> {
  try {
    const db = await getDb();
    const tokens = db.collection<PasswordResetToken>('passwordResetTokens');

    const tokenDoc = await tokens.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    return tokenDoc;
  } catch (error) {
    console.error('Error validating password reset token:', error);
    return null;
  }
}

/**
 * Mark a password reset token as used
 */
export async function markTokenAsUsed(token: string): Promise<boolean> {
  try {
    const db = await getDb();
    const tokens = db.collection<PasswordResetToken>('passwordResetTokens');

    const result = await tokens.updateOne(
      { token },
      { $set: { used: true } }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error marking token as used:', error);
    return false;
  }
}

/**
 * Clean up expired tokens
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const db = await getDb();
    const tokens = db.collection<PasswordResetToken>('passwordResetTokens');

    const result = await tokens.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    return result.deletedCount;
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
    return 0;
  }
}

