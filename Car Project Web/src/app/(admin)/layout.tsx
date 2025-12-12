"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./_components/layout/Sidebar";
import Topbar from "./_components/layout/Topbar";
import { NotificationProvider } from "@/contexts/NotificationProvider";

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Define allowed roles for admin access
  const staffRoles = ['admin', 'manager', 'employee'];

  useEffect(() => {
    // Wait for loading to complete
    if (loading) return;
    
    // Check if user exists
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    // Normalize role and status for consistent comparisons
    const normalizedRole = user.role?.toLowerCase() || '';
    const normalizedStatus = user.status?.toLowerCase() || '';
    
    // Check if user account is active (case-insensitive)
    if (normalizedStatus !== 'active') {
      router.push('/auth/login?error=suspended');
      return;
    }
    
    // Check if user has staff role (case-insensitive)
    if (!staffRoles.includes(normalizedRole)) {
      router.push('/no-access');
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Deny access if not staff or not active (with normalized checks)
  if (!user) {
    return null;
  }
  
  const normalizedRole = user.role?.toLowerCase() || '';
  const normalizedStatus = user.status?.toLowerCase() || '';
  
  if (!staffRoles.includes(normalizedRole) || normalizedStatus !== 'active') {
    return null;
  }

  return (
    <NotificationProvider>
      <div className="flex min-h-screen bg-zinc-50">
        <Sidebar />
        <div className="flex w-full flex-col bg-secondary-gradient">
          <Topbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </NotificationProvider>
  );
}
