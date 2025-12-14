"use client";

import Image from "next/image";
import { Car } from "@/types";

interface CarGridOriginalProps {
  cars: Car[];
  className?: string;
}

export default function CarGridOriginal({ cars, className = "" }: CarGridOriginalProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 ${className}`}>
      {cars.map((car) => (
        <div
          key={car.id}
          className="border border-gray-200 rounded-2xl p-4 bg-white hover:border-gray-400 transition-all duration-300 shadow-none"
        >
          <Image
            src={car.images?.[0]?.trim() || "/images/hero/car1.png"}
            alt={car.name}
            width={300}
            height={180}
            className="mx-auto"
          />
          <h3 className="text-lg font-semibold text-center mt-3">{car.name}</h3>
          <p className="text-sm text-gray-500 text-center">Available in our workshop</p>
          <div className="text-center mt-2 font-medium text-gray-800">
            ${car.price} USD
          </div>
        </div>
      ))}
    </div>
  );
}
