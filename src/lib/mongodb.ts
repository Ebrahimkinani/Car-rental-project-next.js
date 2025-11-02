import mongoose, { ConnectOptions } from "mongoose";

// Import models to ensure they are registered before database queries
import "@/models/Category";
import "@/models/Car";
import "@/models/Booking";
import "@/models/Favorite";
import "@/models/Notification";
import "@/models/Session";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB; // e.g. "cars-project"

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in .env.local");
}

// keep a global cache so Next.js hot reload doesn't create many connections
let cached = (global as any)._mongooseGlobal as
  | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
  | undefined;

if (!cached) {
  cached = { conn: null, promise: null };
  (global as any)._mongooseGlobal = cached;
}

export async function dbConnect() {
  // return existing connection
  if (cached!.conn) {
    return cached!.conn;
  }

  // create the promise if it doesn't exist
  if (!cached!.promise) {
    const opts: ConnectOptions = {
      dbName: MONGODB_DB,
      maxPoolSize: 10,
    };

    cached!.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        console.log(
          "✅ Connected to MongoDB:",
          mongooseInstance.connection.host,
          "/",
          mongooseInstance.connection.name
        );
        return mongooseInstance;
      })
      .catch((err) => {
        // reset promise on error so we can retry later
        cached!.promise = null;
        console.error("❌ MongoDB connection error:", err);
        throw err;
      });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
