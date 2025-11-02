"use client";

import { useMemo, useState, useEffect } from "react";
import type { Category } from "@/types";
import CategoryFilters from "../../_components/filters/CategoryFilters";
import CategoriesTable from "../../_components/tables/CategoriesTables";
import CategoryDrawer from "../../_components/forms/CategoryDrawer";
import { StatsGrid } from "@/components/ui/stats-card";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Tags, Eye, EyeOff } from "lucide-react";
import useSWR from 'swr';
import ExpensesTrend from "../../_components/charts/ExpensesTrends";
import { categoriesApi } from "@/services/api/categories";

export default function CategoriesPage() {
  // fetcher for SWR
  const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());
  const [rows, setRows] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { data: trendData } = useSWR<{ points: { date: string; total: number }[] }>(
    '/api/admin/categories/trend?days=30',
    fetcher,
    { refreshInterval: 60000, revalidateOnFocus: true }
  );

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      // Use main API (with fallback data if MongoDB fails)
      const response = await fetch('/api/categories');
      const result = await response.json();
      
      if (result.success) {
        setRows(result.data);
        if (result.message) {
          // Category message received
        }
      } else {
        console.error("Error loading categories:", result.error);
        // Fallback to empty array
        setRows([]);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      // Fallback to empty array
      setRows([]);
    }
  };

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(r => {
      if (status !== "All" && r.status !== status) return false;
      if (q) {
        const hay = `${r.name} ${r.code}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, query, status]);

  function openNew() {
    setEditing(null);
    setDrawerOpen(true);
  }

  function onEdit(cat: Category) {
    setEditing(cat);
    setDrawerOpen(true);
  }

  async function onSave(cat: Category) {
    try {
      if (editing) {
        await categoriesApi.update(cat.id, cat);
      } else {
        // For new categories, we need to provide only the relevant fields
        const categoryData = {
          name: cat.name,
          code: cat.code,
          slug: cat.slug,
          status: cat.status,
          description: cat.description || '',
          sortOrder: cat.sortOrder || 0,
          imageUrl: cat.imageUrl
        };
        await categoriesApi.create(categoryData);
      }
      await loadCategories();
      setDrawerOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save category';
      
      // Check if error is about existing category
      if (errorMessage.toLowerCase().includes('already exists') || 
          errorMessage.toLowerCase().includes('duplicate') ||
          errorMessage.toLowerCase().includes('category with this')) {
        setAlertMessage(errorMessage);
        setAlertOpen(true);
      } else {
        // For other errors, still show alert but with generic message
        setAlertMessage(errorMessage);
        setAlertOpen(true);
      }
    }
  }

  async function onToggle(id: string) {
    try {
      const category = rows.find(c => c.id === id);
      if (category) {
        const newStatus = category.status === "Active" ? "Hidden" : "Active";
        await categoriesApi.update(id, { status: newStatus });
        await loadCategories();
      }
    } catch (error) {
      console.error("Error toggling category status:", error);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    try {
      await categoriesApi.delete(id);
      await loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }

  function exportCsv() {
    const headers = ["Name","Code","Status"];
    const body = data.map(r => [r.name, r.code, r.status].join(","));
    const csv = [headers.join(","), ...body].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "categories.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const total = rows.length;
  const active = rows.filter(r => r.status === "Active").length;
  const hidden = rows.filter(r => r.status === "Hidden").length;
  const trendPoints = trendData?.points || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-lg font-semibold">Categories</h1>
        <div className="flex gap-2">
          <button className="rounded border px-3 py-2 text-sm" onClick={exportCsv}>Export CSV</button>
          <button className="rounded bg-zinc-900 px-3 py-2 text-sm text-white" onClick={openNew}>New Category</button>
        </div>
      </div>

      {/* KPIs with mini trends */}
      <StatsGrid
        items={[
          { label: "Total", value: total, icon: Tags, trendData: trendPoints.slice(-7).map(p=>p.total) },
          { label: "Active", value: active, icon: Eye, trendData: trendPoints.slice(-7).map(p=>p.total) },
          { label: "Hidden", value: hidden, icon: EyeOff },
        ]}
      />

      {/* Trend Diagram */}
      <div className="rounded-xl border bg-secondary-gradient p-4">
        <div className="mb-2 text-sm font-medium text-zinc-600">Categories Created Trend</div>
        <ExpensesTrend points={trendPoints} />
      </div>

      {/* Filters */}
      <div className="rounded-xl border bg-secondary-gradient p-4">
        <CategoryFilters
          query={query} onQuery={setQuery}
          status={status} onStatus={setStatus}
        />
      </div>

      {/* Table */}
      <CategoriesTable
        data={data}
        onEdit={onEdit}
        onToggle={onToggle}
        onDelete={onDelete}
      />

      {/* Drawer */}
      <CategoryDrawer
        open={drawerOpen}
        initial={editing}
        onClose={() => setDrawerOpen(false)}
        onSave={onSave}
      />

      {/* Alert Dialog */}
      <AlertDialog
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        title="Category Already Exists"
        description={alertMessage}
      />
    </div>
  );
}