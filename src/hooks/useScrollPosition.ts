/**
 * useScrollPosition Hook
 * React hook for detecting scroll position and hero section visibility
 */

"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to detect if user is in hero section
 * @returns boolean - Whether the user is currently in the hero section
 */
export function useScrollPosition(): boolean {
  const [isInHero, setIsInHero] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Get the hero section height (viewport height)
      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;
      
      // Check if we're still in the hero section
      // Using 20% of hero height as threshold for more responsive text change
      const threshold = heroHeight * 0.2;
      const newIsInHero = scrollY < threshold;
      
      // Scroll position debug removed for production
      setIsInHero(newIsInHero);
    };

    // Set initial value
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return isInHero;
}
