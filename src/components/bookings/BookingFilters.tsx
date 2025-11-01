"use client";

import { BookingStatus } from "@/types";
import { cn } from "@/lib/utils";

interface BookingFiltersProps {
  activeFilter: BookingStatus | "all";
  onFilterChange: (filter: BookingStatus | "all") => void;
  className?: string;
}

const filterOptions: Array<{ value: BookingStatus | "all"; label: string; count?: number }> = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" }
];

export default function BookingFilters({ 
  activeFilter, 
  onFilterChange, 
  className 
}: BookingFiltersProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
            activeFilter === option.value
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          {option.label}
          {option.count !== undefined && (
            <span className="ml-1 text-xs opacity-75">
              ({option.count})
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
