/**
 * Central Color Configuration
 * 
 * This file defines all colors used throughout the application.
 * Change the PRIMARY_BASE color to update the entire theme.
 */

/**
 * Base Primary Color - Change this to update the entire theme
 */
export const PRIMARY_BASE = '#0046FF';

/**
 * Color Generator
 * Generates a full color scale from a base color
 */
const hexToRgb = (hex: string): number[] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 70, 255];
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

const lighten = (hex: string, amount: number): string => {
  const rgb = hexToRgb(hex);
  const r = Math.min(255, rgb[0] + amount);
  const g = Math.min(255, rgb[1] + amount);
  const b = Math.min(255, rgb[2] + amount);
  return rgbToHex(r, g, b);
};

const darken = (hex: string, amount: number): string => {
  const rgb = hexToRgb(hex);
  const r = Math.max(0, rgb[0] - amount);
  const g = Math.max(0, rgb[1] - amount);
  const b = Math.max(0, rgb[2] - amount);
  return rgbToHex(r, g, b);
};

/**
 * Primary Color Scale
 * Generated from PRIMARY_BASE (#0046FF)
 */
export const PRIMARY_COLORS = {
  50: lighten(PRIMARY_BASE, 190),  // Very light
  100: lighten(PRIMARY_BASE, 150),
  200: lighten(PRIMARY_BASE, 100),
  300: lighten(PRIMARY_BASE, 60),
  400: lighten(PRIMARY_BASE, 30),
  500: PRIMARY_BASE,                // Base color
  600: darken(PRIMARY_BASE, 30),
  700: darken(PRIMARY_BASE, 60),
  800: darken(PRIMARY_BASE, 90),
  900: darken(PRIMARY_BASE, 120),
  950: darken(PRIMARY_BASE, 150),  // Very dark
};

/**
 * Chart Colors
 * These can be customized to match your brand
 */
export const CHART_COLORS = {
  primary: PRIMARY_BASE,
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#8B5CF6',
  secondary: '#6B7280',
};

/**
 * Neutral Colors
 * These can be overridden if needed
 */
export const NEUTRAL_COLORS = {
  gridStroke: '#f0f0f0',
  axisStroke: '#e0e0e0',
  textGray: '#666',
  white: '#ffffff',
};

/**
 * Get color value by key
 */
export const getColor = (colorKey: keyof typeof CHART_COLORS | keyof typeof NEUTRAL_COLORS): string => {
  if (colorKey in CHART_COLORS) {
    return CHART_COLORS[colorKey as keyof typeof CHART_COLORS];
  }
  return NEUTRAL_COLORS[colorKey as keyof typeof NEUTRAL_COLORS];
};

/**
 * Re-export common colors for convenience
 */
export const {
  50: primary50,
  100: primary100,
  200: primary200,
  300: primary300,
  400: primary400,
  500: primary500,
  600: primary600,
  700: primary700,
  800: primary800,
  900: primary900,
  950: primary950,
} = PRIMARY_COLORS;

