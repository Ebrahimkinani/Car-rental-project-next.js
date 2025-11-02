"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User, AuthContextType, AuthState } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Global redirect URL - stored in window to persist across state updates
declare global {
  interface Window {
    __postLoginRedirect?: string;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Load user data from MongoDB session
  const loadUserDataFromSession = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/me', {
        credentials: 'include',
      });

      // /api/me ALWAYS returns 200, never throws
      const result = await response.json();
      
      // Check if user exists
      if (!result.user) {
        setState(prev => ({
          ...prev,
          user: null,
          loading: false,
          error: null,
        }));
        return;
      }
      
      // Check if user is suspended
      if (result.user.status !== 'active') {
        // Clear user data if account is not active
        setState(prev => ({
          ...prev,
          user: null,
          loading: false,
          error: 'Your account is not active. Contact admin.',
        }));
        return;
      }
      
      // Store user data
      const userData = {
        id: result.user.id,
        email: result.user.email,
        fullName: `${result.user.firstName || ''} ${result.user.lastName || ''}`.trim(),
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        avatar: result.user.avatar,
        username: result.user.email.split('@')[0], // Use email prefix as username
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
      
    } catch (error) {
      console.error('[AuthContext] Error loading user data from session:', error);
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        error: null,
      }));
    }
  };

  // Load user data from session on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    // Load user data from existing session
    loadUserDataFromSession();
  }, []);

  // Authentication methods
  const login = async (email: string, password: string, _role?: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Call MongoDB-based login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      // Redirect IMMEDIATELY based on login response - don't wait for state update
      // Use result.user from login API for immediate redirect
      if (result.user) {
        const staffRoles = ['admin', 'manager', 'employee'];
        let redirectPath = '/';
        
        // Check if user is staff FIRST - this takes priority over custom redirects
        if (staffRoles.includes(result.user.role)) {
          redirectPath = '/admin/dashboard';
          // Clear any custom redirect as it's not applicable for staff
          if (window.__postLoginRedirect) {
            delete window.__postLoginRedirect;
          }
        } else {
          // For non-staff users, check if there's a custom redirect URL
          const customRedirect = window.__postLoginRedirect;
          if (customRedirect) {
            redirectPath = customRedirect;
            // Clear the redirect after using it
            delete window.__postLoginRedirect;
          } else {
            redirectPath = '/';
          }
        }
        
        // Load user data FIRST before redirecting to ensure admin layout has access to user
        try {
          await loadUserDataFromSession();
        } catch (err) {
          console.error('[AuthContext] Error loading user data:', err);
          // Continue with redirect anyway - middleware will catch unauthorized access
        }
        
        // Use router.push instead of window.location for smoother navigation
        router.push(redirectPath);
        return; // Exit early to prevent any further execution
      } else {
        // Load user data from session as fallback
        await loadUserDataFromSession();
      }
      
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const register = async (email: string, password: string, _username: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Call MongoDB-based register API
      // This now automatically creates a session and returns user data
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, role: 'customer' }), // Default to customer
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      
      // If user data is returned, use it directly
      if (result.user) {
        const userData = {
          id: result.user.id,
          email: result.user.email,
          fullName: `${result.user.firstName || ''} ${result.user.lastName || ''}`.trim(),
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          avatar: result.user.avatar,
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
      } else {
        // Fallback: load user data from session
        await loadUserDataFromSession();
      }
      
    } catch (error) {
      console.error('[AuthContext] Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    throw new Error('Google sign-in is not yet implemented in MongoDB auth. Please use email/password.');
  };

  const logout = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Call logout API to clear session
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Clear local state
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        error: null,
      }));
      
      // Redirect to login
      router.push('/auth/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Call password reset API
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Password reset failed');
      }

      setState(prev => ({ ...prev, loading: false, error: null }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      setState(prev => ({
        ...prev,
        user: result.data,
        loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
