"use client";
import Image from "next/image";
import type { Car } from "../types/car";
import CarStatusPill from "../ui/CarStatusPill";

export default function CarCard({
  car, selected, onSelect, onEdit
}: { 
  car: Car; 
  selected: boolean; 
  onSelect: (id: string)=>void;
  onEdit?: (car: Car) => void;
}) {
  return (
    <div className={`rounded-xl border bg-secondary-gradient p-3 transition-shadow hover:shadow ${selected ? "ring-2 ring-zinc-900" : ""}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="font-medium">{car.model}</div>
          {car.isPopular && (
            <span className="text-yellow-500" title="Popular">⭐</span>
          )}
        </div>
        <CarStatusPill status={car.status || "available"} />
      </div>
      <div className="mt-2 text-xs text-zinc-600">{car.licensePlate} • {car.branch}</div>
      <div className="mt-3 relative h-36 w-full overflow-hidden rounded-lg bg-zinc-100">
        <Image
          src={car.images?.[0]?.trim() || "https://picsum.photos/seed/car/640/360"}
          alt={car.model}
          fill
          className="object-cover"
        />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded bg-zinc-50 p-2">
          <div className="text-zinc-500">Brand</div>
          <div className="font-medium">{car.brand}</div>
        </div>
        <div className="rounded bg-zinc-50 p-2">
          <div className="text-zinc-500">Mileage</div>
          <div className="font-medium">{car.mileage?.toLocaleString() || 0} km</div>
        </div>
        <div className="rounded bg-zinc-50 p-2">
          <div className="text-zinc-500">Rate/Day</div>
          <div className="font-medium">${car.price}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <button
          className="rounded border px-3 py-1.5 text-xs"
          onClick={()=>onSelect(car.id)}
        >
          {selected ? "Selected" : "Select"}
        </button>
        <div className="inline-flex gap-2">
          {onEdit && (
            <button className="rounded border px-2 py-1 text-xs hover:bg-gray-50" onClick={() => onEdit(car)}>Edit</button>
          )}
        </div>
      </div>
    </div>
  );
}