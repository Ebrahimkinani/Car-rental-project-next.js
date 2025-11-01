import mongoose, { Schema, HydratedDocument } from 'mongoose';

export interface INotification {
  // targeting
  userId: mongoose.Types.ObjectId | null;
  role: string | null;
  bookingId: mongoose.Types.ObjectId | null;

  // content
  type: string;
  title: string;
  message: string;
  actionUrl: string | null;

  // status
  read: boolean;
  readAt: Date | null;

  // delivery info
  createdAt: Date;
  sentWebsocket: boolean;
  sentEmail: boolean;
  sentSMS: boolean;
}

export type NotificationDocument = HydratedDocument<INotification>;

const NotificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  },
  role: {
    type: String,
    default: null,
    index: true,
    lowercase: true,
    trim: true,
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    default: null,
    index: true,
  },

  type: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  actionUrl: { type: String, default: null },

  read: { type: Boolean, default: false, index: true },
  readAt: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now, index: true },
  sentWebsocket: { type: Boolean, default: false },
  sentEmail: { type: Boolean, default: false },
  sentSMS: { type: Boolean, default: false },
}, {
  collection: 'notifications',
});

// Indexes
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ role: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);


