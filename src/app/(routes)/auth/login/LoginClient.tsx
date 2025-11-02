"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { validateLoginForm } from "@/lib/validations";
import { useAuth } from "@/contexts/AuthContext";
import type { LoginFormData } from "@/types";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const message = searchParams.get('message');
  const errorParam = searchParams.get('error');
  const { login, loginWithGoogle, loading, error } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use URL error param or auth error
  const displayError = errorParam || error;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      // Store redirect URL before login
      if (redirectTo && redirectTo !== '/auth/login') {
        window.__postLoginRedirect = redirectTo;
        console.log(`🔗 Storing redirect URL: ${redirectTo}`);
      }
      
      await login(formData.email, formData.password);
      
      // After successful login, AuthContext will load user data
      // The redirect will happen in the handlePostLoginRedirect function
      // which is called when user data is loaded
    } catch (error) {
      console.error('Login error:', error);
      // Error is handled by AuthContext
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('Starting Google login...');
      await loginWithGoogle();
      console.log('Google login successful, redirecting...');
      // Google login always defaults to user role, redirect to home
      router.push('/');
    } catch (error: any) {
      console.error('Google login error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                <p className="text-sm text-green-800 dark:text-green-200">{message}</p>
              </div>
            )}

            {displayError && (
              <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-200">{displayError}</p>
              </div>
            )}

            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              error={errors.email}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(value) => setFormData({ ...formData, password: value })}
              error={errors.password}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </span>
              </label>

              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              loading={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Don&apos;t have an account? </span>
              <Link
                href="/auth/register"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Sign up
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

