"use client";

import {Car} from "@/types";
import {cn} from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface RelatedCarsProps {
    cars: Car[];
    className?: string;
}

export default function RelatedCars({cars, className} : RelatedCarsProps) {
    if (!cars || cars.length === 0) {
        return null;
    }

    return (
        <div className={
            cn("space-y-6", className)
        }>
            <div>
                <h3 className="text-2xl font-bold text-black mb-2">
                    Similar Cars You Might Like
                </h3>
                <p className="text-black">
                    Explore other vehicles in the same category
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {
                cars.map((car) => (
                    <Link key={
                            car.id
                        }
                        href={
                            `/cars/${
                                car.id
                            }`
                        }
                        className="group relative bg-gray-100 rounded-2xl border border-gray-300 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 block">
                        {/* Image Container */}
                        <div className="relative aspect-4/3 overflow-hidden">
                            <Image src={
                                    car.images ?. [0] ?. trim() || "/images/hero/car1.png"
                                }
                                alt={
                                    car.name
                                }
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                priority={false}/> {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/> {/* Status badge */}
                            <div className="absolute top-3 right-3">
                                <span className={
                                    cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", car.status === "available" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400")
                                }>
                                    {
                                    car.status === "available" ? "Available" : "Unavailable"
                                } </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                            {/* Car Name */}
                            <h4 className="text-lg font-semibold text-black line-clamp-1 group-hover:text-primary-600 transition-colors duration-200">
                                {
                                car.name
                            } </h4>

                            {/* Description */}
                            <p className="text-sm text-black line-clamp-2">
                                {
                                car.description || "Perfect for your next adventure"
                            } </p>

                            {/* Rental Price */}
                            <div className="flex items-center justify-between">
                                <div className="text-xl font-bold text-primary-500">
                                    ${
                                    car.price.toLocaleString()
                                }
                                    <span className="text-sm font-normal text-primary-300 ml-1">/day</span>
                                </div>

                                {/* View Details Button */}
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 border border-primary-200 rounded-lg hover:bg-primary-50">
                                    Book Now
                                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"/>
                                    </svg>
                                </span>
                            </div>

                            {/* Quick Specs */}
                            <div className="flex items-center justify-between text-xs text-black">
                                <span className="flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"/>
                                    </svg>
                                    {
                                    car.transmission || "Auto"
                                } </span>
                                <span className="flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                    </svg>
                                    {
                                    car.location || "Pickup Available"
                                } </span>
                            </div>
                        </div>
                    </Link>
                ))
            } </div>
        </div>
    );
}
