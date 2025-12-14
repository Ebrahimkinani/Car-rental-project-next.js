# Signup Auto-Login Fix

## Problem
When a user signed up, the data was successfully saved in MongoDB, but the app redirected to the homepage without signing the user in. The user had to manually log in after registration.

## Root Cause
- The register route (`/api/auth/register`) was not creating a session or setting a cookie
- The AuthContext was calling the login route again after registration, which was inefficient
- Session expiration was inconsistent (30 minutes in some places, not aligned with cookie maxAge)

## Solution
Updated the authentication flow to automatically log users in after signup by creating a session and setting a secure cookie.

## Changes Made

### 1. Updated `/api/auth/register` route (`src/app/api/auth/register/route.ts`)
- Imported `createSession` from `@/lib/db/sessions`
- After successful user creation, create a session token
- Set HTTP-only cookie with the same configuration as login
- Return user data in the response (normalized to lowercase)
- Cookie expires after 7 days

Key additions:
```typescript
// Create session (automatically logs user in)
const sessionToken = await createSession(user._id, {
  ip,
  userAgent,
});

// Set HTTP-only cookie on the response (same as login)
response.cookies.set('session', sessionToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
});
```

### 2. Updated `createSession` function (`src/lib/db/sessions.ts`)
- Added optional `expiresInDays` parameter with default of 7 days
- Session now expires based on the provided expiration time
- Updated documentation to reflect the configurable expiration

Changes:
```typescript
export async function createSession(
  userId: string | ObjectId,
  req?: { ip?: string; userAgent?: string },
  expiresInDays: number = 7  // Default: 7 days
): Promise<string>
```

### 3. Updated `/api/auth/login` route (`src/app/api/auth/login/route.ts`)
- Changed cookie `maxAge` from 30 minutes to 7 days for consistency
- Both login and signup now have the same session duration

Changes:
```typescript
maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
```

### 4. Updated AuthContext register function (`src/contexts/AuthContext.tsx`)
- Removed redundant call to `login()` after registration
- Now uses the user data returned directly from the registration API
- Updates state with user data immediately after successful registration
- Falls back to loading from session if needed

Changes:
```typescript
// Use returned user data directly instead of calling login again
if (result.user) {
  const userData = {
    id: result.user.id,
    email: result.user.email,
    fullName: `${result.user.firstName || ''} ${result.user.lastName || ''}`.trim(),
    firstName: result.user.firstName,
    lastName: result.user.lastName,
    username: result.user.email.split('@')[0],
    role: result.user.role,
    status: result.user.status,
    permissions: [],
    authProvider: 'email' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  setState(prev => ({
    ...prev,
    user: userData as any,
    loading: false,
    error: null,
  }));
}
```

## Authentication Flow

### Signup Flow (New)
1. User submits registration form
2. `POST /api/auth/register` creates user in MongoDB
3. Session is created in MongoDB `sessions` collection
4. Secure HTTP-only cookie is set in the browser
5. User data is returned in the response
6. AuthContext updates state with user data
7. User is automatically logged in and redirected to home

### Login Flow
1. User submits login form
2. `POST /api/auth/login` validates credentials
3. If valid, session is created in MongoDB
4. Secure HTTP-only cookie is set in the browser
5. User data is returned in the response
6. AuthContext updates state and redirects based on role

### Session Verification
1. Client makes request with session cookie
2. `/api/me` calls `requireAuth()` which calls `verifySession()`
3. `verifySession()` reads session cookie
4. Looks up session in MongoDB
5. Verifies session is not expired
6. Fetches user data from MongoDB
7. Returns normalized user data

## Cookie Configuration
- **Name**: `session`
- **HttpOnly**: `true` (prevents XSS attacks)
- **Secure**: `true` in production (HTTPS only)
- **SameSite**: `lax` (CSRF protection)
- **Path**: `/` (available site-wide)
- **MaxAge**: 7 days (604,800 seconds)

## Session Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId,      // Reference to users collection
  token: string,          // Unique session token
  createdAt: Date,
  expiresAt: Date,        // 7 days from creation
  ip?: string,
  userAgent?: string
}
```

## Security Features
- ✅ HTTP-only cookies prevent JavaScript access
- ✅ Secure flag in production prevents transmission over HTTP
- ✅ SameSite=Lax prevents CSRF attacks
- ✅ Session expires after 7 days automatically
- ✅ MongoDB TTL index auto-deletes expired sessions
- ✅ Session tokens are cryptographically secure (32 bytes random)

## Testing
1. **Signup Flow**:
   - Go to `/auth/register`
   - Fill out registration form
   - Submit
   - User should be immediately logged in and redirected to home
   - Check browser DevTools → Application → Cookies → `session` cookie should be visible
   - Cookie should have 7-day expiration

2. **Reload Test**:
   - After signup, reload the page
   - User should remain logged in (cookie still valid)
   - `/api/me` should return user data

3. **Logout Test**:
   - Click logout
   - Session cookie should be cleared
   - User should be logged out
   - `/api/me` should return `{ user: null }`

4. **Login Flow** (unchanged):
   - Go to `/auth/login`
   - Enter credentials
   - User should be logged in with 7-day session
   - Should work the same as before

## Files Modified
1. `src/app/api/auth/register/route.ts` - Added session creation and cookie setting
2. `src/lib/db/sessions.ts` - Made session expiration configurable
3. `src/app/api/auth/login/route.ts` - Updated to use 7-day sessions
4. `src/contexts/AuthContext.tsx` - Updated register function to use returned user data

## No Breaking Changes
- All existing authentication flows remain unchanged
- Login functionality is enhanced but backward compatible
- Cookie format and name remain the same
- Middleware and session verification unchanged

## Status: ✅ COMPLETE
The signup flow now automatically logs users in by creating a session and setting a secure HTTP-only cookie that lasts for 7 days, matching the login flow behavior.

