"use client";

export function StatusPill({ status }: { status: "active" | "pending" | "cancelled" | "confirmed" | "upcoming" | "completed" }) {
  const map: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    confirmed: "bg-primary-50 text-primary-700 border-primary-200",
    upcoming: "bg-indigo-50 text-indigo-700 border-indigo-200",
    completed: "bg-gray-50 text-gray-700 border-gray-200",
  };
  const label = status[0].toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${map[status]}`}>
      {label}
    </span>
  );
}