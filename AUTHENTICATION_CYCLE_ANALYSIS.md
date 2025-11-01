# Authentication Sign-In Cycle Analysis Report

## Executive Summary

The authentication system has **critical schema mismatches** and **data consistency issues** that prevent proper user authentication and session management. The system is using two different user schemas simultaneously, causing authentication failures and data inconsistencies.

**Key Finding**: Users created during sign-in use field names like `uid` and `displayName`, but the system tries to retrieve them using `firebaseUid` and `fullName`, causing users to never be found after login.

## Quick Summary

### The Problem
```
User Logs In
    ↓
Firebase Auth Successful ✅
    ↓
Session Created in MongoDB with OLD schema: { uid: "123", email: "user@email.com" } ✅
    ↓
/api/me tries to find user with NEW schema: { firebaseUid: "123" } ❌
    ↓
User Not Found → Sign Out → Authentication Fails ❌
```

### Root Cause
Incomplete migration from old user schema to new "unified" user schema. Two schemas are being used simultaneously:
- **Old Schema** (used by `getOrCreateUser`): `uid`, `displayName`, `email`
- **New Schema** (expected by `/api/me`): `firebaseUid`, `fullName`, `email`

---

## Current Architecture

### Components Involved

1. **Client-Side**:
   - `AuthContext.tsx` - Main authentication context
   - Login page (`src/app/(routes)/auth/login/page.tsx`)
   - `firebase-auth.service.ts` - Firebase authentication service

2. **API Endpoints**:
   - `/api/session` - Session creation and verification
   - `/api/me` - Get current user data
   - `/api/users/sync` - Sync Firebase user to MongoDB
   - `/api/logout` - Logout handler

3. **Server-Side**:
   - `src/lib/auth.ts` - Auth utilities
   - `src/lib/auth/getOrCreateUser.ts` - User creation/retrieval
   - `src/lib/services/users.service.ts` - User service with unified schema
   - `src/middleware.ts` - Route protection

---

## Authentication Flow (Current Implementation)

### Sign-In Process Flow:

```
1. User enters credentials on login page
   ↓
2. AuthContext.login() called
   ↓
3. firebaseAuthService.signInWithEmail() → Firebase Auth
   ↓
4. firebaseAuthService.syncUserToMongoDB() → Calls /api/users/sync
   ↓
5. /api/users/sync → Uses OLD schema (UserDoc) with fields:
   - firebaseUid
   - username, firstName, lastName
   - role: 'user' (default)
   ↓
6. AuthContext.loadUserData() → Fires when Firebase auth state changes
   ↓
7. /api/session POST → Creates session cookie
   ↓
8. getOrCreateUser() called → Uses OLD UserDoc schema
   ↓
9. /api/me GET → Fetches user using UnifiedUserDoc schema
   ↓
10. ❌ SCHEMA MISMATCH - Session created with old schema, /api/me expects new schema
```

---

## Critical Issues Identified

### 1. **Dual User Schema Conflict** 🔴

**Issue**: The application uses two different user schemas simultaneously:

#### Old Schema (`UserDoc` from `src/lib/types/db.ts`)
```typescript
{
  uid: string;              // Uses 'uid' not 'firebaseUid'
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "user" | "manager" | "admin";
  status: "active" | "banned" | "deleted" | "pending";
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
  lastLoginUserAgent: string | null;
}
```

#### New Schema (`UnifiedUserDoc` from `src/lib/services/users.service.ts`)
```typescript
{
  firebaseUid: string;      // Uses 'firebaseUid' not 'uid'
  email: string;
  fullName: string;         // Uses 'fullName' not 'displayName'
  role: 'customer' | 'employee' | 'manager' | 'admin';
  status: 'active' | 'suspended';  // Different status values
  permissions: string[];     // New field
}
```

**Impact**: 
- Users created in old schema cannot be found by `/api/me` which expects `firebaseUid`
- Field name mismatches (`uid` vs `firebaseUid`, `displayName` vs `fullName`)
- Role values don't match (`user` vs `customer`, `employee`)
- Status values don't match

**Location**:
- `src/lib/auth/getOrCreateUser.ts` - Uses old schema
- `src/app/api/users/sync/route.ts` - Uses old schema
- `src/lib/services/users.service.ts` - Uses new schema
- `src/app/api/me/route.ts` - Expects new schema

---

### 2. **Multiple User Sync Mechanisms** 🔴

**Issue**: The system tries to sync users through different mechanisms:

1. **`/api/users/sync`** - Called by `firebaseAuthService.syncUserToMongoDB()`
   - Uses old schema structure
   - Handles `username`, `firstName`, `lastName` fields

2. **`getOrCreateUser()`** - Called by `/api/session` POST
   - Also uses old schema but different field structure

**Result**: Users may be created twice with different schemas, or fail to sync properly.

