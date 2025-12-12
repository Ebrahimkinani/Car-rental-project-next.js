"use client";

const items = [
  { title: "Renew insurance for fleet A", due: "Oct 24" },
  { title: "Invoice client: Al Ramlah Resort", due: "Oct 25" },
  { title: "Service schedule for SUVs", due: "Oct 27" },
];

export function RemindersList() {
  return (
    <ul className="divide-y">
      {items.map((it) => (
        <li key={it.title} className="flex items-center justify-between py-3">
          <span className="text-sm text-zinc-700">{it.title}</span>
          <span className="text-xs text-zinc-500">{it.due}</span>
        </li>
      ))}
    </ul>
  );
}