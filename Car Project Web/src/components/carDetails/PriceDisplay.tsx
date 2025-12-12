"use client";

import { Car } from "@/types";
import { cn } from "@/lib/utils";
import { 
  getEffectiveWeeklyRate, 
  getEffectiveMonthlyRate,
  calculateWeeklySavings,
  calculateMonthlySavings,
  formatCurrency 
} from "@/lib/pricing";

interface PriceDisplayProps {
  car: Car;
  className?: string;
}

export default function PriceDisplay({ car, className }: PriceDisplayProps) {
  const weeklyRate = getEffectiveWeeklyRate(car);
  const monthlyRate = getEffectiveMonthlyRate(car);
  const weeklySavings = calculateWeeklySavings(car);
  const monthlySavings = calculateMonthlySavings(car);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Price */}
      <div className="text-center lg:text-left">
        <div className="text-4xl lg:text-5xl font-bold text-primary-500 mb-1">
          {formatCurrency(car.price)}
          <span className="text-lg font-normal text-primary-300 ml-1">
            /day
          </span>
        </div>
        <p className="text-sm text-black">
          Starting price
        </p>
      </div>

      {/* Rental Options */}
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center p-2 bg-white rounded-lg border border-gray-300">
          <div className="text-base font-semibold text-black">
            {formatCurrency(weeklyRate)}
          </div>
          <div className="text-xs text-black">
            Weekly Rate
          </div>
          {weeklySavings.percentage > 0 && (
            <div className="text-xs text-green-600 mt-1">
              Save {weeklySavings.percentage}%
            </div>
          )}
        </div>
        <div className="text-center p-2 bg-white rounded-lg border border-gray-300">
          <div className="text-base font-semibold text-black">
            {formatCurrency(monthlyRate)}
          </div>
          <div className="text-xs text-black">
            Monthly Rate
          </div>
          {monthlySavings.percentage > 0 && (
            <div className="text-xs text-green-600 mt-1">
              Save {monthlySavings.percentage}%
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-2 text-sm text-black">
        {car.unlimitedMileage && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Unlimited Mileage
          </div>
        )}
        {car.insuranceIncluded && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Insurance Included
          </div>
        )}
        {car.minimumRentalDays && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Min. {car.minimumRentalDays} day rental
          </div>
        )}
      </div>
    </div>
  );
}
