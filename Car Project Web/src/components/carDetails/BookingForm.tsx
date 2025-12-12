"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  car: Car;
  className?: string;
}

export default function BookingForm({ car, className }: BookingFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    pickupDate: "",
    returnDate: "",
    pickupTime: "10:00",
    returnTime: "10:00",
    pickupLocation: "Downtown Location",
    returnLocation: "Downtown Location",
    driverAge: "",
    additionalDriver: false,
    insurance: "basic",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate rental days
    const pickup = new Date(formData.pickupDate);
    const returnDate = new Date(formData.returnDate);
    const rentalDays = Math.ceil((returnDate.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
    
    // Prepare booking data for payment page
    const bookingData = {
      carName: car.name,
      carModel: `${car.year || '2024'} ${car.name}`,
      rentalDays: rentalDays,
      dailyRate: car.price,
      totalAmount: calculateTotal(),
      pickupDate: formData.pickupDate,
      returnDate: formData.returnDate,
      pickupLocation: formData.pickupLocation,
      returnLocation: formData.returnLocation,
      pickupTime: formData.pickupTime,
      returnTime: formData.returnTime,
      driverAge: formData.driverAge,
      additionalDriver: formData.additionalDriver,
      insurance: formData.insurance,
      notes: formData.notes,
      carId: car.id
    };
    
    // Navigate to payment page with booking data
    const searchParams = new URLSearchParams();
    searchParams.set('booking', encodeURIComponent(JSON.stringify(bookingData)));
    router.push(`/payment?${searchParams.toString()}`);
  };

  const calculateTotal = () => {
    if (!formData.pickupDate || !formData.returnDate) return car.price;
    
    const pickup = new Date(formData.pickupDate);
    const returnDate = new Date(formData.returnDate);
    const days = Math.ceil((returnDate.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
    
    let baseTotal = days * car.price;
    
    // Add additional driver cost
    if (formData.additionalDriver) {
      baseTotal += days * 10;
    }
    
    // Add insurance cost
    let insuranceCost = 0;
    switch (formData.insurance) {
      case 'premium':
        insuranceCost = days * 15;
        break;
      case 'full':
        insuranceCost = days * 25;
        break;
      default:
        insuranceCost = 0;
    }
    
    return baseTotal + insuranceCost;
  };

  return (
    <div id="booking-form" className={cn("bg-gray-100 rounded-2xl border border-gray-300 p-6", className)}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-black mb-2">
          Book This Car
        </h3>
        <div className="text-3xl font-bold text-primary-600 hover:text-primary-700 transition-colors duration-200">
          ${car.price.toLocaleString()}
          <span className="text-lg font-normal text-black">/day</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pickup Date */}
        <div>
          <label htmlFor="pickupDate" className="block text-sm font-medium text-black mb-2">
            Pickup Date
          </label>
          <input
            type="date"
            id="pickupDate"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-black"
            required
          />
        </div>

        {/* Return Date */}
        <div>
          <label htmlFor="returnDate" className="block text-sm font-medium text-black mb-2">
            Return Date
          </label>
          <input
            type="date"
            id="returnDate"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleInputChange}
            min={formData.pickupDate || new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-black"
            required
          />
        </div>

        {/* Time Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pickupTime" className="block text-sm font-medium text-black mb-2">
              Pickup Time
            </label>
            <select
              id="pickupTime"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-black"
            >
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
            </select>
          </div>
          <div>
            <label htmlFor="returnTime" className="block text-sm font-medium text-black mb-2">
              Return Time
            </label>
            <select
              id="returnTime"
              name="returnTime"
              value={formData.returnTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-black"
            >
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
            </select>
          </div>
        </div>

        {/* Location Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pickupLocation" className="block text-sm font-medium text-black mb-2">
              Pickup Location
            </label>
            <select
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-black"
              required
            >
              <option value="Downtown Location">Downtown Location</option>
              <option value="Airport Location">Airport Location</option>
              <option value="City Center">City Center</option>
              <option value="Suburbs">Suburbs</option>
            </select>
          </div>
          <div>
            <label htmlFor="returnLocation" className="block text-sm font-medium text-black mb-2">
              Return Location
            </label>
            <select
              id="returnLocation"
              name="returnLocation"
              value={formData.returnLocation}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-black"
              required
            >
              <option value="Downtown Location">Downtown Location</option>
              <option value="Airport Location">Airport Location</option>
              <option value="City Center">City Center</option>
              <option value="Suburbs">Suburbs</option>
            </select>
          </div>
        </div>

        {/* Driver Age */}
        <div>
          <label htmlFor="driverAge" className="block text-sm font-medium text-black mb-2">
            Driver Age
          </label>
          <select
            id="driverAge"
            name="driverAge"
            value={formData.driverAge}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-black"
            required
          >
            <option value="">Select Age Range</option>
            <option value="21-24">21-24 years</option>
            <option value="25-29">25-29 years</option>
            <option value="30-39">30-39 years</option>
            <option value="40-49">40-49 years</option>
            <option value="50-59">50-59 years</option>
            <option value="60+">60+ years</option>
          </select>
        </div>

        {/* Additional Driver */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="additionalDriver"
            name="additionalDriver"
            checked={formData.additionalDriver}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="additionalDriver" className="ml-2 block text-sm text-black">
            Add additional driver (+$10/day)
          </label>
        </div>

        {/* Insurance */}
        <div>
          <label htmlFor="insurance" className="block text-sm font-medium text-black mb-2">
            Insurance Coverage
          </label>
          <select
            id="insurance"
            name="insurance"
            value={formData.insurance}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-black"
          >
            <option value="basic">Basic Coverage (Included)</option>
            <option value="premium">Premium Coverage (+$15/day)</option>
            <option value="full">Full Coverage (+$25/day)</option>
          </select>
        </div>

   
        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-black mb-2">
            Special Requests
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            placeholder="Any special requests or notes..."
            className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-black resize-none"
          />
        </div>

        {/* Total Price */}
        <div className="pt-4 border-t border-gray-400">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-black">
              Total Estimate
            </span>
            <span className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors duration-200">
              ${calculateTotal().toLocaleString()}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full bg-primary-600 hover:bg-primary-700 text-white"
          disabled={car.status !== "available"}
        >
          {car.status === "available" ? "Reserve Now" : "Check Availability"}
        </Button>

        {car.status !== "available" && (
          <p className="text-sm text-black text-center">
            This vehicle is currently {car.status}. Contact us for availability.
          </p>
        )}
      </form>

      {/* Terms */}
      <div className="mt-6 text-xs text-black">
        <p>By booking, you agree to our terms and conditions. Free cancellation up to 24 hours before pickup.</p>
      </div>
    </div>
  );
}