---

### 3. **Session Creation vs User Lookup Mismatch** 🔴

**Flow Issue**:

```typescript
// In /api/session/route.ts (line 40-47)
const mongoUser = await getOrCreateUser({
  uid: firebaseUser.uid,        // ❌ Creates with 'uid' field
  email: firebaseUser.email,
  displayName: firebaseUser.name,
  photoURL: null,
});

// But /api/me expects (line 34)
const user = await getUserByFirebaseUid(session.userId);
// Which looks for 'firebaseUid' field ❌
```

**Impact**: Session is created for a user with `uid` field, but `/api/me` tries to find user by `firebaseUid` field → User not found.

---

### 4. **Role Mapping Inconsistency** 🟡

**Issue**: Different role sets in different parts of the system:

- Old schema: `"user" | "manager" | "admin"`
- New schema: `'customer' | 'employee' | 'manager' | 'admin'`
- Old users have role `"user"`, new system expects `"customer"`

**Impact**: Role-based access control may fail for migrated users.

---

### 5. **Firebase Auth State Changes Trigger Multiple Operations** 🟡

**Issue**: In `AuthContext.tsx`, when `onAuthStateChanged` fires, it:
1. Creates session via `/api/session`
2. Calls `/api/me` to get user data
3. But these might be racing or the session might not be available yet

**Location**: `src/contexts/AuthContext.tsx` lines 153-155

---

### 6. **Logout Implementation Inconsistency** 🟡

**Issue**: The logout route tries to deactivate session by `userId`:

```typescript
// In /api/logout/route.ts (line 20)
const deactivated = await deactivateSession(session.userId);
```

But `deactivateSession()` expects a `token`:

```typescript
// In src/lib/auth.ts (line 216)
export async function deactivateSession(token: string): Promise<boolean>
```

**Impact**: Logout may not properly deactivate sessions in the database.

---

## Specific Code Issues

### Issue 1: Field Name Mismatch in getOrCreateUser

**File**: `src/lib/auth/getOrCreateUser.ts`

```typescript
// Line 19: Uses 'uid' field
const existing = await users.findOne({ uid });

// Line 40: Creates with 'uid' field  
const newUser = {
  uid,  // ❌ Should be 'firebaseUid'
  email,
  // ...
}
```

**Expected by**: `/api/me` route calls `getUserByFirebaseUid()` which looks for `firebaseUid`.

---

### Issue 2: /api/me Cannot Find Users Created by Session

**File**: `src/app/api/me/route.ts` line 34

```typescript
const user = await getUserByFirebaseUid(session.userId);
```

This calls `getUserByFirebaseUid()` from `users.service.ts` which queries:
```typescript
await users.findOne({ firebaseUid: uid });
```

But users created via `getOrCreateUser()` have `uid` field, not `firebaseUid`.

---

### Issue 3: Dual Collection Structure

The system appears to have two different user collections:
1. `users` collection with old schema (used by `getOrCreateUser`)
2. `users` collection with new schema (used by `users.service.ts`)

This causes conflicts when reading/writing user data.

---

## Detailed Flow Analysis

### Successful Path (Hypothetical)

If schemas were aligned:
```
User Login
  ↓
Firebase Auth → Returns ID token
  ↓
AuthContext.onAuthStateChanged
  ↓
/api/session POST
  ├─ verifyFirebaseToken()
  ├─ getOrCreateUser() → Creates/Finds user in MongoDB
  ├─ createSession() → Creates session in MongoDB
  └─ Sets HTTP-only cookie
  ↓
/api/me GET
  ├─ getSessionFromRequest()
  ├─ getUserByFirebaseUid() → Returns user data
  └─ Returns: email, fullName, role, status, permissions
  ↓
AuthContext.storeUserData()
  ↓
Redirect based on role
```

### Current Broken Path

```
User Login
  ↓
Firebase Auth → Returns ID token
  ↓
AuthContext.onAuthStateChanged
  ↓
/api/session POST
  ├─ verifyFirebaseToken() ✅
  ├─ getOrCreateUser() → Creates user with OLD schema
  │  ├─ Fields: uid, email, displayName
  │  └─ role: "user", status: "active"
  ├─ createSession() ✅
  └─ Sets cookie ✅
  ↓
/api/me GET
  ├─ getSessionFromRequest() ✅
  ├─ getUserByFirebaseUid() 
  │  ├─ Queries: { firebaseUid: session.userId }
  │  └─ ❌ User not found (user has 'uid' not 'firebaseUid')
  └─ Returns 404 ❌
  ↓
AuthContext.loadUserData()
  ├─ Response not OK
  ├─ Sign out user ❌
  └─ Error: "User account not found. Please register." ❌
```

---

## Root Cause

The root cause is a **migration from an old user schema to a new "unified" user schema that was never completed**. The codebase has:

