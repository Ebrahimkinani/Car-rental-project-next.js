"use client";
import type { CarStatus } from "../types/car.js";

function CarStatusPill({ status }: { status: CarStatus }) {
  const map: Record<CarStatus, string> = {
    available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rented: "bg-indigo-50 text-indigo-700 border-indigo-200",
    maintenance: "bg-amber-50 text-amber-700 border-amber-200",
    reserved: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${map[status]}`}>
      {status}
    </span>
  );
}

export default CarStatusPill;