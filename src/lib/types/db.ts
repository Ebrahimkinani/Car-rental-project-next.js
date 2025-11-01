import { ObjectId } from "mongodb";

export interface UserDoc {
  _id?: ObjectId;
  uid: string; // Firebase UID
  email: string | null;
  displayName: string | null;
  photoURL: string | null;

  role: "user" | "manager" | "admin";
  status: "active" | "banned" | "deleted" | "pending";

  createdAt: Date;
  lastLoginAt: Date | null;

  lastLoginIp: string | null;
  lastLoginUserAgent: string | null;

  phone?: string | null;
  companyId?: ObjectId | null;

  meta?: {
    firstSeenSource?: string;
    [key: string]: any;
  };
}

export interface EventDoc {
  _id: ObjectId;
  userId: ObjectId | null; // link to users._id
  uid: string | null;      // Firebase UID (duplicate for quick lookup)

  type: string; // e.g. "AUTH_LOGIN", "BOOKING_CREATED", "WHATSAPP_CLICK"

  context: Record<string, any>; // dynamic payload (carId, bookingId, etc)

  ip: string | null;
  userAgent: string | null;

  createdAt: Date;
}
