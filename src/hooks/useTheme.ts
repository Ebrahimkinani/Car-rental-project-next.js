/**
 * useTheme Hook
 * Dark/Light theme management with system preference detection
 */

"use client";

import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS, THEMES } from "@/lib/constants";
import type { Theme } from "@/types";

interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

/**
 * Custom hook for managing application theme
 * Supports light, dark, and system preferences
 */
export function useTheme(): UseThemeReturn {
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEYS.THEME, THEMES.SYSTEM);

  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? THEMES.DARK
      : THEMES.LIGHT;

    const effectiveTheme = theme === THEMES.SYSTEM ? systemTheme : theme;

    // Remove existing theme classes
    root.classList.remove(THEMES.LIGHT, THEMES.DARK);

    // Add the effective theme class
    root.classList.add(effectiveTheme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === THEMES.SYSTEM) {
        const root = window.document.documentElement;
        const systemTheme = mediaQuery.matches ? THEMES.DARK : THEMES.LIGHT;

        root.classList.remove(THEMES.LIGHT, THEMES.DARK);
        root.classList.add(systemTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === THEMES.LIGHT) return THEMES.DARK;
      if (prevTheme === THEMES.DARK) return THEMES.LIGHT;
      // If system, toggle to the opposite of current system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? THEMES.DARK
        : THEMES.LIGHT;
      return systemTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    });
  };

  return { theme, setTheme, toggleTheme };
}

