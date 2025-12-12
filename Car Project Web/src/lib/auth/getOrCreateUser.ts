import { getDb } from "@/lib/db/mongo";
import { UserDoc } from "@/lib/types/db";

export async function getOrCreateUser(params: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<UserDoc> {
  const { uid, email, displayName, photoURL, ip, userAgent } = params;

  const db = await getDb();
  const users = db.collection<UserDoc>("users");

  const now = new Date();

  const existing = await users.findOne({ uid });

  if (existing) {
    await users.updateOne(
      { _id: existing._id },
      {
        $set: {
          email,
          displayName,
          photoURL,
          lastLoginAt: now,
          lastLoginIp: ip ?? existing.lastLoginIp ?? null,
          lastLoginUserAgent: userAgent ?? existing.lastLoginUserAgent ?? null,
        },
      }
    );

    return existing;
  }

  const newUser = {
    uid,
    email,
    displayName,
    photoURL,
    role: "user" as const,
    status: "active" as const,
    createdAt: now,
    lastLoginAt: now,
    lastLoginIp: ip ?? null,
    lastLoginUserAgent: userAgent ?? null,
    meta: {},
  };

  const result = await users.insertOne(newUser);
  return { ...newUser, _id: result.insertedId } as UserDoc;
}
