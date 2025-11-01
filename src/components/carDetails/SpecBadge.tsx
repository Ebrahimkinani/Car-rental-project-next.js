"use client";

import { cn } from "@/lib/utils";

interface SpecBadgeProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

export default function SpecBadge({ 
  label, 
  value, 
  icon, 
  className 
}: SpecBadgeProps) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 p-2 bg-white rounded-lg border border-primary-500 hover:shadow-md transition-shadow duration-300",
      className
    )}>
      {icon && (
        <div className="flex-shrink-0 text-primary-500">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-black uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-black truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
