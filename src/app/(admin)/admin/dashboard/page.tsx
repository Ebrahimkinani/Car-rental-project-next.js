"use client";

import { StatsGrid } from "@/components/ui/stats-card";
import { EarningsChart } from "../../_components/charts/EarningsChart";
import { useState, useMemo } from "react";
import { BookingsChart } from "../../_components/charts/BookingsChart";
import { RentStatusChart } from "../../_components/charts/RentStatusChart";
import { CarTypesList } from "../../_components/lists/CarTypesList";
import { RemindersList } from "../../_components/lists/RemindersList";
import { CarAvailabilityForm } from "../../_components/forms/CarAvailabilityForm";
import { DollarSign, Car, CalendarCheck, Users } from "lucide-react";
import { getStoreDashboardStats } from "@/lib/mock-store";

export default function DashboardPage() {
  const [earningsView, setEarningsView] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const analytics = useMemo(() => getStoreDashboardStats(), []);

  const earningsData = useMemo(() => {
    if (earningsView === "weekly") {
      return (analytics.earningsWeekly || []).map((d, i) => ({
        label: d.week || `W${i + 1}`,
        value: d.revenue,
      }));
    }
    if (earningsView === "monthly") {
      return (analytics.earningsMonthly || []).map((d) => ({
        label: d.month,
        value: d.revenue,
      }));
    }
    return (analytics.earningsYearly || []).map((d) => ({
      label: d.year,
      value: d.revenue,
    }));
  }, [analytics, earningsView]);

  const kpiItems = [
    {
      label: "Total Revenue",
      value: `$${analytics.kpis.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trendData:
        analytics.earningsWeekly.length > 0
          ? analytics.earningsWeekly.slice(-7).map((item) => item.revenue)
          : [0, 0, 0, 0, 0, 0, 0],
    },
    {
      label: "Active Rentals",
      value: analytics.kpis.activeRentals.toString(),
      icon: Car,
      trendData:
        analytics.bookingsMonthly.length > 0
          ? analytics.bookingsMonthly.slice(-6).map((item) => item.count)
          : [0, 0, 0, 0, 0, 0],
    },
    {
      label: "New Bookings",
      value: analytics.kpis.newBookings.toString(),
      icon: CalendarCheck,
      trendData:
        analytics.bookingsMonthly.length > 0
          ? analytics.bookingsMonthly.slice(-6).map((item) => item.count)
          : [0, 0, 0, 0, 0, 0],
    },
    {
      label: "Available Cars",
      value: analytics.kpis.availableCars.toString(),
      icon: Users,
      trendData:
        analytics.carTypes.length > 0
          ? analytics.carTypes.slice(-6).map((item) => item.count)
          : [0, 0, 0, 0, 0, 0],
    },
  ];

  const rentStatusData = [
    { name: "Active", value: analytics.rentStatus.active },
    { name: "Pending", value: analytics.rentStatus.pending },
    { name: "Completed", value: analytics.rentStatus.completed },
    { name: "Cancelled", value: analytics.rentStatus.cancelled },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6">
      <StatsGrid items={kpiItems} />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="col-span-2 rounded-xl border bg-secondary-gradient p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium text-zinc-600">Earnings ({earningsView})</div>
            <div className="flex gap-1">
              {(["weekly", "monthly", "yearly"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setEarningsView(v)}
                  className={`rounded border px-2 py-1 text-xs ${
                    earningsView === v ? "bg-zinc-900 text-white" : "bg-white text-zinc-700"
                  }`}
                >
                  {v[0].toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <EarningsChart data={earningsData} />
        </div>
        <div className="rounded-xl border bg-secondary-gradient p-4">
          <div className="mb-2 text-sm font-medium text-zinc-600">Rent Status</div>
          <RentStatusChart data={rentStatusData} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="col-span-2 rounded-xl border bg-secondary-gradient p-4">
          <div className="mb-2 text-sm font-medium text-zinc-600">Bookings Overview</div>
          <BookingsChart data={analytics.bookingsMonthly || []} />
        </div>
        <div className="rounded-xl border bg-secondary-gradient p-4">
          <div className="mb-3 text-sm font-medium text-zinc-600">Quick Availability</div>
          <CarAvailabilityForm />
          <div className="mt-6">
            <div className="mb-2 text-sm font-medium text-zinc-600">Car Types</div>
            <CarTypesList
              data={analytics.carTypes.map((item) => ({
                name: item.name,
                count: item.count,
                pct: item.percentage,
              }))}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="mb-2 text-sm font-medium text-zinc-600">Reminders</div>
        <RemindersList />
      </div>
    </div>
  );
}
