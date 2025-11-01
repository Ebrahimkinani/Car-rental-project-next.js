"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function NoAccessPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Redirect if user is actually staff
  useEffect(() => {
    if (user && ['admin', 'manager', 'employee'].includes(user.role)) {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              className="h-10 w-10 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Access Denied
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You don&apos;t have permission to access this page.
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900">
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            This page is restricted to employees, managers, and administrators. If you believe this is an error, please contact your system administrator.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
            >
              Go to Home
            </Link>
            <Link
              href="/auth/login"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Try Different Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
