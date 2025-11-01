# Firebase to MongoDB Auth Migration - Phase 0 Analysis

## Overview
This document analyzes the current authentication system and outlines the migration path from Firebase Auth to MongoDB-only authentication.

## Current Architecture Analysis

### Authentication Flow (Current)
```
1. User logs in via Firebase Auth (email/password or Google)
   ↓
2. Client receives Firebase ID token
   ↓
3. Client calls POST /api/session with Firebase ID token
   ↓
4. Server verifies Firebase token via Firebase Admin SDK
   ↓
5. Server calls getOrCreateUser() which syncs to MongoDB
   ↓
6. Server creates MongoDB session with JWT token
   ↓
7. Server sets HTTP-only cookie 'session' with JWT
   ↓
8. All subsequent requests authenticate via session cookie
```

### Key Components

#### Frontend (Client-Side)
- **File**: `src/app/(routes)/auth/login/page.tsx`
  - Login form component
  - Calls `firebaseAuthService.signInWithEmail(email, password)`
  
- **File**: `src/contexts/AuthContext.tsx`
  - Auth state management
  - Listens to Firebase auth state changes
  - Calls `/api/session` to create MongoDB session
  - Loads user data from `/api/me`

- **File**: `services/auth/firebase-auth.service.ts`
  - Wraps Firebase Auth SDK calls
  - Handles email/password and Google sign-in
  - Syncs users to MongoDB via `/api/users/sync`

#### Backend (Server-Side)
- **File**: `src/app/api/session/route.ts`
  - POST: Creates session after Firebase verification
  - GET: Verifies session exists
  
- **File**: `src/lib/auth.ts`
  - `verifyFirebaseToken()` - Verifies Firebase ID tokens
  - `createSession()` - Creates MongoDB session and JWT
  - `getSessionFromRequest()` - Gets session from cookie
  - `deactivateSession()` - Logs out user

- **File**: `src/lib/auth/getOrCreateUser.ts`
  - Syncs Firebase users to MongoDB
  - Uses OLD schema: `uid`, `displayName`, etc.

- **File**: `src/lib/services/users.service.ts`
  - Handles unified user operations
  - Uses NEW schema: `firebaseUid`, `fullName`, etc.

- **File**: `src/middleware.ts`
  - Protects `/admin/**` routes
  - Validates session cookie
  - Checks user role and status

- **File**: `lib/models/Session.ts`
  - MongoDB session schema
  - Stores JWT tokens and user info
  - TTL index for auto-cleanup

### Database Schemas

#### Old Schema (in `src/lib/types/db.ts`)
```typescript
{
  uid: string;              // Firebase UID
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "user" | "manager" | "admin";
  status: "active" | "banned" | "deleted" | "pending";
  createdAt: Date;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
  lastLoginUserAgent: string | null;
}
```

