import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const pathname = nextUrl.pathname;

  // We only care about protecting /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Lightweight auth gate:
  // Check ONLY whether a "session" cookie exists.
  const token = cookies.get('session')?.value;

  if (!token) {
    // No session cookie at all -> force login.
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Cookie exists. We are NOT validating role/status/expiry here.
  // Full authorization will be enforced later by:
  // - (admin)/layout.tsx via /api/me
  // - requireAuth() in API routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
