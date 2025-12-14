"use client";

import { useMemo, useState, useEffect } from "react";
import type { Car } from "../../_components/types/car";
import CarFilters from "../../_components/filters/CarFilters";
import CarCard from "../../_components/charts/CarCard";
import UnitsTable from "../../_components/tables/UnitsTable";
import CarDrawer from "../../_components/forms/CarDrawer";
import { getAllCarsFromStorage, createCar, updateCar, deleteCar } from "@/services/cars/cars.service";

export default function UnitsPage() {
  // Data
  const [cars, setCars] = useState<Car[]>([]);

  // Filters
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState<"All" | "available" | "rented" | "maintenance" | "reserved">("All");
  const [branch, setBranch] = useState<"All" | "Doha" | "Al Wakrah" | "Al Khor">("All");

  // View
  const [view, setView] = useState<"grid" | "list">("grid");

  // Selection & pagination
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Car | null>(null);

  // Load cars on mount
  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const carsData = await getAllCarsFromStorage();
      setCars(carsData);
    } catch (error) {
      console.error("Error loading cars:", error);
    }
  };

  const data = useMemo(() => {
    const searchQuery = query.trim().toLowerCase();
    const brandQuery = brand.trim().toLowerCase();
    return cars.filter(car => {
      if (status !== "All" && car.status !== status) return false;
      if (branch !== "All" && car.branch !== branch) return false;
      if (searchQuery) {
        const searchText = `${car.licensePlate || ""} ${car.model} ${car.vin || ""}`.toLowerCase();
        if (!searchText.includes(searchQuery)) return false;
      }
      if (brandQuery) {
        const carBrand = car.brand.toLowerCase();
        if (!carBrand.includes(brandQuery)) return false;
      }
      return true;
    });
  }, [cars, query, brand, status, branch]);

  const pages = Math.max(1, Math.ceil(data.length / pageSize));
  const start = (page - 1) * pageSize;
  const rows = data.slice(start, start + pageSize);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // CRUD functions
  const openNew = () => {
    setEditing(null);
    setDrawerOpen(true);
  };

  const onEdit = (car: Car) => {
    setEditing(car);
    setDrawerOpen(true);
  };

  const onSave = async (car: Car) => {
    try {
      if (editing) {
        await updateCar(car.id, car);
      } else {
        await createCar(car);
      }
      await loadCars();
      setDrawerOpen(false);
    } catch (error) {
      console.error("Error saving car:", error);
      alert(`Failed to save car: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this car?")) return;
    try {
      await deleteCar(id);
      await loadCars();
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-lg font-semibold">Units</h1>
        <div className="flex items-center gap-2">
          <button
            className={`rounded-full border px-3 py-1.5 text-xs ${
              view === "grid" ? "bg-zinc-900 text-white" : "bg-white"
            }`}
            onClick={() => setView("grid")}
          >
            Grid
          </button>
          <button
            className={`rounded-full border px-3 py-1.5 text-xs ${
              view === "list" ? "bg-zinc-900 text-white" : "bg-white"
            }`}
            onClick={() => setView("list")}
          >
            List
          </button>
          <button className="rounded border px-3 py-2 text-sm">
            Export CSV
          </button>
          <button className="rounded bg-zinc-900 px-3 py-2 text-sm text-white" onClick={openNew}>
            Add Car
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border bg-secondary-gradient p-4">
        <CarFilters
          query={query}
          onQuery={setQuery}
          brand={brand}
          onBrand={setBrand}
          status={status}
          onStatus={(v) => setStatus(v as any)}
          branch={branch}
          onBranch={(v) => setBranch(v as any)}
        />
      </div>

      {/* Content */}
      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(car => (
            <CarCard
              key={car.id}
              car={car}
              selected={selected.has(car.id)}
              onSelect={toggleSelect}
              onEdit={onEdit}
            />
          ))}
          {!rows.length && (
            <div className="col-span-full rounded-xl border bg-secondary-gradient p-6 text-center text-zinc-500">
              No cars match your filters.
            </div>
          )}
        </div>
      ) : (
        <UnitsTable 
          data={rows} 
          selectedIds={selected} 
          onToggle={toggleSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}

      {/* Footer */}
      <div className="flex items-center justify-between rounded-xl border bg-secondary-gradient px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-zinc-600">Selected:</span>
          <span className="font-medium">{selected.size}</span>
          <button className="rounded border px-2 py-1 text-xs">
            Bulk Disable
          </button>
          <button className="rounded border px-2 py-1 text-xs">
            Bulk Move
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded border px-2 py-1 disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span className="text-zinc-700">{page}/{pages}</span>
          <button
            className="rounded border px-2 py-1 disabled:opacity-50"
            disabled={page === pages}
            onClick={() => setPage(p => Math.min(pages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>

      {/* Car Drawer */}
      <CarDrawer
        open={drawerOpen}
        initial={editing}
        onClose={() => setDrawerOpen(false)}
        onSave={onSave}
      />
    </div>
  );
}