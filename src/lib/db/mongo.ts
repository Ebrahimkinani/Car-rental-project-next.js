import type { Db } from 'mongodb';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/mongodb';

export async function getDb(): Promise<Db> {
  await dbConnect();

  const db = mongoose.connection.db;

  if (!db) {
    throw new Error('MongoDB connection is not established');
  }

  return db;
}
