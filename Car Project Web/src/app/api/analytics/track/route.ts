import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { logEvent } from "@/lib/analytics/logEvent";
import { verifySession } from "@/lib/auth/verifySession";

export async function POST(req: NextRequest) {
  try {
    const { type, context } = await req.json();

    // get current logged in user/session from cookie
    const session = await verifySession(req);

    const ip =
      req.headers.get("x-forwarded-for") ||
      // @ts-expect-error - req.ip may exist in some runtimes
      req.ip ||
      null;

    const userAgent = req.headers.get("user-agent") || null;

    await logEvent({
      mongoUserId: session?.id ? new ObjectId(session.id) : null,
      uid: session?.email ?? null,
      type,
      context,
      ip,
      userAgent,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Analytics tracking failed:", error);
    return NextResponse.json({ ok: true }); // Always return success to not block UI
  }
}
