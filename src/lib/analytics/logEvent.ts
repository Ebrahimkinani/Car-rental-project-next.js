import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db/mongo";
import { EventDoc } from "@/lib/types/db";

export async function logEvent(args: {
  mongoUserId: ObjectId | null;
  uid: string | null;
  type: string;
  context?: Record<string, any>;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  const { mongoUserId, uid, type, context, ip, userAgent } = args;

  const db = await getDb();
  const events = db.collection<EventDoc>("events");

  const now = new Date();

  await events.insertOne({
    userId: mongoUserId ?? null,
    uid: uid ?? null,
    type,
    context: context ?? {},
    ip: ip ?? null,
    userAgent: userAgent ?? null,
    createdAt: now,
  });
}
