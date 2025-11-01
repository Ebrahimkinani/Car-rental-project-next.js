"use client";

import type { CarStatus } from "../types/car.js";

type Props = {
  query: string; 
  onQuery: (v: string) => void;
  brand: string; 
  onBrand: (v: string) => void;
  status: string; 
  onStatus: (v: string) => void;
  branch: string; 
  onBranch: (v: string) => void;
};
const STATUSES: (CarStatus | "All")[] = ["All", "available", "rented", "maintenance", "reserved"];
const BRANCHES = ["All", "Doha", "Al Wakrah", "Al Khor"];

export default function CarFilters({
  query,
  onQuery,
  brand,
  onBrand,
  status,
  onStatus,
  branch,
  onBranch
}: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <input
        className="w-full rounded border p-2 text-sm focus:border-primary-500"
        placeholder="Search (plate, model, VIN)…"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
      />
      <input
        className="w-full rounded border p-2 text-sm focus:border-primary-500"
        placeholder="Brand filter…"
        value={brand}
        onChange={(e) => onBrand(e.target.value)}
      />
      <select 
        className="w-full rounded border p-2 text-sm" 
        value={status} 
        onChange={(e) => onStatus(e.target.value)}
      >
        {STATUSES.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select 
        className="w-full rounded border p-2 text-sm" 
        value={branch} 
        onChange={(e) => onBranch(e.target.value)}
      >
        {BRANCHES.map(b => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>
    </div>
  );
}