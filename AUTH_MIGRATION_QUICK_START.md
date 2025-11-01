# Quick Start: MongoDB Auth Migration

## ✅ What's Been Implemented

Your authentication system has been migrated from Firebase Auth to MongoDB-only authentication.

### New Files Created
1. **`src/lib/db/users.ts`** - User database with password hashing
2. **`src/lib/db/sessions.ts`** - Session management
3. **`src/app/api/auth/register/route.ts`** - User registration
4. **`src/app/api/auth/login/route.ts`** - User login
5. **`src/lib/auth/requireAuth.ts`** - Auth guard helper

### Updated Files
1. **`src/contexts/AuthContext.tsx`** - Now uses `/api/auth/login`
2. **`src/app/api/me/route.ts`** - Uses `requireAuth()`
3. **`src/app/api/admin/bookings/route.ts`** - Uses `requireAuth()`
4. **`src/app/api/logout/route.ts`** - Updated to new sessions

## 🚀 How to Use

### Register a New User
```typescript
// POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "role": "customer",  // or "employee", "manager", "admin"
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```typescript
// POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123"
}

// Response: Sets HTTP-only cookie and returns:
{
  "ok": true,
  "user": {
    "id": "...",
    "email": "user@example.com",
    "role": "customer",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Protect API Routes
```typescript
import { requireAuth } from '@/lib/auth/requireAuth';

export async function GET(request: NextRequest) {
  // Require any authenticated user
  const { user } = await requireAuth(request);
  
  // Or require specific roles
  const { user } = await requireAuth(request, ['admin', 'manager']);
  
  // Use user data
  return NextResponse.json({ message: `Hello ${user.email}` });
}
```

### Get Current User
```typescript
import { getCurrentUser } from '@/lib/auth/requireAuth';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request); // Returns null if not authenticated
  
  if (user) {
    return NextResponse.json({ user });
  } else {
    return NextResponse.json({ message: 'Not logged in' });
  }
}
```

## 🔒 Security Features

### Passwords
- ✅ Hashed with bcrypt (cost factor 12)
- ✅ Never stored in plain text
- ✅ Never returned in API responses
- ✅ Minimum 8 characters required

### Sessions
- ✅ HTTP-only cookies (JavaScript can't access)
- ✅ Secure flag in production (HTTPS only)
- ✅ SameSite=Lax (CSRF protection)
- ✅ 7-day expiration
- ✅ Stored in MongoDB

### Authorization
- ✅ Role checks server-side only
- ✅ Suspended users cannot login
- ✅ Required roles enforced
- ✅ Never trusts client data

## 📝 What You Need to Do

### 1. Create Your First Admin User

Since there's no database yet, create one via API:

```bash
# Start your dev server
npm run dev

# In another terminal, create an admin user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123",
    "role": "admin",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

### 2. Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123"
  }'
```

### 3. Test Current User

```bash
curl http://localhost:3000/api/me \
  -b cookies.txt
```

### 4. Update Admin Panel

Update admin panel to use `/api/auth/register` instead of Firebase for creating new users:

```typescript
// In admin create user flow
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email,
    password: tempPassword,
    role: 'employee',
    firstName,
    lastName
  })
});
```

## 🔄 Migration Path

### For Existing Users (Not Yet Implemented)

If you have existing Firebase users, you'll need to:

1. Export their email addresses
2. Create accounts in MongoDB with temporary passwords
3. Email them reset links
4. They can login with new `/api/auth/login`

### Firebase Code (Can Keep)

- Firebase SDK is still installed
- Old Firebase auth code is kept for backward compatibility
- Can be removed after all users are migrated

## 🧪 Testing

### Test User Creation
```bash
POST /api/auth/register
→ Should return 201 Created
→ Should not return password hash
```

### Test Duplicate Email
```bash
POST /api/auth/register (same email twice)
→ Should return 409 Conflict
```

### Test Login
```bash
POST /api/auth/login
→ Should return 200 OK
→ Should set session cookie
→ Should return user data (no password)
```

### Test Invalid Password
```bash
POST /api/auth/login (wrong password)
→ Should return 401 Unauthorized
```

### Test Suspended User
```bash
POST /api/auth/login (user with status='suspended')
→ Should return 403 Forbidden
```

### Test Protected Route
```bash
GET /api/me (no cookie)
→ Should return 401 Unauthorized

GET /api/me (with valid cookie)
→ Should return 200 OK with user data
```

## 📚 Documentation Files

- **`MIGRATION_FIREBASE_TO_MONGODB_AUTH.md`** - Phase 0 analysis
- **`MONGODB_AUTH_IMPLEMENTATION_SUMMARY.md`** - Implementation details
- **`AUTH_MIGRATION_QUICK_START.md`** - This file

## ⚠️ Important Notes

1. **No Auto-Login on Register**: Users must login separately after registration
2. **Temporary Passwords**: Generate secure temp passwords for admin-created users
3. **Email Uniqueness**: Enforced at database level with unique index
4. **Role Values**: Use exactly `"customer"`, `"employee"`, `"manager"`, `"admin"`
5. **Status Values**: Use exactly `"active"`, `"suspended"`, `"invited"`

## 🎯 Next Steps

1. ✅ Test the new auth system
2. ⏳ Create your first admin user
3. ⏳ Update remaining admin routes to use `requireAuth()`
4. ⏳ Migrate existing Firebase users
5. ⏳ Add password reset flow
6. ⏳ Remove Firebase dependencies

## 🆘 Troubleshooting

### "Cannot connect to MongoDB"
- Check `MONGODB_URI` environment variable
- Ensure MongoDB is running
- Check firewall/network settings

### "Invalid password hash"
- Ensure you're using bcrypt (cost factor 12)
- Check password comparison logic

### "Session cookie not set"
- Check cookie settings in browser
- Ensure `credentials: 'include'` in fetch requests
- Check SameSite policy (should be 'lax')

### "User not found after login"
- Check email normalization (lowercase, trimmed)
- Ensure user exists in MongoDB
- Check database connection

