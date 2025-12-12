"use client";
import { useMemo, useState } from "react";
import { StatusPill } from "../ui/StatusPill";

export type Booking = {
  id: string;
  number: string;
  client: string;
  car: string;
  plate: string;
  type: "SUV" | "Sedan" | "Hatchback" | "Luxury";
  pickup: string; // ISO date
  dropoff: string; // ISO date
  status: "active" | "pending" | "cancelled";
  total: number;
};

const MOCK: Booking[] = [
  { id: "1", number: "BKG-24001", client: "Omar Khalid", car: "Toyota Prado", plate: "QTR 12345", type: "SUV", pickup: "2025-10-20", dropoff: "2025-10-24", status: "active", total: 980 },
  { id: "2", number: "BKG-24002", client: "Sara Ahmed", car: "Honda Civic", plate: "QTR 77721", type: "Sedan", pickup: "2025-10-22", dropoff: "2025-10-25", status: "pending", total: 420 },
  { id: "3", number: "BKG-24003", client: "Ali Hassan", car: "Kia Rio", plate: "QTR 55220", type: "Hatchback", pickup: "2025-10-18", dropoff: "2025-10-23", status: "cancelled", total: 0 },
  { id: "4", number: "BKG-24004", client: "Noor Al Thani", car: "BMW 7 Series", plate: "QTR 99110", type: "Luxury", pickup: "2025-10-21", dropoff: "2025-10-26", status: "active", total: 2200 },
  { id: "5", number: "BKG-24005", client: "Mohamed Adel", car: "Hyundai Tucson", plate: "QTR 33211", type: "SUV", pickup: "2025-10-19", dropoff: "2025-10-22", status: "pending", total: 560 },
  { id: "6", number: "BKG-24006", client: "Maya F.", car: "Mercedes C200", plate: "QTR 66190", type: "Sedan", pickup: "2025-10-22", dropoff: "2025-10-28", status: "active", total: 1450 },
];

type Props = {
  scope: "all" | "active" | "pending" | "cancelled";
  query: string;
  carType: string; // "All" | ...
  dateFrom?: string;
  dateTo?: string;
};

function within(date: string, from?: string, to?: string) {
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

export default function BookingsTable({ scope, query, carType, dateFrom, dateTo }: Props) {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK.filter(b => {
      if (scope !== "all" && b.status !== scope) return false;
      if (carType !== "All" && b.type !== carType) return false;
      if (!within(b.pickup, dateFrom, dateTo) && !within(b.dropoff, dateFrom, dateTo)) return false;
      if (q) {
        const hay = `${b.number} ${b.client} ${b.car} ${b.plate}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [scope, query, carType, dateFrom, dateTo]);

  const pages = Math.max(1, Math.ceil(data.length / pageSize));
  const start = (page - 1) * pageSize;
  const rows = data.slice(start, start + pageSize);

  return (
    <div className="overflow-hidden rounded-xl border bg-secondary-gradient">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-50 text-zinc-600">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Booking #</th>
            <th className="px-4 py-2 text-left font-medium">Client</th>
            <th className="px-4 py-2 text-left font-medium">Car</th>
            <th className="px-4 py-2 text-left font-medium">Type</th>
            <th className="px-4 py-2 text-left font-medium">Pickup</th>
            <th className="px-4 py-2 text-left font-medium">Dropoff</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
            <th className="px-4 py-2 text-right font-medium">Total</th>
            <th className="px-4 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((b) => (
            <tr key={b.id} className="hover:bg-zinc-50">
              <td className="px-4 py-2">{b.number}</td>
              <td className="px-4 py-2">{b.client}</td>
              <td className="px-4 py-2">
                <div className="flex flex-col">
                  <span>{b.car}</span>
                  <span className="text-xs text-zinc-500">{b.plate}</span>
                </div>
              </td>
              <td className="px-4 py-2">{b.type}</td>
              <td className="px-4 py-2">{b.pickup}</td>
              <td className="px-4 py-2">{b.dropoff}</td>
              <td className="px-4 py-2">
                <StatusPill status={b.status} />
              </td>
              <td className="px-4 py-2 text-right">${b.total.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">
                <div className="inline-flex gap-2">
                  <button className="rounded border px-2 py-1 text-xs">View</button>
                  <button className="rounded border px-2 py-1 text-xs">Edit</button>
                  <button className="rounded border px-2 py-1 text-xs">Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-zinc-500">
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div className="flex items-center justify-between border-t px-4 py-2 text-sm">
        <span className="text-zinc-500">
          Showing {(start + 1)}–{Math.min(start + pageSize, data.length)} of {data.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            className="rounded border px-2 py-1 disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >Prev</button>
          <span className="text-zinc-700">{page}/{pages}</span>
          <button
            className="rounded border px-2 py-1 disabled:opacity-50"
            disabled={page === pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >Next</button>
        </div>
      </div>
    </div>
  );
}