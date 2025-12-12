/**
 * useCountUp Hook
 * Custom hook for animating numbers from 0 to target value
 */

"use client";

import { useState, useEffect, useRef } from "react";

interface UseCountUpOptions {
  duration?: number;
  startOnMount?: boolean;
  easing?: (t: number) => number;
}

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export function useCountUp(
  end: number,
  options: UseCountUpOptions = {}
) {
  const {
    duration = 2000,
    startOnMount = false,
    easing = easeOutCubic,
  } = options;

  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

  // Handle startOnMount option
  useEffect(() => {
    if (startOnMount) {
      setIsVisible(true);
    }
  }, [startOnMount]);

  useEffect(() => {
    if (!isVisible && !startOnMount) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = easing(progress);
      const currentCount = Math.floor(easedProgress * end);

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, startOnMount, end, duration, easing]);

  // Reset for re-animation if needed
  const reset = () => {
    setCount(0);
    setIsVisible(false);
    setHasAnimated(false);
  };

  return {
    count,
    isVisible,
    elementRef,
    reset,
  };
}


