"use client";

const STATUSES = ["All", "Active", "Inactive", "Suspended"] as const;
const TIERS = ["All", "Regular", "Silver", "Gold", "Platinum"] as const;
const BRANCHES = ["All", "Doha", "Al Wakrah", "Al Khor"] as const;

interface ClientsFiltersProps {
  query: string;
  onQuery: (value: string) => void;
  status: string;
  onStatus: (value: string) => void;
  tier: string;
  onTier: (value: string) => void;
  branch: string;
  onBranch: (value: string) => void;
  dateFrom: string;
  onDateFrom: (value: string) => void;
  dateTo: string;
  onDateTo: (value: string) => void;
}

export default function ClientsFilters({
  query,
  onQuery,
  status,
  onStatus,
  tier,
  onTier,
  branch,
  onBranch,
  dateFrom,
  onDateFrom,
  dateTo,
  onDateTo,
}: ClientsFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <input
        className="rounded border p-2 text-sm"
        placeholder="Search (name, email, phone)…"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
      />
      <select 
        className="rounded border p-2 text-sm" 
        value={status} 
        onChange={(e) => onStatus(e.target.value)}
      >
        {STATUSES.map(status => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <select 
        className="rounded border p-2 text-sm" 
        value={tier} 
        onChange={(e) => onTier(e.target.value)}
      >
        {TIERS.map(tier => (
          <option key={tier} value={tier}>
            {tier}
          </option>
        ))}
      </select>
      <select 
        className="rounded border p-2 text-sm" 
        value={branch} 
        onChange={(e) => onBranch(e.target.value)}
      >
        {BRANCHES.map(branch => (
          <option key={branch} value={branch}>
            {branch}
          </option>
        ))}
      </select>
      <input 
        className="rounded border p-2 text-sm" 
        type="date" 
        value={dateFrom} 
        onChange={(e) => onDateFrom(e.target.value)} 
      />
      <input 
        className="rounded border p-2 text-sm" 
        type="date" 
        value={dateTo} 
        onChange={(e) => onDateTo(e.target.value)} 
      />
    </div>
  );
}