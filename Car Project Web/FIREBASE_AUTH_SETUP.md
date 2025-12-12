# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for the Cars Project application.

## Prerequisites

- A Google account
- Node.js and npm installed
- The Cars Project application set up locally

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "cars-project-auth")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it and toggle "Enable"
     - Add your project's support email
     - Add authorized domains (e.g., `localhost` for development)

## Step 3: Get Firebase Configuration

1. In the Firebase Console, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (`</>`) to add a web app
5. Register your app with a nickname (e.g., "Cars Project Web")
6. Copy the Firebase configuration object

## Step 4: Set Up Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add the following environment variables:

```bash
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Firebase Admin SDK (Server-side)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# MongoDB Configuration (existing)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=car_rental

# Next.js Environment
NODE_ENV=development
```

## Step 5: Generate Firebase Admin SDK Key

1. In the Firebase Console, go to "Project settings"
2. Click on the "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Extract the following values from the JSON file:
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`

## Step 6: Update MongoDB User Schema

The application will automatically sync Firebase users to MongoDB. Ensure your MongoDB user collection includes these fields:

```javascript
{
  _id: ObjectId,
  firebaseUid: String, // Firebase UID (unique, indexed)
  username: String,
  email: String,
  firstName: String,
  lastName: String,
  avatar: String,
  role: String, // 'admin' | 'user' | 'guest'
  authProvider: String, // 'email' | 'google'
  createdAt: Date,
  updatedAt: Date
}
```

## Step 7: Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/auth/login` or `/auth/register`

3. Test both authentication methods:
   - **Email/Password**: Create an account or sign in
   - **Google Sign-In**: Click "Continue with Google"

4. Verify that:
   - Users are created in both Firebase and MongoDB
   - Authentication state persists across page refreshes
   - Protected routes (like admin panel) require authentication
   - Logout works correctly

## Step 8: Production Setup

For production deployment:

1. Add your production domain to Firebase authorized domains
2. Update environment variables with production values
3. Ensure your production MongoDB has the updated user schema
4. Test all authentication flows in production

## Features Implemented

### Authentication Methods
- ✅ Email/Password registration and login
- ✅ Google Sign-In
- ✅ Password reset via email
- ✅ Automatic user sync to MongoDB

### Security Features
- ✅ Firebase ID token verification on API routes
- ✅ Protected admin routes with role-based access
- ✅ Secure token management
- ✅ Error handling for authentication failures

### User Experience
- ✅ Loading states during authentication
- ✅ Error messages for failed authentication
- ✅ Automatic redirects after successful login
- ✅ Persistent authentication state

## Troubleshooting

### Common Issues

1. **"Firebase App not initialized"**
   - Check that all environment variables are set correctly
   - Ensure `.env.local` is in the project root

2. **"Invalid API key"**
   - Verify the API key in your environment variables
   - Check that the key is from the correct Firebase project

3. **"Google Sign-In not working"**
   - Verify Google Sign-In is enabled in Firebase Console
   - Check that your domain is added to authorized domains

4. **"User not syncing to MongoDB"**
   - Check MongoDB connection string
   - Verify the user sync API endpoint is working
   - Check server logs for errors

### Debug Mode

To enable debug logging, add this to your `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_DEBUG=true
```

## API Endpoints

The following API endpoints are protected with Firebase authentication:

- `GET /api/favorites` - Get user's favorite cars
- `POST /api/favorites` - Add car to favorites
- `DELETE /api/favorites/[carId]` - Remove car from favorites
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update user profile
- `POST /api/users/sync` - Sync Firebase user to MongoDB

## Next Steps

1. **Customize UI**: Update the authentication forms to match your design
2. **Add More Providers**: Implement Facebook, Apple, or other OAuth providers
3. **User Management**: Add admin features for user management
4. **Email Templates**: Customize Firebase email templates
5. **Analytics**: Add Firebase Analytics for authentication events

## Support

If you encounter issues:

1. Check the browser console for client-side errors
2. Check the server logs for API errors
3. Verify all environment variables are set correctly
4. Test with Firebase emulators for local development

For more information, refer to the [Firebase Authentication Documentation](https://firebase.google.com/docs/auth).
