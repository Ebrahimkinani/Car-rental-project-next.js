"use client";

import { Car } from "@/types";
import { cn } from "@/lib/utils";
import ImageGallery from "./ImageGallery";
import CarInfoPanel from "./CarInfoPanel";

interface CarDetailsHeroProps {
  car: Car;
  className?: string;
  onBookNow?: () => void;
}

export default function CarDetailsHero({ 
  car, 
  className,
  onBookNow 
}: CarDetailsHeroProps) {
  // Add error handling
  if (!car) {
    return (
      <section className={cn(
        "w-full bg-white",
        className
      )}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black mb-4">
              Car Not Found
            </h1>
            <p className="text-black">
              The requested car could not be found.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn(
      "w-full bg-white mt-8",
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Mobile Layout - Stacked */}
        <div className="lg:hidden space-y-8">
          {/* Image Gallery */}
          <ImageGallery 
            images={car.images} 
            carName={car.name}
            className="w-full"
          />
          
          {/* Car Info Panel */}
          <CarInfoPanel 
            car={car}
            onBookNow={onBookNow}
            className="w-full"
          />
        </div>

        {/* Desktop Layout - Split */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Image Gallery - Left Side */}
          <div className="lg:col-span-7 xl:col-span-6">
            <ImageGallery 
              images={car.images} 
              carName={car.name}
              className="w-full"
            />
          </div>
          
          {/* Car Info Panel - Right Side */}
          <div className="lg:col-span-5 xl:col-span-6">
            <div className="sticky top-8">
              <CarInfoPanel 
                car={car}
                onBookNow={onBookNow}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
