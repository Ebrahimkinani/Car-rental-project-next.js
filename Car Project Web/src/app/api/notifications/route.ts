import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { verifySession } from '@/lib/auth/verifySession';
import { dbConnect } from '@/lib/mongodb';
import { Notification } from '@/models/Notification';
import { pushToUserSocket } from '@/lib/realtime';

// GET /api/notifications - current user's notifications
export async function GET(request: NextRequest) {
  const session = await verifySession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const userObjectId = new mongoose.Types.ObjectId(session.id);
  const role = session.role.toLowerCase();

  const items = await Notification.find({
    $or: [
      { userId: userObjectId },
      { role },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  return NextResponse.json(items);
}

// POST /api/notifications - create a notification (admin/manager)
export async function POST(request: NextRequest) {
  const session = await verifySession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allowed = ['admin', 'manager'];
  if (!allowed.includes(session.role.toLowerCase())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await dbConnect();

  const body = await request.json();
  const {
    userId,
    role,
    bookingId,
    type,
    title,
    message,
    actionUrl,
  } = body || {};

  if (!type || !title || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const doc: any = {
    userId: userId ? new mongoose.Types.ObjectId(userId) : null,
    role: role ? String(role).toLowerCase() : null,
    bookingId: bookingId ? new mongoose.Types.ObjectId(bookingId) : null,
    type,
    title,
    message,
    actionUrl: actionUrl ?? null,
    read: false,
    readAt: null,
    createdAt: new Date(),
    sentWebsocket: false,
    sentEmail: false,
    sentSMS: false,
  };

  const created = await Notification.create(doc);

  await pushToUserSocket({
    userId: userId || null,
    role: role || null,
    payload: { type: 'notification:new', notification: created.toObject() },
  });

  return NextResponse.json({ ok: true, id: created._id.toString() });
}


