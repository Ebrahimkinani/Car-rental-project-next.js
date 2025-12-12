"use client";

import { useState, useEffect } from "react";
import { Car } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import SpecBadge from "./SpecBadge";
import PriceDisplay from "./PriceDisplay";
import { getBrandById } from "@/lib/categories";
import { useFavorites } from "@/hooks/useFavorites";

interface CarInfoPanelProps {
  car: Car;
  className?: string;
  onBookNow?: () => void;
}

export default function CarInfoPanel({ 
  car, 
  className,
  onBookNow 
}: CarInfoPanelProps) {
  const { isFavorite, addToFavorites, removeFromFavorites, loadFavoritesFromServer } = useFavorites();
  const [togglingFavorite, setTogglingFavorite] = useState(false);

  // Load favorites when component mounts
  useEffect(() => {
    loadFavoritesFromServer();
  }, [loadFavoritesFromServer]);

  // Add error handling
  if (!car) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">
            Car Information Not Available
          </h1>
          <p className="text-black">
            Unable to load car details.
          </p>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = async () => {
    if (togglingFavorite) return;
    
    try {
      setTogglingFavorite(true);
      
      if (isFavorite(car.id)) {
        await removeFromFavorites(car.id);
      } else {
        await addToFavorites(car.id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert(error instanceof Error ? error.message : 'Failed to update favorites');
    } finally {
      setTogglingFavorite(false);
    }
  };

  const handleBookNow = () => {
    if (onBookNow) {
      onBookNow();
    } else {
      // Default behavior - scroll to booking form
      const bookingForm = document.getElementById("booking-form");
      if (bookingForm) {
        bookingForm.scrollIntoView({ 
          behavior: "smooth", 
          block: "start",
          inline: "nearest"
        });
      }
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "available":
        return "bg-green-800 text-white";
      case "rented":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "reserved":
        return "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "available":
        return "Available for Rent";
      case "rented":
        return "Currently Rented";
      case "maintenance":
        return "Under Maintenance";
      case "reserved":
        return "Reserved";
      default:
        return "Check Availability";
    }
  };

  const brand = getBrandById(car.brand);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="space-y-4">
        {/* Status Badge & Year */}
        <div className="flex items-center justify-between">
          <span className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
            getStatusColor(car.status)
          )}>
            {getStatusText(car.status)}
          </span>
          {car.year && (
            <span className="text-sm text-black">
              {car.year} Model
            </span>
          )}
        </div>

        {/* Category Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {brand && (
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-primary-100 text-primary-800">
              {brand.name}
            </span>
          )}
        </div>

        {/* Car Name */}
        <h1 className="text-3xl lg:text-4xl font-bold text-black leading-tight">
          {car.name}
        </h1>
        
        {/* Model */}
        <p className="text-xl text-gray-600 font-medium">
          {car.model}
        </p>

        {/* Description */}
        {car.description && (
          <p className="text-lg text-black leading-relaxed">
            {car.description}
          </p>
        )}

        {/* Location */}
        {car.location && (
          <div className="flex items-center gap-2 text-black">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Pickup Location: {car.location}</span>
          </div>
        )}
      </div>

      {/* Price Display */}
      <PriceDisplay car={car} />

      {/* Key Specifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-black">
          Specifications
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <SpecBadge
            label="Seats"
            value={`${car.seats} Passengers`}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <SpecBadge
            label="Doors"
            value={`${car.doors} Doors`}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            }
          />
          {car.transmission && (
            <SpecBadge
              label="Transmission"
              value={car.transmission}
              icon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
              }
            />
          )}
          {car.fuelType && (
            <SpecBadge
              label="Fuel Type"
              value={car.fuelType}
              icon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              }
            />
          )}
          {car.horsepower && (
            <SpecBadge
              label="Horsepower"
              value={`${car.horsepower} HP`}
              icon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              }
            />
          )}
          {car.acceleration && (
            <SpecBadge
              label="0-60 mph"
              value={`${car.acceleration}s`}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
          )}
          {car.topSpeed && (
            <SpecBadge
              label="Top Speed"
              value={`${car.topSpeed} mph`}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          )}
          {car.luggageCapacity && (
            <SpecBadge
              label="Luggage"
              value={`${car.luggageCapacity}L`}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
            />
          )}
          {car.mileage && (
            <SpecBadge
              label="Mileage"
              value={`${car.mileage.toLocaleString()} mi`}
              icon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              }
            />
          )}
          {car.color && (
            <SpecBadge
              label="Color"
              value={car.color}
              icon={
                <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: car.color.toLowerCase() }} />
              }
            />
          )}
        </div>
      </div>
      
   


      {/* Reviews/Ratings Placeholder */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-black">
          Customer Reviews
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-black">
            4.8 out of 5 (24 reviews)
          </span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="pt-4 space-y-3">
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleBookNow}
            className="flex-1 text-lg px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white"
            disabled={car.status !== "available"}
          >
            {car.status === "available" ? "Book Now" : "Check Availability"}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleToggleFavorite}
            disabled={togglingFavorite}
            className="px-4 py-4 border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-600 transition-colors duration-200"
            aria-label={isFavorite(car.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              className={`w-6 h-6 transition-colors duration-200 ${togglingFavorite ? "animate-pulse" : ""}`}
              fill={isFavorite(car.id) ? "#ef4444" : "none"}
              stroke={isFavorite(car.id) ? "#ef4444" : "#6b7280"}
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </Button>
        </div>
        
        {car.status !== "available" && (
          <p className="text-sm text-black mt-2 text-center lg:text-left">
            This vehicle is currently {car.status}. Contact us for availability.
          </p>
        )}
      </div>

      {/* Additional Info */}
      <div className="pt-4 border-t border-gray-400">
        <div className="flex items-center justify-between text-sm text-black">
         
          <span>24/7 support</span>
        </div>
      </div>
    </div>
  );
}
