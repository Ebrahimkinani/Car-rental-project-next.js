# Authentication System Documentation

## Overview

This project implements a hybrid authentication system that combines Firebase Authentication with MongoDB session management. The system provides secure, persistent authentication using HTTP-only cookies and JWT tokens.

## Architecture

### Components

1. **Firebase Authentication** - Handles user identity and authentication
2. **MongoDB Sessions** - Stores session data and tracks active sessions
3. **JWT Tokens** - Internal session tokens for API authentication
4. **HTTP-only Cookies** - Secure token storage in the browser

### Flow

```
1. User logs in with Firebase Auth
2. Client obtains Firebase ID token
3. Client sends ID token to /api/session
4. Server verifies Firebase token with Admin SDK
5. Server creates internal JWT session token
6. Server stores session in MongoDB
7. Server sets HTTP-only cookie with JWT
8. All subsequent requests use the cookie for authentication
```

## API Endpoints

### POST /api/session
Creates a new session after Firebase authentication.

**Request:**
```json
{
  "idToken": "firebase-id-token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session created successfully",
  "user": {
    "uid": "firebase-uid",
    "email": "user@example.com",
    "displayName": "User Name"
  }
}
```

**Cookie Set:**
- Name: `session`
- Value: JWT token
- HttpOnly: true
- Secure: true (production)
- SameSite: "lax"
- Max-Age: 7 days

### GET /api/session
Verifies if a session exists and is valid.

**Response (Authenticated):**
```json
{
  "authenticated": true,
  "user": {
    "userId": "firebase-uid",
    "email": "user@example.com",
    "displayName": "User Name"
  }
}
```

**Response (Unauthenticated):**
```json
{
  "authenticated": false
}
```

### POST/DELETE /api/logout
Terminates the current session.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Cookie Cleared:**
- Session cookie is removed from browser

## Database Schema

### Sessions Collection

```typescript
interface ISession {
  userId: string;        // Firebase UID
  token: string;         // Internal JWT token
  createdAt: Date;       // Session creation time
  expiresAt: Date;       // Session expiration time
  device?: string;       // Device type (mobile, desktop, tablet)
  ip?: string;          // Client IP address
  userAgent?: string;    // Browser user agent
  isActive: boolean;     // Session status
}
```

**Indexes:**
- `userId` + `isActive` (compound)
- `token` + `isActive` (compound)
- `expiresAt` (TTL index for automatic cleanup)

## Client-Side Usage

### Authentication Context

The `AuthContext` automatically handles session creation when a user logs in with Firebase:

```typescript
const { user, login, logout, loading } = useAuth();

// Login automatically creates session
await login(email, password);

// Logout automatically clears session
await logout();
```

### Making Authenticated Requests

All API requests should include credentials:

```typescript
const response = await fetch('/api/favorites', {
  credentials: 'include' // Important for cookies
});
```

## Server-Side Usage

### Protecting API Routes

Use the `getSessionFromRequest` function to protect API routes:

```typescript
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Use session.userId for user-specific operations
  const userId = session.userId;
  // ... rest of your logic
}
```

### Helper Functions

```typescript
// Verify Firebase token
const firebaseUser = await verifyFirebaseToken(idToken);

// Create session
const sessionToken = await createSession(userId, email, displayName);

// Verify JWT token
const payload = verifyJWTToken(token);

// Get session from cookie
const session = await getSessionFromCookie();

// Deactivate session
await deactivateSession(token);

// Cleanup expired sessions
const deletedCount = await cleanupExpiredSessions();
```

## Environment Variables

Required environment variables:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/cars-project

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-secret-key-here

# Firebase Admin (for server-side verification)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com

# Firebase Client (for client-side auth)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Security Features

### Token Security
- JWT tokens are signed with a secret key
- Tokens expire after 7 days
- Tokens are stored in HTTP-only cookies (not accessible via JavaScript)
- Cookies are secure in production (HTTPS only)
- SameSite protection against CSRF attacks

### Session Management
- Sessions are stored in MongoDB with TTL indexes
- Expired sessions are automatically cleaned up
- Sessions can be deactivated individually or for all user sessions
- Device and IP tracking for security monitoring

### Firebase Integration
- Firebase tokens are verified server-side using Admin SDK
- No client-side token storage
- Automatic token refresh handled by Firebase SDK

## Testing

Run the authentication flow test:

```bash
node test-auth-flow.js
```

This will test:
- Session endpoint accessibility
- Logout functionality
- Protected route security
- Error handling

## Migration from Previous System

The new system is backward compatible. Existing Firebase authentication will continue to work, but with the added benefits of:

- Persistent sessions across browser refreshes
- Server-side session management
- Enhanced security with HTTP-only cookies
- Better user experience with automatic session handling

## Troubleshooting

### Common Issues

1. **Session not persisting**
   - Check that `credentials: 'include'` is set on fetch requests
   - Verify JWT_SECRET is set in environment variables
   - Check MongoDB connection

2. **401 Unauthorized errors**
   - Verify session cookie is being sent
   - Check if session has expired
   - Verify JWT token is valid

3. **Firebase token verification fails**
   - Check Firebase Admin SDK configuration
   - Verify environment variables are correct
   - Check Firebase project settings

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## Performance Considerations

- Sessions are cached in memory for fast access
- MongoDB TTL indexes automatically clean up expired sessions
- JWT verification is fast and stateless
- Firebase token verification is cached by the Admin SDK

## Future Enhancements

- Session refresh mechanism
- Multi-device session management
- Session analytics and monitoring
- Rate limiting per session
- Session-based user preferences
