"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  carName: string;
  className?: string;
}

export default function ImageGallery({ 
  images, 
  carName, 
  className 
}: ImageGalleryProps) {
  // Filter out empty or whitespace-only image URLs
  const validImages = images.filter(img => img && img.trim());
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleImageChange = useCallback((index: number) => {
    if (index === currentImageIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    
    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 300);
  }, [currentImageIndex, isTransitioning]);

  const handlePrevious = useCallback(() => {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : validImages.length - 1;
    handleImageChange(newIndex);
  }, [currentImageIndex, validImages.length, handleImageChange]);

  const handleNext = useCallback(() => {
    const newIndex = currentImageIndex < validImages.length - 1 ? currentImageIndex + 1 : 0;
    handleImageChange(newIndex);
  }, [currentImageIndex, validImages.length, handleImageChange]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePrevious();
      } else if (event.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext]);

  if (!validImages || validImages.length === 0) {
    return (
      <div className={cn(
        "relative w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center",
        className
      )}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image */}
      <div className="relative group">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
          <Image
            src={validImages[currentImageIndex]}
            alt={`${carName} - Image ${currentImageIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 60vw"
            className={cn(
              "object-cover transition-all duration-300 group-hover:scale-105",
              isTransitioning && "opacity-0"
            )}
            priority={currentImageIndex === 0}
          />
          
          {/* Navigation Arrows */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter */}
          {validImages.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {validImages.length}
            </div>
          )}

          {/* Zoom Indicator */}
          <div className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Click to zoom
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageChange(index)}
              className={cn(
                "relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200",
                currentImageIndex === index
                  ? "border-primary-500 ring-2 ring-primary-200"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${carName} thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
              {currentImageIndex === index && (
                <div className="absolute inset-0 bg-primary-500/20" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}