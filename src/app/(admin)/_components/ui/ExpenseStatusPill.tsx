"use client";
import type { ExpenseStatus } from "../types/ExpenseTypes.jsx";

export function ExpenseStatusPill({ status }: { status: ExpenseStatus }) {
  const map: Record<ExpenseStatus, string> = {
    Posted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Refunded: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${map[status]}`}>
      {status}
    </span>
  );
}