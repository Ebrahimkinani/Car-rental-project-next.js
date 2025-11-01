"use client";

import useSWR from "swr";
import { StatsGrid } from "@/components/ui/stats-card";
import { EarningsChart } from "../../_components/charts/EarningsChart";
import { useState, useMemo } from "react";
import { BookingsChart } from "../../_components/charts/BookingsChart";
import { RentStatusChart } from "../../_components/charts/RentStatusChart";
import { CarTypesList } from "../../_components/lists/CarTypesList";
import { RemindersList } from "../../_components/lists/RemindersList";
import { CarAvailabilityForm } from "../../_components/forms/CarAvailabilityForm";
import { DollarSign, Car, CalendarCheck, Users } from "lucide-react";

// Types for analytics data
interface AnalyticsData {
  kpis: {
    totalRevenue: number;
    totalRevenueAllTime: number;
    activeRentals: number;
    newBookings: number;
    availableCars: number;
  };
  earningsWeekly: { week: string; revenue: number }[];
  earningsMonthly?: { month: string; revenue: number }[];
  earningsYearly?: { year: string; revenue: number }[];
  rentStatus: {
    active: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  bookingsMonthly: { month: string; count: number }[];
  carTypes: { name: string; count: number; percentage: number }[];
}

// Fetcher function for SWR with credentials
const fetcher = (url: string) => 
  fetch(url, { credentials: 'include' }).then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  });

export default function DashboardPage() {
  const [earningsView, setEarningsView] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  // Fetch analytics data using SWR
  const { data, error, isLoading } = useSWR<{ success: boolean; data: AnalyticsData }>(
    '/api/admin/analytics',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  // Always compute memoized datasets before any conditional returns to keep hook order stable
  const analytics = data?.data;
  const earningsData = useMemo(() => {
    const a = analytics;
    if (!a) return [] as { label: string; value: number }[];
    if (earningsView === 'weekly') {
      return (a.earningsWeekly || []).map((d, i) => ({ label: d.week || `W${i+1}`, value: d.revenue }));
    } else if (earningsView === 'monthly') {
      return (a.earningsMonthly || []).map(d => ({ label: d.month, value: d.revenue }));
    } else {
      return (a.earningsYearly || []).map(d => ({ label: d.year, value: d.revenue }));
    }
  }, [analytics, earningsView]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">Failed to load dashboard data</div>
          <button 
            onClick={() => window.location.reload()} 
            className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-gray-500">No data available</div>
        </div>
      </div>
    );
  }

  // Prepare KPI items with icons and trend data
  const kpiItems = [
    { 
      label: "Total Revenue", 
      value: `$${analytics.kpis.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trendData: analytics.earningsWeekly.length > 0 
        ? analytics.earningsWeekly.slice(-7).map(item => item.revenue)
        : [0, 0, 0, 0, 0, 0, 0]
    },
    { 
      label: "Active Rentals", 
      value: analytics.kpis.activeRentals.toString(),
      icon: Car,
      trendData: analytics.bookingsMonthly.length > 0
        ? analytics.bookingsMonthly.slice(-6).map(item => item.count)
        : [0, 0, 0, 0, 0, 0]
    },
    { 
      label: "New Bookings", 
      value: analytics.kpis.newBookings.toString(),
      icon: CalendarCheck,
      trendData: analytics.bookingsMonthly.length > 0
        ? analytics.bookingsMonthly.slice(-6).map(item => item.count)
        : [0, 0, 0, 0, 0, 0]
    },
    { 
      label: "Available Cars", 
      value: analytics.kpis.availableCars.toString(),
      icon: Users,
      trendData: analytics.carTypes.length > 0
        ? analytics.carTypes.slice(-6).map(item => item.count)
        : [0, 0, 0, 0, 0, 0]
    },
  ];

  // Prepare rent status data for pie chart
  const rentStatusData = [
    { name: "Active", value: analytics.rentStatus.active },
    { name: "Pending", value: analytics.rentStatus.pending },
    { name: "Completed", value: analytics.rentStatus.completed },
    { name: "Cancelled", value: analytics.rentStatus.cancelled },
  ].filter(item => item.value > 0); // Only show statuses with data

  

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <StatsGrid items={kpiItems} />

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="col-span-2 rounded-xl border bg-secondary-gradient p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium text-zinc-600">Earnings ({earningsView})</div>
            <div className="flex gap-1">
              {(['weekly','monthly','yearly'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setEarningsView(v)}
                  className={`px-2 py-1 text-xs rounded border ${earningsView===v? 'bg-zinc-900 text-white' : 'bg-white text-zinc-700'}`}
                >{v[0].toUpperCase()+v.slice(1)}</button>
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
            <CarTypesList data={analytics.carTypes?.map(item => ({ 
              name: item.name, 
              count: item.count, 
              pct: item.percentage 
            })) || []} />
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