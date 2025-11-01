"use client";
import { useMemo, useState } from "react";
import type { Car } from "../types/car.js";
// Import CarStatusPill component
import CarStatusPill from "../ui/CarStatusPill";

export default function UnitsTable({
  data, selectedIds, onToggle, onEdit, onDelete
}: { 
  data: Car[]; 
  selectedIds: Set<string>; 
  onToggle: (id: string)=>void;
  onEdit?: (car: Car) => void;
  onDelete?: (id: string) => void;
}) {
  const [sort, setSort] = useState<{key: keyof Car; dir: "asc"|"desc"}>({ key: "model", dir: "asc" });

  const sorted = useMemo(()=> {
    const c = [...data];
    c.sort((a,b)=>{
      const ka = a[sort.key]; const kb = b[sort.key];
      const va = typeof ka === "string" ? ka : (ka as any)?.toString?.() ?? "";
      const vb = typeof kb === "string" ? kb : (kb as any)?.toString?.() ?? "";
      return sort.dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return c;
  }, [data, sort]);

  function header(label: string, key: keyof Car) {
    return (
      <button
        className="flex items-center gap-1"
        onClick={()=>setSort(s => ({ key, dir: s.key===key && s.dir==="asc" ? "desc":"asc" }))}
      >
        {label} <span className="text-xs text-zinc-400">{sort.key===key? (sort.dir==="asc"?"▲":"▼"):""}</span>
      </button>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-secondary-gradient">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-50 text-zinc-600">
          <tr>
            <th className="px-4 py-2"><input type="checkbox" disabled /></th>
            <th className="px-4 py-2 text-left font-medium">{header("Name","name")}</th>
            <th className="px-4 py-2 text-left font-medium">{header("Model","model")}</th>
            <th className="px-4 py-2 text-left font-medium">Popular</th>
            <th className="px-4 py-2 text-left font-medium">Plate</th>
            <th className="px-4 py-2 text-left font-medium">Brand</th>
            <th className="px-4 py-2 text-left font-medium">{header("Branch","branch")}</th>
            <th className="px-4 py-2 text-left font-medium">{header("Mileage","mileage")}</th>
            <th className="px-4 py-2 text-left font-medium">{header("Rate/Day","price")}</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
            <th className="px-4 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {sorted.map(car=>(
            <tr key={car.id} className="hover:bg-zinc-50">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedIds.has(car.id)}
                  onChange={()=>onToggle(car.id)}
                />
              </td>
              <td className="px-4 py-2">{car.name || "—"}</td>
              <td className="px-4 py-2">{car.model}</td>
              <td className="px-4 py-2">
                {car.isPopular ? (
                  <span className="text-yellow-500" title="Popular">⭐</span>
                ) : "—"}
              </td>
              <td className="px-4 py-2">{car.licensePlate || "—"}</td>
              <td className="px-4 py-2">{car.brand}</td>
              <td className="px-4 py-2">{car.branch || "—"}</td>
              <td className="px-4 py-2">{car.mileage ? car.mileage.toLocaleString() + " km" : "—"}</td>
              <td className="px-4 py-2">${car.price}</td>
              <td className="px-4 py-2"><CarStatusPill status={car.status || "available"} /></td>
              <td className="px-4 py-2 text-right">
                <div className="inline-flex gap-2">
                  {onEdit && (
                    <button className="rounded border px-2 py-1 text-xs hover:bg-gray-50" onClick={() => onEdit(car)}>Edit</button>
                  )}
                  {onDelete && (
                    <button className="rounded border px-2 py-1 text-xs hover:bg-gray-50" onClick={() => onDelete(car.id)}>Delete</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {!sorted.length && (
            <tr><td colSpan={11} className="px-4 py-8 text-center text-zinc-500">No cars match your filters.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}