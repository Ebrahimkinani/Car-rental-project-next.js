"use client";

import { useState, useEffect } from "react";
import useSWR from 'swr';
import type { Client } from "../../_components/types/client";
import ClientFilters from "../../_components/filters/ClientsFilters";
import { StatsGrid } from "@/components/ui/stats-card";
import ExpensesTrend from "../../_components/charts/ExpensesTrends";
import { Users, UserCheck, UserPlus, UserX } from "lucide-react";
import ClientsTable from "../../_components/tables/ClientsTables";

// Types for API responses
interface ClientsResponse {
  data: Client[];
  total: number;
  page: number;
  pageCount: number;
}

interface KPIsResponse {
  total: number;
  active: number;
  newThisMonth: number;
  suspended: number;
}

interface TrendResponsePoint { date: string; total: number }

// Fetcher function for SWR with credentials
const fetcher = (url: string) => 
  fetch(url, { credentials: 'include' }).then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  });

export default function ClientsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [tier, setTier] = useState("All");
  const [branch, setBranch] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Build API URL with filters
  const buildApiUrl = (pageNum: number = page) => {
    const params = new URLSearchParams({
      page: pageNum.toString(),
      limit: "10",
      sortBy,
      sortOrder,
      ...(query && { search: query }),
      ...(status !== "All" && { status }),
      ...(tier !== "All" && { tier }),
      ...(branch !== "All" && { branch }),
      ...(dateFrom && { from: dateFrom }),
      ...(dateTo && { to: dateTo })
    });
    return `/api/admin/clients?${params}`;
  };

  // Fetch clients data
  const { data: clientsData, error: clientsError, isLoading: clientsLoading } = useSWR<ClientsResponse>(
    buildApiUrl(),
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  // Fetch KPIs data
  const { data: kpisData, error: kpisError } = useSWR<KPIsResponse>(
    '/api/admin/clients/kpis',
    fetcher,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
    }
  );

  // Fetch trend data (daily new clients)
  const { data: trendData } = useSWR<{ points: TrendResponsePoint[] }>(
    '/api/admin/clients/trend?days=30',
    fetcher,
    { refreshInterval: 60000, revalidateOnFocus: true }
  );

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle sorting
  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [query, status, tier, branch, dateFrom, dateTo]);

  // Export CSV function
  function exportCsv(rows: Client[]) {
    // TODO: implement proper CSV export with API endpoint
    // Current implementation exports only visible rows, should export all filtered data
    // Need to create /api/admin/clients/export endpoint that respects current filters
    const headers = ["Name", "Email", "Phone", "Branch", "Tier", "Status", "Bookings", "TotalSpent"];
    const body = rows.map(c => [c.name, c.email, c.phone, c.branch, c.tier, c.status, c.bookings, c.totalSpent].join(","));
    const csv = [headers.join(","), ...body].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clients.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Handle loading state
  if (clientsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading clients data...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (clientsError || kpisError) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">Failed to load clients data</div>
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

  // Extract data
  const clients = clientsData?.data || [];
  const kpis = kpisData || { total: 0, active: 0, newThisMonth: 0, suspended: 0 };
  const trendPoints = trendData?.points || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-lg font-semibold">Clients</h1>
        <div className="flex gap-2">
          <button 
            className="rounded border px-3 py-2 text-sm" 
            onClick={() => exportCsv(clients)}
            disabled={clients.length === 0}
          >
            Export CSV
          </button>
          <button className="rounded bg-zinc-900 px-3 py-2 text-sm text-white">
            {/* TODO: implement Add Client functionality */}
            Add Client
          </button>
        </div>
      </div>

      {/* KPIs (with icons and small trend like expenses page) */}
      <StatsGrid 
        items={[
          { label: "Total Clients", value: kpis.total, icon: Users, trendData: trendPoints.slice(-7).map(p=>p.total) },
          { label: "Active Clients", value: kpis.active, icon: UserCheck, trendData: trendPoints.slice(-7).map(p=>p.total) },
          { label: "New This Month", value: kpis.newThisMonth, icon: UserPlus, trendData: trendPoints.slice(-7).map(p=>p.total) },
          { label: "Suspended", value: kpis.suspended, icon: UserX },
        ]}
      />

      {/* Trend Diagram */}
      <div className="rounded-xl border bg-secondary-gradient p-4">
        <div className="mb-2 text-sm font-medium text-zinc-600">Client Signups Trend</div>
        <ExpensesTrend points={trendPoints} />
      </div>

      {/* Filters */}
      <div className="rounded-xl border bg-secondary-gradient p-4">
        <ClientFilters
          query={query} onQuery={setQuery}
          status={status} onStatus={setStatus}
          tier={tier} onTier={setTier}
          branch={branch} onBranch={setBranch}
          dateFrom={dateFrom} onDateFrom={setDateFrom}
          dateTo={dateTo} onDateTo={setDateTo}
        />
      </div>

      {/* Table */}
      <ClientsTable 
        data={clients} 
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder as "asc" | "desc"}
        page={page}
        pageCount={clientsData?.pageCount || 1}
        total={clientsData?.total || 0}
        onPageChange={handlePageChange}
      />
    </div>
  );
}