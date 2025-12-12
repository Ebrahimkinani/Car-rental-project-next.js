import mongoose from 'mongoose';
import { Notification } from '@/models/Notification';
import { pushToUserSocket } from './realtime';
import { CreateNotificationInput } from './types/notifications';
import { dbConnect } from './mongodb';

export async function createNotification(input: CreateNotificationInput) {
  await dbConnect();

  const doc: any = {
    userId: input.userId ? new mongoose.Types.ObjectId(input.userId) : null,
    role: input.role ? String(input.role).toLowerCase() : null,
    bookingId: input.bookingId ? new mongoose.Types.ObjectId(input.bookingId) : null,
    type: input.type,
    title: input.title,
    message: input.message,
    actionUrl: input.actionUrl ?? null,
    read: false,
    readAt: null,
    createdAt: new Date(),
    sentWebsocket: false,
    sentEmail: false,
    sentSMS: false,
  };

  const created = await Notification.create(doc);
  const plain = created.toObject();

  // Broadcast to SSE clients
  await pushToUserSocket({
    userId: input.userId || null,
    role: input.role || null,
    payload: {
      type: 'notification:new',
      notification: {
        _id: plain._id.toString(),
        userId: plain.userId?.toString() || null,
        role: plain.role || null,
        bookingId: plain.bookingId?.toString() || null,
        type: plain.type,
        title: plain.title,
        message: plain.message,
        actionUrl: plain.actionUrl || null,
        read: plain.read,
        readAt: plain.readAt ? plain.readAt.toISOString() : null,
        createdAt: plain.createdAt.toISOString(),
      },
    },
  });

  return plain;
}


