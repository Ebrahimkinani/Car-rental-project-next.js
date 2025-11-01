# Admin Login Redirect Fix

## Issue
When logging in as admin, the console showed:
- ✅ User is staff (admin), redirecting to dashboard
- 🚀 Redirecting admin to /admin/dashboard

However, the app would still show the public frontend instead of redirecting to the admin dashboard.

## Root Causes

### 1. Custom Redirect Override Issue
In `src/contexts/AuthContext.tsx`, the redirect logic was checking for `window.__postLoginRedirect` BEFORE checking if the user was staff:

```typescript
// OLD CODE (BUGGY)
const customRedirect = window.__postLoginRedirect;
if (customRedirect) {
  // Would use custom redirect even for admin users
  redirectPath = customRedirect;
} else if (staffRoles.includes(result.user.role)) {
  redirectPath = '/admin/dashboard';
}
```

This meant that if there was any custom redirect set (e.g., from the login page URL params), it would override the admin dashboard redirect.

### 2. Race Condition in User Data Loading
The login method was calling `router.push()` BEFORE loading user data:

```typescript
// OLD CODE (BUGGY)
loadUserDataFromSession().catch(err => console.error('Error loading user data:', err));
router.push(redirectPath);
```

This caused a race condition where the admin layout would render before user data was loaded, causing it to think there was no authenticated user and redirect back to `/auth/login`.

### 3. Layout Conflicts
The root layout was wrapping ALL pages (including admin pages) with Navbar and Footer, which was causing UI conflicts.

## Fixes Applied

### Fix 1: Prioritize Staff Role Redirects
**File**: `src/contexts/AuthContext.tsx`

Changed the redirect logic to prioritize staff roles:

```typescript
// NEW CODE (FIXED)
// Check if user is staff FIRST - this takes priority over custom redirects
if (staffRoles.includes(result.user.role)) {
  console.log(`✅ User is staff (${result.user.role}), redirecting to dashboard`);
  redirectPath = '/admin/dashboard';
  // Clear any custom redirect as it's not applicable for staff
  if (window.__postLoginRedirect) {
    console.log(`⚠️ Clearing custom redirect for staff user`);
    delete window.__postLoginRedirect;
  }
} else {
  // For non-staff users, check if there's a custom redirect URL
  const customRedirect = window.__postLoginRedirect;
  if (customRedirect) {
    console.log(`🎯 Using custom redirect for non-staff: ${customRedirect}`);
    redirectPath = customRedirect;
    delete window.__postLoginRedirect;
  } else {
    console.log(`ℹ️ User is not staff (${result.user.role}), redirecting to home`);
    redirectPath = '/';
  }
}
```

**Result**: Admin users ALWAYS redirect to `/admin/dashboard`, regardless of any custom redirect.

### Fix 2: Load User Data Before Redirecting
**File**: `src/contexts/AuthContext.tsx`

Changed to await user data loading before redirecting:

```typescript
// NEW CODE (FIXED)
console.log(`🚀 Redirecting ${result.user.role} to ${redirectPath}`);

// Load user data FIRST before redirecting to ensure admin layout has access to user
try {
  await loadUserDataFromSession();
  console.log('✅ User data loaded successfully');
} catch (err) {
  console.error('❌ Error loading user data:', err);
  // Continue with redirect anyway - middleware will catch unauthorized access
}

// Use router.push instead of window.location for smoother navigation
router.push(redirectPath);
```

**Result**: User data is loaded before redirecting, ensuring the admin layout has access to the authenticated user.

### Fix 3: Remove Public Layout Components from Root
**File**: `src/app/layout.tsx`

Removed Navbar and Footer from the root layout to prevent them from wrapping admin pages:

```typescript
// NEW CODE (CLEAN)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <AuthProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

**Result**: Admin pages no longer have the public Navbar/Footer, and public pages can add their own layout components as needed.

## Testing
After these changes:
1. Login as admin → Should redirect to `/admin/dashboard` immediately
2. Login as admin with `?redirect=somewhere` → Still redirects to `/admin/dashboard` (ignoring custom redirect)
3. Login as regular user → Redirects to home or custom redirect
4. Access admin dashboard while logged in → Shows admin dashboard with Sidebar and Topbar
5. Access admin dashboard while not logged in → Redirects to login, then back to dashboard

## Files Modified
1. `src/contexts/AuthContext.tsx` - Fixed redirect priority and loading order
2. `src/app/layout.tsx` - Removed public layout components

## No Changes Needed To
- `src/app/(admin)/layout.tsx` - Already properly checks user role and status
- `src/app/(admin)/admin/dashboard/page.tsx` - Already exists and renders correctly
- `src/middleware.ts` - Already properly protects /admin routes
- Login API routes - Already working correctly

