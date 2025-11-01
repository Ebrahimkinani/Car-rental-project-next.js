"use client";
import type { ClientStatus } from "../types/client";

interface ClientStatusPillProps {
  status: ClientStatus;
}

const STATUS_STYLES: Record<ClientStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Inactive: "bg-zinc-100 text-zinc-600 border-zinc-200",
  Suspended: "bg-rose-50 text-rose-700 border-rose-200",
} as const;

export function ClientStatusPill({ status }: ClientStatusPillProps) {
  return (
    <span 
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}