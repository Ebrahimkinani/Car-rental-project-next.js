"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Car } from "@/types";
import { useFavorites } from "@/hooks/useFavorites";

interface PopularCarsSectionProps {
  className?: string;
}

// Heart Icon Component
function HeartIcon({ filled, className = "" }: { filled: boolean; className?: string }) {
  return (
    <svg
      className={`w-5 h-5 transition-colors duration-200 ${className}`}
      fill={filled ? "#ef4444" : "none"}
      stroke={filled ? "#ef4444" : "#6b7280"}
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

export default function PopularCarsSection({ className = "" }: PopularCarsSectionProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, addToFavorites, removeFromFavorites, loadFavoritesFromServer } = useFavorites();

  useEffect(() => {
    async function loadPopularCars() {
      try {
        const res = await fetch("/api/cars/popular", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Failed to fetch popular cars");
          setCars([]);
          return;
        }

        const result = await res.json();
        if (result.success && result.data) {
          setCars(result.data);
        } else {
          setCars([]);
        }
      } catch (error) {
        console.error("Error loading popular cars:", error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    }

    loadPopularCars();
    loadFavoritesFromServer(); // Load favorites when component mounts
  }, [loadFavoritesFromServer]);

  // Don't render if loading or no cars
  if (loading || cars.length === 0) {
    return null;
  }

  const handleToggleFavorite = async (e: React.MouseEvent, carId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isFavorite(carId)) {
        await removeFromFavorites(carId);
      } else {
        await addToFavorites(carId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <section className={`mt-12 pb-12 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-[28px] font-bold text-gray-900 mb-2">
            Most Popular
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            Hand-picked favorites from our fleet
          </p>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cars.map((car) => (
          <Link
            key={car.id}
            href={`/cars/${car.id}`}
            className="group relative bg-white rounded-2xl border-[0.5px] border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 block focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shrink-0 w-[260px] md:w-[300px] lg:w-[320px] xl:w-[340px] max-w-[260px] md:max-w-[300px] lg:max-w-[320px] xl:max-w-[340px]"
            aria-label={`View details for ${car.name}`}
          >
            {/* Image Container */}
            <div className="relative aspect-4/3 overflow-hidden">
              <Image
                src={car.images?.[0]?.trim() || "/images/hero/car1.png"}
                alt={""}
                fill
                sizes="(max-width: 768px) 260px, (max-width: 1024px) 300px, (max-width: 1280px) 320px, 340px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={false}
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Category badges and favorite button */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary-500 text-white">
                  {car.brand}
                </span>
                <button 
                  onClick={(e) => handleToggleFavorite(e, car.id)}
                  className="p-2 rounded-full bg-white/30 backdrop-blur-sm hover:scale-110 transition-all duration-200"
                  aria-label={isFavorite(car.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <HeartIcon filled={isFavorite(car.id)} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Car Name & Model */}
              <div>
                <h3 className="text-lg font-normal text-black line-clamp-1 group-hover:text-primary-500 transition-colors duration-200">
                  {car.name}
                </h3>
                <p className="text-xs text-gray-500 group-hover:text-primary-500">{car.model}</p>
              </div>
              
              {/* Quick Specs */}
              <div className="flex items-center gap-3 text-xs text-gray-600 group-hover:text-primary-500 transition-colors">
                <span className="flex items-center gap-1 group-hover:text-primary-500">
                  <svg className="w-4 h-4 group-hover:stroke-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {car.seats} seats
                </span>
                <span className="flex items-center gap-1 group-hover:text-primary-500">
                  <svg className="w-4 h-4 group-hover:stroke-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {car.transmission === "automatic" ? "Auto" : "Manual"}
                </span>
                {car.horsepower && (
                  <span className="flex items-center gap-1 group-hover:text-primary-500">
                    <svg className="w-4 h-4 group-hover:fill-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    {car.horsepower}hp
                  </span>
                )}
              </div>
              
              {/* Rental Price */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="text-2xl font-bold text-primary-500">
                  ${car.price.toLocaleString()}
                  <span className="text-sm font-normal text-primary-300 ml-1">/day</span>
                </div>
                
                {/* View Details Button */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 border border-primary-200 rounded-lg hover:bg-primary-50">
                  View
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
        </div>
      </div>
    </section>
  );
}
