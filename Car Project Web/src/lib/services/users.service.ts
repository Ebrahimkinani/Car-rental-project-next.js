/**
 * Users Service
 * Handles user CRUD operations with unified schema
 * 
 * Schema:
 * {
 *   firebaseUid: string (required, unique index),
 *   email: string (unique index),
 *   fullName: string,
 *   role: 'customer' | 'employee' | 'manager' | 'admin',
 *   permissions: string[],
 *   status: 'active' | 'suspended',
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 */

import { getDb } from '@/lib/db/mongo';
import { ObjectId } from 'mongodb';

export type UserRole = 'customer' | 'employee' | 'manager' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface UnifiedUserDoc {
  _id?: ObjectId;
  firebaseUid: string; // Required, unique index
  email: string;
  fullName: string;
  role: UserRole;
  permissions: string[];
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get user by Firebase UID
 */
export async function getUserByFirebaseUid(uid: string): Promise<UnifiedUserDoc | null> {
  try {
    const db = await getDb();
    const users = db.collection<UnifiedUserDoc>('users');
    
    const user = await users.findOne({ firebaseUid: uid });
    return user;
  } catch (error) {
    console.error('Error getting user by Firebase UID:', error);
    throw error;
  }
}

/**
 * Create user profile in MongoDB
 */
export async function createUserProfile(data: {
  firebaseUid: string;
  email: string;
  fullName: string;
  role: UserRole;
  permissions?: string[];
  status?: UserStatus;
}): Promise<UnifiedUserDoc> {
  try {
    const db = await getDb();
    const users = db.collection<UnifiedUserDoc>('users');
    
    const now = new Date();
    const newUser: UnifiedUserDoc = {
      firebaseUid: data.firebaseUid,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      permissions: data.permissions || [],
      status: data.status || 'active',
      createdAt: now,
      updatedAt: now,
    };
    
    const result = await users.insertOne(newUser);
    
    // Ensure indexes exist
    await users.createIndex({ firebaseUid: 1 }, { unique: true });
    await users.createIndex({ email: 1 }, { unique: true });
    await users.createIndex({ role: 1 });
    await users.createIndex({ status: 1 });
    
    return { ...newUser, _id: result.insertedId };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  firebaseUid: string,
  data: Partial<Omit<UnifiedUserDoc, '_id' | 'firebaseUid' | 'createdAt'>>
): Promise<UnifiedUserDoc | null> {
  try {
    const db = await getDb();
    const users = db.collection<UnifiedUserDoc>('users');
    
    const updated = await users.findOneAndUpdate(
      { firebaseUid },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );
    
    return updated;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Get user by email (for duplicate checking)
 */
export async function getUserByEmail(email: string): Promise<UnifiedUserDoc | null> {
  try {
    const db = await getDb();
    const users = db.collection<UnifiedUserDoc>('users');
    
    const user = await users.findOne({ email });
    return user;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

/**
 * Delete user by Firebase UID
 */
export async function deleteUserByFirebaseUid(firebaseUid: string): Promise<boolean> {
  try {
    const db = await getDb();
    const users = db.collection<UnifiedUserDoc>('users');
    
    const result = await users.deleteOne({ firebaseUid });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
