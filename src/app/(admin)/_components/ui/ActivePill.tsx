"use client";
import type { Category } from "@/types";

type CategoryStatus = Category["status"];

export default function ActivePill({ status }: { status: CategoryStatus }) {
  const map: Record<CategoryStatus, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Hidden: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${map[status]}`}>
      {status}
    </span>
  );
}