import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { verifySession } from '@/lib/auth/verifySession';
import { dbConnect } from '@/lib/mongodb';
import { Notification } from '@/models/Notification';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await verifySession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  let objectId: mongoose.Types.ObjectId;
  try {
    objectId = new mongoose.Types.ObjectId(params.id);
  } catch {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const userObjectId = new mongoose.Types.ObjectId(session.id);
  const role = session.role.toLowerCase();

  const result = await Notification.updateOne(
    {
      _id: objectId,
      $or: [
        { userId: userObjectId },
        { role },
      ],
    },
    {
      $set: { read: true, readAt: new Date() },
    }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}


