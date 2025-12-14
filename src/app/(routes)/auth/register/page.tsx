/**
 * Register Page
 * User registration form
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input"; 
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { validateRegisterForm } from "@/lib/validations";
import { useAuth } from "@/contexts/AuthContext";
import type { RegisterFormData } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error } = useAuth();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await register(formData.email, formData.password, formData.username);
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Get started with your free account
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            <Input
              type="text"
              label="Username"
              placeholder="johndoe"
              value={formData.username}
              onChange={(value: string) => setFormData({ ...formData, username: value })}
              error={errors.username}
              helperText="3-20 alphanumeric characters"
              required
            />

            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(value: string) => setFormData({ ...formData, email: value })}
              error={errors.email}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(value: string) => setFormData({ ...formData, password: value })}
              error={errors.password}
              helperText="Min. 8 characters with uppercase, lowercase, and number"
              required
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(value: string) => setFormData({ ...formData, confirmPassword: value })}
              error={errors.confirmPassword}
              required
            />

            <Button type="submit" className="w-full border border-gray-300 dark:border-gray-700" loading={loading}>
              Create Account
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
              <Link
                href="/auth/login"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Sign in
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

