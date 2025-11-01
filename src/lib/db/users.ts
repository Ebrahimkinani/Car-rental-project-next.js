/**
 * Users Database Module
 * MongoDB-only user management with password hashing
 * 
 * Schema:
 * {
 *   _id: ObjectId,
 *   email: string (unique, lowercase, required),
 *   passwordHash: string (bcrypt, required),
 *   role: "customer" | "employee" | "manager" | "admin",
 *   status: "active" | "suspended" | "invited",
 *   firstName?: string,
 *   lastName?: string,
 *   phone?: string,
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 */

import bcrypt from 'bcrypt';
import { getDb } from './mongo';
import { ObjectId } from 'mongodb';

export type UserRole = 'customer' | 'employee' | 'manager' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'invited';

export interface UserDocument {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  authProvider?: 'email' | 'google';
  createdAt: Date;
  updatedAt: Date;
}

// Bcrypt configuration
const BCRYPT_ROUNDS = 12;

/**
 * Create a new user with password hashing
 */
export async function createUser({
  email,
  plainPassword,
  role = 'customer',
  firstName,
  lastName,
  phone,
}: {
  email: string;
  plainPassword: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
}): Promise<UserDocument> {
  try {
    const db = await getDb();
    const users = db.collection<UserDocument>('users');

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const existingUser = await users.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);

    // Create user document
    const now = new Date();
    const newUser: UserDocument = {
      email: normalizedEmail,
      passwordHash,
      role,
      status: 'active',
      firstName,
      lastName,
      phone,
      authProvider: 'email',
      createdAt: now,
      updatedAt: now,
    };

    const result = await users.insertOne(newUser);

    // Ensure unique index on email
    try {
      await users.createIndex({ email: 1 }, { unique: true });
      await users.createIndex({ role: 1 });
      await users.createIndex({ status: 1 });
    } catch (err) {
      // Index might already exist, ignore
      console.warn('Index creation warning (may already exist):', err);
    }

    return { ...newUser, _id: result.insertedId };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<UserDocument | null> {
  try {
    const db = await getDb();
    const users = db.collection<UserDocument>('users');
    const normalizedEmail = email.toLowerCase().trim();
    return await users.findOne({ email: normalizedEmail });
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

/**
 * Find user by MongoDB ObjectId
 */
export async function findUserById(id: string | ObjectId): Promise<UserDocument | null> {
  try {
    const db = await getDb();
    const users = db.collection<UserDocument>('users');
    
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return await users.findOne({ _id: objectId });
  } catch (error) {
    console.error('Error finding user by ID:', error);
    return null;
  }
}

/**
 * Validate password against hash
 */
export async function validatePassword(
  plainPassword: string,
  passwordHash: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, passwordHash);
  } catch (error) {
    console.error('Error validating password:', error);
    return false;
  }
}

/**
 * Update user password
 */
export async function updateUserPassword(
  userId: string | ObjectId,
  newPlainPassword: string
): Promise<boolean> {
  try {
    const db = await getDb();
    const users = db.collection<UserDocument>('users');
    
    const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    const passwordHash = await bcrypt.hash(newPlainPassword, BCRYPT_ROUNDS);

    const result = await users.updateOne(
      { _id: objectId },
      { 
        $set: { 
          passwordHash,
          updatedAt: new Date()
        } 
      }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string | ObjectId,
  updates: Partial<Omit<UserDocument, '_id' | 'passwordHash' | 'createdAt'>>
): Promise<UserDocument | null> {
  try {
    const db = await getDb();
    const users = db.collection<UserDocument>('users');
    
    const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;

    const result = await users.findOneAndUpdate(
      { _id: objectId },
      { 
        $set: { 
          ...updates,
          updatedAt: new Date()
        } 
      },
      { returnDocument: 'after' }
    );

    return result || null;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Update user status
 */
export async function updateUserStatus(
  userId: string | ObjectId,
  status: UserStatus
): Promise<boolean> {
  try {
    const db = await getDb();
    const users = db.collection<UserDocument>('users');
    
    const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;

    const result = await users.updateOne(
      { _id: objectId },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        } 
      }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
}

/**
 * Delete user
 */
export async function deleteUser(userId: string | ObjectId): Promise<boolean> {
  try {
    const db = await getDb();
    const users = db.collection<UserDocument>('users');
    
    const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;

    const result = await users.deleteOne({ _id: objectId });

    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

