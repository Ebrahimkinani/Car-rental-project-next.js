"use client";

import { Car } from "@/types";
import { useFavorites } from "@/hooks/useFavorites";
import { useState, useEffect } from "react";
import { useIsTablet, useIsDesktop } from "@/hooks/useMediaQuery";
import CarCard from "./CarCard";

interface CarGridProps {
  cars: Car[];
  className?: string;
}

export default function CarGrid({ cars, className = "" }: CarGridProps) {
  const { isFavorite, addToFavorites, removeFromFavorites, loadFavoritesFromServer } = useFavorites();
  const [togglingFavorites, setTogglingFavorites] = useState<Set<string>>(new Set());
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    loadFavoritesFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleFavorite = async (e: React.MouseEvent, carId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (togglingFavorites.has(carId)) return;

    try {
      setTogglingFavorites((prev) => new Set(prev).add(carId));

      if (isFavorite(carId)) {
        await removeFromFavorites(carId);
      } else {
        await addToFavorites(carId);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setTogglingFavorites((prev) => {
        const next = new Set(prev);
        next.delete(carId);
        return next;
      });
    }
  };

  const getDisplayLimit = () => {
    if (isDesktop) return 8;
    if (isTablet) return 6;
    return 4;
  };

  const displayedCars = cars.slice(0, getDisplayLimit());

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 ${className}`}>
      {displayedCars.map((car) => (
        <CarCard
          key={car.id}
          car={car}
          variant="grid"
          isFavorite={isFavorite(car.id)}
          isTogglingFavorite={togglingFavorites.has(car.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      ))}
    </div>
  );
}
