"use client";

import { Booking } from "@/types";
import { Button } from "@/components/ui/Button";
import BookingStatusBadge from "./BookingStatusBadge";
import { cn } from "@/lib/utils";

interface BookingCardProps {
  booking: Booking;
  className?: string;
  onCancel?: (bookingId: string) => void;
}

export default function BookingCard({ booking, className, onCancel }: BookingCardProps) {

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCancel) {
      onCancel(booking.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canCancel = booking.status === "upcoming" || booking.status === "active";

  return (
    <div className={cn(
      "bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200",
      className
    )}>
      {/* Header with status and image */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={booking.carImage}
              alt={booking.carName}
              className="w-16 h-12 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-lg font-semibold text-black">
                {booking.carName}
              </h3>
              <p className="text-sm text-gray-600">
                {booking.carModel}
              </p>
            </div>
          </div>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      {/* Booking Details */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Pickup Date:</span>
          <span className="text-black font-medium">
            {formatDate(booking.pickupDate)} at {booking.pickupTime}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Return Date:</span>
          <span className="text-black font-medium">
            {formatDate(booking.returnDate)} at {booking.returnTime}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Location:</span>
          <span className="text-black font-medium">
            {booking.pickupLocation}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Duration:</span>
          <span className="text-black font-medium">
            {booking.rentalDays} {booking.rentalDays === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex justify-between items-center mb-4 pt-3 border-t border-gray-200">
        <span className="text-sm text-gray-600">Total Amount:</span>
        <span className="text-xl font-bold text-primary-600">
          ${booking.totalAmount.toLocaleString()}
        </span>
      </div>

      {/* Action Buttons */}
      {canCancel && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Notes */}
      {booking.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            <span className="font-medium">Note:</span> {booking.notes}
          </p>
        </div>
      )}
    </div>
  );
}
