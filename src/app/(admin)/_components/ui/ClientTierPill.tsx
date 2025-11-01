"use client";
import type { ClientTier } from "../types/client";

interface ClientTierPillProps {
  tier: ClientTier;
}

const TIER_STYLES: Record<ClientTier, string> = {
  Regular: "bg-zinc-50 text-zinc-600 border-zinc-200",
  Silver: "bg-slate-50 text-slate-700 border-slate-200",
  Gold: "bg-amber-50 text-amber-700 border-amber-200",
  Platinum: "bg-indigo-50 text-indigo-700 border-indigo-200",
} as const;

export function ClientTierPill({ tier }: ClientTierPillProps) {
  return (
    <span 
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${TIER_STYLES[tier]}`}
    >
      {tier}
    </span>
  );
}