1. **Old schema**: Used by `getOrCreateUser()` and `/api/users/sync`
2. **New schema**: Used by `users.service.ts` and `/api/me`

These schemas are fundamentally incompatible:
- Different field names (`uid` vs `firebaseUid`, `displayName` vs `fullName`)
- Different role sets
- Different status values

The session API creates users with the old schema, but `/api/me` tries to query using the new schema, resulting in users never being found.

---

## Recommendations

### Option 1: Complete Migration to New Schema (Recommended) ✅

1. **Update `getOrCreateUser.ts`** to use new schema:
   - Change `uid` to `firebaseUid`
   - Change `displayName` to `fullName`
   - Update role to use new role set
   - Update status values

2. **Update `/api/users/sync`** to use new schema or remove it if redundant

3. **Migrate existing users** from old schema to new schema

4. **Update all references** to use consistent field names

### Option 2: Rollback to Old Schema

1. Revert `users.service.ts` to use old schema
2. Update `getUserByFirebaseUid` to query by `uid` field
3. Ensure all endpoints use consistent schema

### Option 3: Implement Schema Migration Layer

Create an abstraction layer that handles both schemas during transition period.

---

## Priority Fixes

### Critical (Must Fix Immediately) 🔴

1. **Fix schema inconsistency in `getOrCreateUser.ts`**
   - Change field names to match `UnifiedUserDoc`
   - Update role and status values

2. **Fix `getUserByFirebaseUid`** to also check for old `uid` field for backward compatibility

3. **Fix logout function signature mismatch**

### High Priority 🟡

4. Consolidate user sync mechanisms
5. Add error logging to identify schema mismatches
6. Document the correct user schema

### Medium Priority 🟢

7. Add database migration scripts
8. Update all documentation
9. Add integration tests for auth flow

---

## Testing Checklist

After fixes, test:
- [ ] User can log in with email/password
- [ ] User can log in with Google
- [ ] Session cookie is set correctly
- [ ] `/api/me` returns user data
- [ ] Admin users can access `/admin`
- [ ] Customer users cannot access `/admin`
- [ ] User can log out successfully
- [ ] Session persists across page refreshes
- [ ] Expired sessions are cleaned up
- [ ] Suspended users are blocked

---

## Files Requiring Changes

1. `src/lib/auth/getOrCreateUser.ts` - Fix schema fields
2. `src/lib/services/users.service.ts` - Add backward compatibility
3. `src/lib/auth.ts` - Fix `deactivateSession` in logout
4. `src/app/api/session/route.ts` - Potentially simplify flow
5. `src/contexts/AuthContext.tsx` - Add error handling
6. `src/middleware.ts` - Verify user lookup works

---

## Additional Issues Found

### Issue 7: TypeScript Type Mismatch

**File**: `src/types/index.ts` vs `src/lib/services/users.service.ts`

The TypeScript User interface defines roles as:
```typescript
export type UserRole = "admin" | "manager" | "user" | "guest";
```

But the UnifiedUserDoc uses:
```typescript
export type UserRole = 'customer' | 'employee' | 'manager' | 'admin';
```

**Impact**: Type checking may not catch incorrect role values, and the system may not handle all role types consistently.

### Issue 8: Role Mismatch in AuthContext

**File**: `src/contexts/AuthContext.tsx` lines 115-120

```typescript
const staffRoles = ['admin', 'manager', 'employee'];
```

But the UserRole type in `src/types/index.ts` doesn't include `'customer'` or `'employee'` but includes `'user'` and `'guest'`.

**Impact**: The type system may not correctly validate role assignments.

---

## Conclusion

The authentication system has **fundamental schema inconsistencies** that prevent it from working correctly. The most critical issue is that users are created with an old schema but queried with a new schema, causing authentication failures.

**Immediate Action Required**: Align all user creation and retrieval mechanisms to use a single, consistent schema.

### Priority Summary

🔴 **Critical Issues (Fix First)**:
1. Schema field mismatch (`uid` vs `firebaseUid`, `displayName` vs `fullName`)
2. Two different user schemas in use simultaneously
3. `/api/me` cannot find users created by `/api/session`
4. Logout function signature mismatch

🟡 **High Priority Issues**:
5. Role type inconsistencies across codebase
6. Multiple user sync mechanisms conflicting
7. Firebase Auth state changes may race with session creation

🟢 **Medium Priority Issues**:
8. Admin layout validation works but data may be inconsistent
9. Need database migration strategy
10. Error logging insufficient for debugging auth issues

### Expected Behavior After Fixes

After implementing the recommended fixes:
- Users should be created with consistent schema
- `/api/me` should successfully retrieve user data
- Sessions should persist correctly
- Role-based access control should work
- Admin routes should be properly protected
- Users should be able to log out successfully

