"use client";

const STATUSES = ["All","Active","Hidden"];

type Props = {
  query: string; onQuery: (v: string)=>void;
  status: string; onStatus: (v: string)=>void;
};

export default function CategoryFilters(p: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <input
        className="w-full rounded border p-2 text-sm"
        placeholder="Search (name, code)…"
        value={p.query}
        onChange={(e)=>p.onQuery(e.target.value)}
      />
      <select
        className="w-full rounded border p-2 text-sm"
        value={p.status}
        onChange={(e)=>p.onStatus(e.target.value)}
      >
        {STATUSES.map(s=><option key={s}>{s}</option>)}
      </select>
    </div>
  );
}