"use client";

interface CarTypesListProps {
  data?: {
    name: string;
    count: number;
    pct: number;
  }[];
}

export function CarTypesList({ data }: CarTypesListProps) {
  const defaultItems = [
    { name: "SUV", count: 0, pct: 0 },
    { name: "Sedan", count: 0, pct: 0 },
    { name: "Hatchback", count: 0, pct: 0 },
    { name: "Luxury", count: 0, pct: 0 },
  ];

  const items = data || defaultItems;

  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it.name}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-700">{it.name}</span>
            <span className="text-zinc-500">{it.count}</span>
          </div>
          <div className="mt-1 h-2 w-full rounded bg-zinc-100">
            <div className="h-2 rounded bg-zinc-900" style={{ width: `${it.pct}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}