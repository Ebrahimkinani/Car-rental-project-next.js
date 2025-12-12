"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const IMAGES = [
  { src: "/images/hero/carr1.png", alt: "Luxury sports car - front view" },
  { src: "/images/hero/carr2.png", alt: "High-performance vehicle - side profile" },
  { src: "/images/hero/carr3.png", alt: "Premium automobile - rear angle" },
  { src: "/images/hero/carr4.png", alt: "Premium sports car - dynamic angle" },
  { src: "/images/hero/carr5.png", alt: "Luxury vehicle - elegant design" },
  { src: "/images/hero/carr6.png", alt: "Performance car - sleek profile" },
  { src: "/images/hero/carr7.png", alt: "Premium car - modern design" },
];

export default function SliderCard() {
  const [index, setIndex] = useState(0);

  // Auto-play with smooth infinite effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handle seamless looping
  const total = IMAGES.length;
  const currentIndex = index % total;

  // Navigation functions
  const goToPrevious = () => {
    setIndex((prev) => (prev - 1 + total) % total);
  };

  const goToNext = () => {
    setIndex((prev) => (prev + 1) % total);
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] h-[50vh] md:h-[calc(101vh-56px)] p-0 mb-0">
      {/* Smooth horizontal movement */}
      <div
        className="flex transition-transform duration-1500 ease-[cubic-bezier(0.7,0,0.3,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {IMAGES.concat(IMAGES[0]).map((image, i) => (
          <div key={i} className="relative w-full h-[50vh] md:h-[calc(101vh-56px)] shrink-0">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={goToPrevious}
        aria-label="Previous slide"
        className="absolute left-4 bottom-8 w-12 h-12 bg-transparent hover:bg-transparent text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 15l-3-3m0 0l3-3m-3 3h8" />
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={goToNext}
        aria-label="Next slide"
        className="absolute right-4 bottom-8 w-12 h-12 bg-transparent hover:bg-transparent text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 9l3 3m0 0l-3 3m3-3H8" />
        </svg>
      </button>

      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 w-2 rounded-full border border-white/50 transition-all duration-300 ${
              i === currentIndex ? "bg-white/90 scale-110" : "bg-transparent hover:bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Center CTA */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-32 md:translate-y-56">
        <button 
          onClick={() => {
            const carGrid = document.getElementById('car-grid');
            if (carGrid) {
              carGrid.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="bg-white text-black px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-light hover:scale-105 transition-transform duration-300"
        >
          Book Now <span className="inline-flex items-center justify-center w-7 h-7 md:w-9 md:h-9 bg-primary-500 text-white rounded-full text-sm md:text-base ml-1.5 md:ml-2">↗</span>
        </button>
      </div>
    </div>
  );
}
