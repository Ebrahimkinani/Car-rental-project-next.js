# Authentication Issue - Fixed

## Problem

**User**: sss@gmail.com  
**Password**: 111111  
**Issue**: Login was failing with "Invalid email or password"

## Root Cause

Your application has **two separate user collections**:

1. **`users` collection** - Used by login API (`/api/auth/login`)
2. **`adminUsers` collection** - Used by admin panel management

The login API checks the **`users` collection** (line 116 in `src/lib/db/users.ts`), but the user **only existed in `adminUsers` collection**.

## What Happened

When admin users are created through the admin panel API (`/api/admin/users` POST), the code at lines 142-150 **SHOULD** create the user in both collections:

```typescript
// Create user in main users collection (with hashed password)
await createUser({
  email,
  plainPassword: password,
  role: role.toLowerCase() as 'customer' | 'employee' | 'manager' | 'admin',
  firstName,
  lastName,
});
```

However, this user (`sss@gmail.com`) was created **before** this sync logic existed, or was created through a different method that didn't sync to the `users` collection.

## Solution Applied

I created and ran a sync script that:
1. Found the user in `adminUsers` collection
2. Created the user in `users` collection with properly hashed password
3. Set the user status to `active`
4. Mapped the role correctly (`Admin` → `admin`)

## Verification

✅ User now exists in **BOTH** collections:
- `users` collection: sss@gmail.com (admin, active)
- `adminUsers` collection: sss@gmail.com (Admin, Active)

✅ Password verification: `111111` → ✅ VALID

## Login Credentials

- **Email**: sss@gmail.com
- **Password**: 111111
- **Role**: admin

## Authentication Flow

```
User enters email + password
         ↓
POST /api/auth/login
         ↓
findUserByEmail(email) → Checks 'users' collection
         ↓
validatePassword(password, passwordHash)
         ↓
createSession(userId)
         ↓
Return session cookie
```

## Important Notes

1. **Database Checked**: `users` collection (NOT `adminUsers`)
2. **Password Hash**: bcrypt with 12 rounds
3. **Status Required**: User must have `status: 'active'` to login
4. **Case Sensitivity**: Email is normalized to lowercase before lookup

## Prevention

To prevent this issue in the future:

1. **Always use the admin panel** to create users - it creates in both collections
2. **If manually creating users**, create in both collections
3. Consider creating a **migration script** to sync existing `adminUsers` → `users`

## Current State

- ✅ User can now login successfully
- ✅ User has admin role
- ✅ User is active
- ✅ Password is properly hashed

---

**Date Fixed**: 2025-10-26  
**Issue**: Duplicate user collections causing login failure  
**Status**: RESOLVED

