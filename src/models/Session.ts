import mongoose, { Document, Schema, models } from 'mongoose';

export interface ISession extends Document {
  userId: string; // Firebase UID
  token: string; // Internal JWT token
  createdAt: Date;
  expiresAt: Date;
  device?: string;
  ip?: string;
  userAgent?: string;
  isActive: boolean;
}

const SessionSchema = new Schema<ISession>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // MongoDB TTL index
  },
  device: {
    type: String,
    default: null,
  },
  ip: {
    type: String,
    default: null,
  },
  userAgent: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
}, {
  timestamps: true,
});

// Compound indexes for efficient queries
SessionSchema.index({ userId: 1, isActive: 1 });
SessionSchema.index({ token: 1, isActive: 1 });

// Static methods
SessionSchema.statics.findActiveByToken = function(token: string) {
  return this.findOne({ token, isActive: true, expiresAt: { $gt: new Date() } });
};

SessionSchema.statics.findActiveByUserId = function(userId: string) {
  return this.find({ userId, isActive: true, expiresAt: { $gt: new Date() } });
};

SessionSchema.statics.deactivateByToken = function(token: string) {
  return this.updateOne({ token }, { isActive: false });
};

SessionSchema.statics.deactivateByUserId = function(userId: string) {
  return this.updateMany({ userId }, { isActive: false });
};

SessionSchema.statics.cleanupExpired = function() {
  return this.deleteMany({ expiresAt: { $lt: new Date() } });
};

const Session = models.Session || mongoose.model<ISession>('Session', SessionSchema);

export default Session;

