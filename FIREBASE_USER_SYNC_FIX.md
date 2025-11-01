# Firebase User Sync to MongoDB - Fix Guide

## Problem Identified
The MongoDB user sync is failing because the Firebase Admin SDK is not properly configured. The `.env.local` file contains placeholder values for the Firebase Admin credentials.

## Root Cause
1. **Missing Firebase Admin Private Key**: The `FIREBASE_ADMIN_PRIVATE_KEY` is set to a placeholder value
2. **Invalid Firebase Admin Client Email**: The `FIREBASE_ADMIN_CLIENT_EMAIL` is set to a placeholder value
3. **Authentication Middleware Failure**: The `verifyFirebaseToken` function fails due to invalid Firebase Admin credentials

## Solution Steps

### 1. Fix Firebase Admin Configuration

You need to get the actual Firebase Admin SDK credentials from your Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `test1-aa7c3`
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Extract the values and update your `.env.local`:

```env
# Replace these placeholder values with actual values from Firebase Console
FIREBASE_ADMIN_PROJECT_ID=test1-aa7c3
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@test1-aa7c3.iam.gserviceaccount.com
```

### 2. Alternative: Use Development Mode (Temporary Fix)

If you want to test the user sync functionality without setting up Firebase Admin, you can modify the authentication middleware to work in development mode:

```typescript
// In src/lib/firebase/auth-middleware.ts
export async function verifyFirebaseToken(request: NextRequest): Promise<User | null> {
  try {
    // Development mode - skip Firebase verification
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_FIREBASE_VERIFICATION === 'true') {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1];
        // Return a mock user for development
        return {
          id: 'dev-user-123',
          firebaseUid: 'dev-user-123',
          email: 'dev@example.com',
          username: 'devuser',
          firstName: 'Dev',
          lastName: 'User',
          avatar: '',
          role: 'user' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }

    // Production mode - verify Firebase token
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      return null;
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Return user data from the token
    return {
      id: decodedToken.uid,
      firebaseUid: decodedToken.uid,
      email: decodedToken.email || '',
      username: decodedToken.name || decodedToken.email?.split('@')[0] || '',
      firstName: decodedToken.name?.split(' ')[0] || '',
      lastName: decodedToken.name?.split(' ').slice(1).join(' ') || '',
      avatar: decodedToken.picture || '',
      role: 'user' as const,
      createdAt: new Date(decodedToken.iat * 1000),
      updatedAt: new Date(decodedToken.iat * 1000),
    };
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    return null;
  }
}
```

### 3. Test the Fix

After implementing either solution, test the user sync:

```bash
# Test with development mode
curl -X POST http://localhost:3000/api/users/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-token" \
  -d '{
    "firebaseUid": "test-123",
    "email": "test@example.com",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User",
    "authProvider": "email"
  }'
```

## Expected Results

After fixing the Firebase Admin configuration:

1. ✅ User sync API will return `200 OK` instead of `401 Unauthorized`
2. ✅ Users will be created/updated in MongoDB successfully
3. ✅ Authentication flow will work end-to-end
4. ✅ No more "Failed to sync user to MongoDB" errors

## Monitoring

Check the server logs for successful user sync:
```
✅ New user created: {
  firebaseUid: "user-123",
  email: "user@example.com",
  authProvider: "email",
  timestamp: "2025-01-25T..."
}
```

## Next Steps

1. Set up proper Firebase Admin credentials
2. Test user registration and login flows
3. Verify user data is properly stored in MongoDB
4. Monitor authentication logs for any issues
