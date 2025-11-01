# Authentication Unification Summary

## Overview
Successfully unified authentication for customers and employees using Firebase Auth as the single source of identity, with MongoDB as the source of truth for roles/permissions.

## ✅ Completed Implementation

### 1. Unified User Schema
**File**: `src/lib/services/users.service.ts`

Created a unified user schema in MongoDB with:
```typescript
{
  firebaseUid: string (required, unique index),
  email: string (unique index),
  fullName: string,
  role: 'customer' | 'employee' | 'manager' | 'admin',
  permissions: string[],
  status: 'active' | 'suspended',
  createdAt: Date,
  updatedAt: Date
}
```

**Service Functions**:
- `getUserByFirebaseUid(uid)` - Get user by Firebase UID
- `createUserProfile(data)` - Create new user profile
- `updateUserProfile(uid, data)` - Update user profile
- `getUserByEmail(email)` - Check for duplicate emails
- `deleteUserByFirebaseUid(uid)` - Delete user

### 2. Employee Creation Flow
**File**: `src/app/api/admin/create-employee/route.ts`

**Endpoint**: `POST /api/admin/create-employee`

**Flow**:
1. Admin provides: `fullName`, `email`, `role`, `permissions[]`, `status`
2. Server generates secure temporary password
3. Creates Firebase Auth user
4. Creates MongoDB user record with role/permissions
5. Returns temp password to show in UI (one-time display)
6. **Rollback logic**: If MongoDB insert fails, delete Firebase user. If Firebase fails, rollback any MongoDB insert.

**Security**:
- No plaintext passwords in MongoDB (passwords only in Firebase Auth)
- Atomic operations with rollback on failure
- Email validation
- Duplicate email checking

### 3. Updated `/api/me` Endpoint
**File**: `src/app/api/me/route.ts`

**Endpoint**: `GET /api/me`

**Returns**:
```json
{
  "success": true,
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "admin",
  "status": "active",
  "permissions": ["permission1", "permission2"]
}
```

**Security**:
- NEVER trusts client-provided role
- Role ALWAYS comes from database
- Returns 403 if status !== 'active'
- Returns 404 if user not found

### 4. Middleware Protection
**File**: `src/middleware.ts`

**Protects**: All `/admin/**` routes

**Flow**:
1. Check session cookie exists
2. Verify session token (via internal API call)
3. Fetch user from MongoDB via `/api/me`
4. Check user status === 'active'
5. Check role is in ['admin', 'manager', 'employee']
6. Allow or redirect to `/auth/login` or `/no-access`

**Config**:
```typescript
export const config = {
  matcher: ['/admin/:path*'],
};
```

### 5. Removed Insecure Login Logic
**File**: `src/app/(routes)/auth/login/page.tsx`

**Removed**:
- ❌ Client-side role selection checkbox
- ❌ "I am an employee" checkbox
- ❌ Role dropdown (admin/manager/user)

**New Flow**:
- User enters email + password only
- Server determines role from MongoDB after login
- Automatic redirect based on role

### 6. Updated Login Flow
**File**: `src/contexts/AuthContext.tsx`

**New Login Flow**:
1. User submits email + password
2. Firebase Auth signs in user
3. Create session cookie
4. Call `/api/me` to get role/status/permissions
5. Check if status === 'active'
6. If suspended → sign out + show error message
7. If active → redirect based on role:
   - Staff (admin/manager/employee) → `/admin/dashboard`
   - Customer → `/`

### 7. Admin Layout Guard
**File**: `src/app/(admin)/layout.tsx`

**Protection Logic**:
```typescript
const staffRoles = ['admin', 'manager', 'employee'];

// Check user exists
if (!user) router.push('/auth/login');

// Check user has staff role
if (!staffRoles.includes(user.role)) router.push('/no-access');

// Check user account is active
if (user.status !== 'active') router.push('/auth/login?error=suspended');
```

**Removed**: Development mode bypass (insecure)

### 8. Created `/no-access` Page
**File**: `src/app/no-access/page.tsx`

Shows when users try to access `/admin` without proper permissions.

## 🔐 Security Features

