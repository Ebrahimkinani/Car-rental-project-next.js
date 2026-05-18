"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./_components/layout/Sidebar";
import Topbar from "./_components/layout/Topbar";
import { NotificationProvider } from "@/contexts/NotificationProvider";
import { IS_PREVIEW_MODE } from "@/lib/preview-mode";

const staffRoles = ["admin", "manager", "employee"];

function AdminShell({ children }: { children: React.ReactNode }) {
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

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (IS_PREVIEW_MODE || loading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const normalizedRole = user.role?.toLowerCase() || "";
    const normalizedStatus = user.status?.toLowerCase() || "";

    if (normalizedStatus !== "active") {
      router.push("/auth/login?error=suspended");
      return;
    }

    if (!staffRoles.includes(normalizedRole)) {
      router.push("/no-access");
    }
  }, [user, loading, router]);

  if (IS_PREVIEW_MODE) {
    return <AdminShell>{children}</AdminShell>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const normalizedRole = user.role?.toLowerCase() || "";
  const normalizedStatus = user.status?.toLowerCase() || "";

  if (!staffRoles.includes(normalizedRole) || normalizedStatus !== "active") {
    return null;
  }

  return <AdminShell>{children}</AdminShell>;
}
