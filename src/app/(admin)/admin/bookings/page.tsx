"use client";

import { useMemo, useState } from "react";
import BookingFilters from "../../_components/filters/BookingFilters";
import AdminBookingTable from "../../_components/tables/AdminBookingTable";
import { useCSVExport } from "@/hooks/useCSVExport";

type Tab = { key: "all" | "active" | "pending" | "cancelled"; label: string };

export default function BookingsPage() {
  const tabs: Tab[] = useMemo(() => ([
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "pending", label: "Pending" },
    { key: "cancelled", label: "Cancelled" },
  ]), []);

  const [active, setActive] = useState<Tab["key"]>("all");
  const [query, setQuery] = useState("");
  const [carType, setCarType] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { exportBookings, exporting } = useCSVExport();

  const handleExportCSV = () => {
    exportBookings({
      status: active,
      search: query,
      carType: carType,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-lg font-semibold">Bookings</h1>
        <div className="flex gap-2">
          <button className="rounded bg-zinc-900 px-3 py-2 text-sm text-white">
            New Booking
          </button>
          <button 
            className="rounded border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
            onClick={handleExportCSV}
            disabled={exporting}
          >
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              active === t.key ? "bg-zinc-900 text-white" : "bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-xl border bg-secondary-gradient p-4">
        <BookingFilters
          query={query} onQuery={setQuery}
          carType={carType} onCarType={setCarType}
          dateFrom={dateFrom} onDateFrom={setDateFrom}
          dateTo={dateTo} onDateTo={setDateTo}
        />
      </div>

      {/* Table */}
      <AdminBookingTable
        scope={active}
        query={query}
        carType={carType}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />
    </div>
  );
}