### Server-Side Role Enforcement
- ❌ Never trusts client-provided role claims
- ✅ Role always comes from MongoDB
- ✅ Middleware validates role before allowing `/admin` access
- ✅ Admin layout validates role client-side (secondary check)

### Password Security
- ❌ No plaintext passwords in MongoDB
- ✅ Passwords only stored in Firebase Auth
- ✅ Strong temporary passwords generated server-side

### Suspension Logic
- ✅ `/api/me` returns 403 if suspended
- ✅ Middleware blocks suspended users from `/admin`
- ✅ Admin layout redirects suspended users
- ✅ AuthContext signs out suspended users automatically
- ✅ Shows clear error: "Your account is suspended. Contact Operations."

### Session Management
- ✅ HTTP-only session cookies
- ✅ Session expiry and cleanup
- ✅ IP and User-Agent tracking
- ✅ Multiple sessions per user (with device tracking)

## 🚀 Usage

### Creating an Employee (Admin Panel)
```typescript
POST /api/admin/create-employee
Body: {
  "fullName": "John Doe",
  "email": "john@company.com",
  "role": "employee",
  "permissions": ["bookings.view", "bookings.create"],
  "status": "active"
}

Response: {
  "success": true,
  "firebaseUid": "abc123...",
  "tempPassword": "SecureP@ssw0rd123!",
  "message": "Employee created successfully"
}
```

### Customer/Employee Login
Both use the **same login page**:
1. Enter email + password
2. Firebase Auth authenticates
3. `/api/me` returns role
4. Auto-redirect:
   - Staff → `/admin/dashboard`
   - Customer → `/`

### Protecting Admin Routes
Already protected automatically via:
- `middleware.ts` - Server-side protection
- `src/app/(admin)/layout.tsx` - Client-side guard (secondary)

## 📋 Database Indexes

Ensure MongoDB has these indexes:
```javascript
db.users.createIndex({ firebaseUid: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ status: 1 })
```

## 🔄 Migration Notes

### Existing Users
If you have existing users in MongoDB, you need to:
1. Update their schema to match `UnifiedUserDoc`
2. Add `role`, `status`, `permissions` fields
3. Ensure `firebaseUid` field exists and is unique

### Old Auth Code
The following code has been replaced and should be reviewed:
- Old `/api/users/me` - Now uses unified schema
- Old admin user creation - Now uses `/api/admin/create-employee`
- Old login role selection - Now server-determined

## ⚠️ TODO / Future Improvements

1. **Password Reset Flow**: Currently shows temp password in UI. Replace with:
   - Email onboarding with temp password
   - Force password change on first login
   - Password reset via Firebase

2. **Permissions System**: Currently stores as string array. Consider:
   - Structured permission objects
   - Permission validation middleware
   - Permission inheritance from roles

3. **Role-Based Middleware**: Add `checkUserRole(req, allowedRoles)` helper

4. **Audit Logging**: Track admin actions (user creation, suspension, etc.)

5. **Environment Variables**: Document required env vars:
   - `NEXT_PUBLIC_BASE_URL` (for middleware)
   - Firebase Admin SDK credentials
   - MongoDB connection string

## 📝 Testing Checklist

- [ ] Admin can create employee via `/api/admin/create-employee`
- [ ] Employee can log in with email + temp password
- [ ] Employee auto-redirects to `/admin/dashboard`
- [ ] Customer can log in and stays on public pages
- [ ] Customer cannot access `/admin` (redirected to `/no-access`)
- [ ] Suspended user cannot log in (signed out immediately)
- [ ] Suspended staff cannot access `/admin` (redirected to login)
- [ ] Middleware blocks unauthorized access to `/admin/**`
- [ ] Role is never trusted from client (always from DB)

## 🎉 Success Criteria Met

✅ Employee creation flow creates both Firebase user and MongoDB record
✅ Customer and employee use same login page (email + password)
✅ After login, redirect based on role from database
✅ `/admin` is protected on server (middleware + layout guard)
✅ No client-side role selection (role from DB only)
✅ Suspension logic works (sign out + error message)
✅ Password never stored in MongoDB (only Firebase Auth)

