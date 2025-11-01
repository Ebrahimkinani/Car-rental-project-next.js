/**
 * Sessions Database Module
 * MongoDB-only session management
 * 
 * Schema:
 * {
 *   _id: ObjectId,
 *   userId: ObjectId (ref to users._id),
 *   token: string,
 *   createdAt: Date,
 *   expiresAt: Date,
 *   ip?: string,
 *   userAgent?: string
 * }
 */

import { randomBytes } from 'crypto';
import { getDb } from './mongo';
import { ObjectId } from 'mongodb';

export interface SessionDocument {
  _id?: ObjectId;
  userId: ObjectId;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  ip?: string;
  userAgent?: string;
}

/**
 * Create a new session
 * @param userId - User ID
 * @param req - Optional request info (ip, userAgent)
 * @param expiresInDays - Session expiration in days (default: 7 days)
 */
export async function createSession(
  userId: string | ObjectId,
  req?: { ip?: string; userAgent?: string },
  expiresInDays: number = 7
): Promise<string> {
  try {
    const db = await getDb();
    const sessions = db.collection<SessionDocument>('sessions');

    const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;

    // Generate secure random token
    const token = randomBytes(32).toString('hex');

    // Session expires in specified days (default: 7 days)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000);

    const session: SessionDocument = {
      userId: objectId,
      token,
      createdAt: now,
      expiresAt,
      ip: req?.ip,
      userAgent: req?.userAgent,
    };

    await sessions.insertOne(session);

    // Ensure indexes exist
    try {
      await sessions.createIndex({ token: 1 }, { unique: true });
      await sessions.createIndex({ userId: 1 });
      await sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    } catch (err) {
      // Index might already exist
      console.warn('Index creation warning (may already exist):', err);
    }

    return token;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

/**
 * Get session by token and verify it's not expired
 */
export async function getSessionByToken(token: string): Promise<SessionDocument | null> {
  try {
    const db = await getDb();
    const sessions = db.collection<SessionDocument>('sessions');

    const session = await sessions.findOne({
      token,
      expiresAt: { $gt: new Date() },
    });

    return session;
  } catch (error) {
    console.error('Error getting session by token:', error);
    return null;
  }
}

/**
 * Delete session by token
 */
export async function deleteSession(token: string): Promise<boolean> {
  try {
    const db = await getDb();
    const sessions = db.collection<SessionDocument>('sessions');

    const result = await sessions.deleteOne({ token });

    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
}

/**
 * Delete all sessions for a user
 */
export async function deleteUserSessions(userId: string | ObjectId): Promise<boolean> {
  try {
    const db = await getDb();
    const sessions = db.collection<SessionDocument>('sessions');

    const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;

    const result = await sessions.deleteMany({ userId: objectId });

    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting user sessions:', error);
    return false;
  }
}

