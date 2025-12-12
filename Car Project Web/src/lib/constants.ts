/**
 * Application-wide constants
 * Central location for configuration values
 */

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Cars Project";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Navigation links
 */
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/bookings", label: "My Bookings" },
  { href: "/favorites", label: "Favorites" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  USERS: "/users",
  PRODUCTS: "/products",
  FAVORITES: "/favorites",
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  THEME: "theme",
  USER: "user",
  TOKEN: "token",
  PREFERENCES: "preferences",
} as const;

/**
 * Theme values
 */
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

/**
 * Breakpoints (matching Tailwind defaults)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  GENERIC: "Something went wrong. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION: "Please check your input and try again.",
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  SAVED: "Changes saved successfully.",
  CREATED: "Created successfully.",
  UPDATED: "Updated successfully.",
  DELETED: "Deleted successfully.",
} as const;

