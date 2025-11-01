"use client";

import { Car } from "@/types";
import CarDetailsHero from "./CarDetailsHero";

interface CarDetailsPageProps {
  car: Car;
  onBookNow?: () => void;
  className?: string;
}

export default function CarDetailsPage({ 
  car, 
  onBookNow,
  className 
}: CarDetailsPageProps) {
  return (
    <CarDetailsHero 
      car={car} 
      onBookNow={onBookNow}
      className={className}
    />
  );
}