#### New Schema (in `src/lib/services/users.service.ts`)
```typescript
{
  firebaseUid: string;      // Required, unique
  email: string;            // Unique
  fullName: string;
  role: 'customer' | 'employee' | 'manager' | 'admin';
  permissions: string[];
  status: 'active' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Session Schema
```typescript
{
  userId: string;           // Firebase UID (currently)
  token: string;            // JWT token
  createdAt: Date;
  expiresAt: Date;
  device?: string;
  ip?: string;
  userAgent?: string;
  isActive: boolean;
}
```

### Current Issues
1. **Dual Schema Problem**: Two different user schemas exist simultaneously
2. **Firebase Dependency**: All authentication depends on Firebase
3. **No Password Storage**: Passwords exist only in Firebase Auth
4. **Schema Mismatches**: Field name conflicts (`uid` vs `firebaseUid`, `displayName` vs `fullName`)

### Files Requiring Changes

#### Must Change
1. `src/lib/db/users.ts` - **NEW FILE** - MongoDB user helpers with password hashing
2. `src/lib/db/sessions.ts` - **UPDATE** - Session helpers (already exists in `lib/models/Session.ts`)
3. `src/app/api/auth/register/route.ts` - **NEW FILE** - Registration endpoint
4. `src/app/api/auth/login/route.ts` - **NEW FILE** - Login endpoint
5. `src/lib/auth/requireAuth.ts` - **NEW FILE** - Auth guard helper
6. `src/contexts/AuthContext.tsx` - **UPDATE** - Remove Firebase dependency
7. `src/app/(routes)/auth/login/page.tsx` - **UPDATE** - Use new login API
8. `src/middleware.ts` - **UPDATE** - Use new auth system
9. `src/app/api/me/route.ts` - **UPDATE** - Use new auth system
10. All `/api/admin/**` routes - **UPDATE** - Use `requireAuth()` helper
11. All protected API routes - **UPDATE** - Use `requireAuth()` helper

#### May Change
- `services/auth/firebase-auth.service.ts` - Mark as deprecated
- `src/lib/auth.ts` - Keep for session management but remove Firebase bits
- `src/lib/auth/getOrCreateUser.ts` - Keep for migration period

### Dependencies to Add
```json
{
  "bcrypt": "^5.1.1",  // For password hashing
  "@types/bcrypt": "^5.0.2"
}
```

## Migration Strategy

### Phase 1: Add Password Support to MongoDB
Create unified user schema with password hash:
```typescript
{
  _id: ObjectId,
  email: string (unique, lowercase),
  passwordHash: string (bcrypt),
  role: "customer" | "employee" | "manager" | "admin",
  status: "active" | "suspended" | "invited",
  firstName?: string,
  lastName?: string,
  phone?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Phase 2: Update Sessions
Change sessions to use MongoDB user ID instead of Firebase UID:
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref to users._id),
  token: string,
  createdAt: Date,
  expiresAt: Date,
  ip?: string,
  userAgent?: string
}
```

### Phase 3: New Auth API Routes
- POST `/api/auth/register` - Create new user with hashed password
- POST `/api/auth/login` - Verify password, create session, set cookie

### Phase 4: New Auth Helper
Create `requireAuth(requiredRoles?)` that:
1. Reads session cookie
2. Looks up session in MongoDB
3. Loads user from MongoDB
4. Validates user.status === 'active'
5. Validates role (if required)
6. Returns `{ user, session }` or throws error

### Phase 5: Update All Protected Routes
Replace Firebase auth checks with `requireAuth()` calls.

### Phase 6: Update Frontend
Remove Firebase Auth SDK calls, use new `/api/auth/login` endpoint.

### Phase 7: Migration for Existing Users
For existing Firebase users, we'll need to:
1. Export their emails
2. Create MongoDB users with random temp passwords
3. Email them reset links
4. Eventually remove Firebase dependency

## Security Considerations
1. **Password Hashing**: Use bcrypt with cost factor 12
2. **Session Security**: HttpOnly, Secure, SameSite=Lax cookies
3. **Rate Limiting**: Add to `/api/auth/login` to prevent brute force
4. **Role Checks**: Always server-side, never trust client
5. **Status Checks**: Suspended users cannot login
6. **Unique Emails**: Enforce at database level with unique index

## Rollback Plan
Keep Firebase code for 1-2 weeks. If critical issues arise:
1. Update feature flags to use Firebase auth
2. Existing sessions will continue to work
3. Gradually migrate users back

## Timeline
- Phase 0-1: Days 1-2 (Database setup)
- Phase 2-3: Days 3-4 (API routes)
- Phase 4: Day 5 (Auth helper)
- Phase 5: Days 6-7 (Update routes)
- Phase 6: Day 8 (Frontend)
- Phase 7: Days 9-10 (Testing & migration)
- Total: ~10 days

## Success Metrics
- [ ] All new users register via MongoDB
- [ ] All users can login via MongoDB
- [ ] No Firebase Auth calls in production
- [ ] All protected routes use `requireAuth()`
- [ ] Zero authentication security vulnerabilities
- [ ] 100% test coverage for auth flows

