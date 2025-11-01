/**
 * useLocalStorage Hook
 * Persistent state management with localStorage
 */

"use client";

import { useState, useEffect } from "react";

/**
 * Clean up corrupted localStorage data
 * Removes invalid JSON entries that might cause parse errors
 */
function cleanupCorruptedData(key: string): void {
  if (typeof window === "undefined") return;
  
  try {
    const item = window.localStorage.getItem(key);
    if (item && !item.startsWith('"') && !item.startsWith('{') && !item.startsWith('[')) {
      // If it's not valid JSON, remove it
      window.localStorage.removeItem(key);
      console.warn(`Removed corrupted localStorage data for key "${key}":`, item);
    }
  } catch (error) {
    // If we can't even check, remove it to be safe
    window.localStorage.removeItem(key);
    console.warn(`Removed potentially corrupted localStorage data for key "${key}"`);
  }
}

type SetValue<T> = (value: T | ((val: T) => T)) => void;

/**
 * Custom hook for using localStorage with React state
 * @param key - The localStorage key
 * @param initialValue - The initial value if no value exists in localStorage
 * @returns [storedValue, setValue] - Tuple with current value and setter function
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    // Clean up any corrupted data first
    cleanupCorruptedData(key);

    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      
      // Handle case where value might be stored without quotes (e.g., "light" instead of '"light"')
      if (item === "light" || item === "dark" || item === "system") {
        return item as T;
      }
      
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue: SetValue<T> = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen to storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          // Handle case where value might be stored without quotes (e.g., "light" instead of '"light"')
          if (e.newValue === "light" || e.newValue === "dark" || e.newValue === "system") {
            setStoredValue(e.newValue as T);
          } else {
            setStoredValue(JSON.parse(e.newValue) as T);
          }
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

