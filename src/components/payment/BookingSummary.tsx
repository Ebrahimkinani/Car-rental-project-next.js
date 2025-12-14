"use client";

import { BookingSummaryData } from "@/types";
import { cn } from "@/lib/utils";

interface BookingSummaryProps {
  data: BookingSummaryData;
  className?: string;
}

export default function BookingSummary({ data, className }: BookingSummaryProps) {
  return (
    <div className={cn("bg-gray-100 rounded-2xl border border-gray-300 p-6", className)}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-black mb-4">
          Booking Summary
        </h3>
        
        {/* Car Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-semibold text-black">
                {data.carName}
              </h4>
              <p className="text-sm text-gray-600">
                {data.carModel}
              </p>
            </div>
          </div>

          {/* Rental Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Pickup Date:</span>
              <span className="text-black font-medium">
                {new Date(data.pickupDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Return Date:</span>
              <span className="text-black font-medium">
                {new Date(data.returnDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pickup Location:</span>
              <span className="text-black font-medium">
                {data.pickupLocation}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="text-black font-medium">
                {data.rentalDays} {data.rentalDays === 1 ? 'day' : 'days'}
              </span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="pt-4 border-t border-gray-400">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  ${data.dailyRate.toLocaleString()} × {data.rentalDays} {data.rentalDays === 1 ? 'day' : 'days'}
                </span>
                <span className="text-black font-medium">
                  ${(data.dailyRate * data.rentalDays).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-black">Total</span>
                <span className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors duration-200">
                  ${data.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="text-xs text-gray-600">
        <p>Free cancellation up to 24 hours before pickup. Terms and conditions apply.</p>
      </div>
    </div>
  );
}
