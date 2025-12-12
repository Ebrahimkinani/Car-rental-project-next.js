"use client";

import { useState, useEffect, useCallback } from "react";
import type { Expense, ExpensesResponse, DailyPoint, ExpensesKPIs } from "../../../_components/types/ExpenseTypes";
import ExpenseFilters from "../../../_components/filters/ExpensesFilters";
import { StatsGrid } from "@/components/ui/stats-card";
import ExpensesTrend from "../../../_components/charts/ExpensesTrends";
import ExpensesTable from "../../../_components/tables/ExpensesTables";
import AddExpenseModal from "../../../_components/modals/AddExpenseModal";
import { DollarSign, Calendar, TrendingUp, Tag } from "lucide-react";

function toCurrency(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(n);
}

function formatNumber(n: number) {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function ExpensesPage() {
  // Filters
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [vendor, setVendor] = useState("All");
  const [method, setMethod] = useState("All");
  const [status, setStatus] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minAmt, setMinAmt] = useState("");
  const [maxAmt, setMaxAmt] = useState("");
  
  // Data and state
  const [data, setData] = useState<Expense[]>([]);
  const [kpis, setKpis] = useState<ExpensesKPIs>({
    totalAllTime: 0,
    totalThisMonth: 0,
    avgPerDay: 0,
    topCategory: null
  });
  const [trend, setTrend] = useState<DailyPoint[]>([]);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch data from API
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError("");
    
    try {
      const params = new URLSearchParams({
        status: status !== "All" ? status : "",
        category: category !== "All" ? category : "",
        method: method !== "All" ? method : "",
        vendor: vendor !== "All" ? vendor : "",
        search: query,
        from: dateFrom,
        to: dateTo,
        min: minAmt,
        max: maxAmt,
        page: page.toString(),
        limit: "10",
        sortBy: "date",
        sortDir: "desc"
      });

      const response = await fetch(`/api/admin/expenses?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }

      const result: ExpensesResponse = await response.json();
      setData(result.data);
      setKpis(result.kpis);
      setTrend(result.trend);
      setFilteredTotal(result.filteredTotal);
      setTotal(result.total);
      setPageCount(result.pageCount);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  }, [query, category, vendor, method, status, dateFrom, dateTo, minAmt, maxAmt, page]);

  // Fetch data when filters change
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Handle successful expense creation
  const handleExpenseAdded = (_newExpense: Expense) => {
    // Refresh the data
    fetchExpenses();
  };

  function exportCsv(rows: Expense[]) {
    const headers = ["Date","Category","Vendor","Description","Method","Status","Amount"];
    const body = rows.map(r=>[r.date,r.category,r.vendor,r.description,r.method,r.status,r.amount].join(","));
    const csv = [headers.join(","), ...body].join("\n");
    const blob = new Blob([csv], { type:"text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "expenses.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-lg font-semibold">Expenses</h1>
        <div className="flex gap-2">
          <button 
            className="rounded border px-3 py-2 text-sm" 
            onClick={()=>exportCsv(data)}
            disabled={loading}
          >
            Export CSV
          </button>
          <button 
            className="rounded bg-zinc-900 px-3 py-2 text-sm text-white"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Expense
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50/50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* KPIs */}
      <StatsGrid 
        items={[
          { 
            label: "Total Expenses (All-Time)", 
            value: formatNumber(kpis.totalAllTime),
            icon: DollarSign,
            trendData: trend.slice(-7).map(p => p.total)
          },
          { 
            label: "This Month", 
            value: formatNumber(kpis.totalThisMonth),
            icon: Calendar,
            trendData: trend.slice(-7).map(p => p.total)
          },
          { 
            label: "Avg / Day", 
            value: formatNumber(kpis.avgPerDay),
            icon: TrendingUp,
            trendData: trend.slice(-7).map(p => p.total)
          },
          { 
            label: "Top Category", 
            value: kpis.topCategory || "—",
            icon: Tag
          },
        ]}
      />

      {/* Filters */}
      <div className="rounded-xl border bg-secondary-gradient p-4">
        <ExpenseFilters
          category={category} onCategory={setCategory}
          vendor={vendor} onVendor={setVendor}
          method={method} onMethod={setMethod}
          status={status} onStatus={setStatus}
          dateFrom={dateFrom} onDateFrom={setDateFrom}
          dateTo={dateTo} onDateTo={setDateTo}
          minAmt={minAmt} onMinAmt={setMinAmt}
          maxAmt={maxAmt} onMaxAmt={setMaxAmt}
          query={query} onQuery={setQuery}
        />
      </div>

      {/* Trend */}
      <div className="rounded-xl border bg-secondary-gradient p-4">
        <div className="mb-2 text-sm font-medium text-zinc-600">Expenses Trend</div>
        <ExpensesTrend points={trend} />
      </div>

      {/* Table */}
      <ExpensesTable data={data} />

      {/* Footer summary */}
      <div className="rounded-xl border bg-secondary-gradient p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-600">
            Showing {data.length} of {total} expenses
          </div>
          <div className="text-sm font-medium">
            Filtered Total: {toCurrency(filteredTotal)}
          </div>
        </div>
        
        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1 || loading}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-zinc-600">
              Page {page} of {pageCount}
            </span>
            <button
              onClick={() => setPage(Math.min(pageCount, page + 1))}
              disabled={page === pageCount || loading}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleExpenseAdded}
      />
    </div>
  );
}