"use client";

import { useState, useEffect } from "react";
import { Car } from "@/types";
import { useFavorites } from "@/hooks/useFavorites";
import { getFeaturedCars } from "@/lib/cars";
import CarCard from "./CarCard";

interface PopularCarsSectionProps {
  className?: string;
  initialCars?: Car[];
}

export default function PopularCarsSection({
  className = "",
  initialCars,
}: PopularCarsSectionProps) {
  const [cars, setCars] = useState<Car[]>(initialCars ?? []);
  const [loading, setLoading] = useState(!initialCars?.length);
  const { isFavorite, addToFavorites, removeFromFavorites, loadFavoritesFromServer } = useFavorites();

  useEffect(() => {
    if (initialCars?.length) {
      setCars(initialCars);
      setLoading(false);
      return;
    }

    async function loadPopularCars() {
      try {
        const featured = await getFeaturedCars();
        setCars(featured);
      } catch (error) {
        console.error("Error loading popular cars:", error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    }

    loadPopularCars();
    loadFavoritesFromServer();
  }, [initialCars, loadFavoritesFromServer]);

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
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <section className={`pt-[7%] pb-12 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-[28px] font-bold text-gray-900 mb-2">Most Popular</h2>
          <p className="text-gray-500 text-sm md:text-base">
            Hand-picked favorites from our fleet
          </p>
        </div>

        <div className="flex overflow-x-auto gap-4 sm:gap-6 pt-[7%] md:pt-0 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              variant="carousel"
              isFavorite={isFavorite(car.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
