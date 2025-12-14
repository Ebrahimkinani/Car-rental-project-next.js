import { Car, PricingSettings } from "@/types";

/**
 * Default pricing settings
 */
export const DEFAULT_PRICING: PricingSettings = {
  weeklyDiscount: 0.15, // 15% discount for weekly rentals
  monthlyDiscount: 0.25, // 25% discount for monthly rentals
};

/**
 * Calculate weekly rate from daily price with discount
 * @param dailyPrice - Daily rental price
 * @param discount - Discount percentage (default 0.15 = 15%)
 * @returns Calculated weekly rate
 */
export function calculateWeeklyRate(
  dailyPrice: number,
  discount: number = DEFAULT_PRICING.weeklyDiscount
): number {
  const weeklyTotal = dailyPrice * 7;
  const discountAmount = weeklyTotal * discount;
  return Math.round((weeklyTotal - discountAmount) * 100) / 100;
}

/**
 * Calculate monthly rate from daily price with discount
 * @param dailyPrice - Daily rental price
 * @param discount - Discount percentage (default 0.25 = 25%)
 * @returns Calculated monthly rate
 */
export function calculateMonthlyRate(
  dailyPrice: number,
  discount: number = DEFAULT_PRICING.monthlyDiscount
): number {
  const monthlyTotal = dailyPrice * 30;
  const discountAmount = monthlyTotal * discount;
  return Math.round((monthlyTotal - discountAmount) * 100) / 100;
}

/**
 * Get the effective weekly rate for a car
 * Returns manual weeklyRate if enabled, otherwise calculates from daily price
 * @param car - Car object
 * @returns Effective weekly rate
 */
export function getEffectiveWeeklyRate(car: Car): number {
  if (car.weeklyRateEnabled && car.weeklyRate) {
    return car.weeklyRate;
  }
  return calculateWeeklyRate(car.price);
}

/**
 * Get the effective monthly rate for a car
 * Returns manual monthlyRate if exists, otherwise calculates from daily price
 * @param car - Car object
 * @returns Effective monthly rate
 */
export function getEffectiveMonthlyRate(car: Car): number {
  if (car.monthlyRate) {
    return car.monthlyRate;
  }
  return calculateMonthlyRate(car.price);
}

/**
 * Calculate savings for weekly rental
 * @param car - Car object
 * @returns Savings amount and percentage
 */
export function calculateWeeklySavings(car: Car): {
  amount: number;
  percentage: number;
} {
  const regularWeeklyPrice = car.price * 7;
  const weeklyRate = getEffectiveWeeklyRate(car);
  const amount = Math.round((regularWeeklyPrice - weeklyRate) * 100) / 100;
  const percentage = Math.round((amount / regularWeeklyPrice) * 100);
  
  return { amount, percentage };
}

/**
 * Calculate savings for monthly rental
 * @param car - Car object
 * @returns Savings amount and percentage
 */
export function calculateMonthlySavings(car: Car): {
  amount: number;
  percentage: number;
} {
  const regularMonthlyPrice = car.price * 30;
  const monthlyRate = getEffectiveMonthlyRate(car);
  const amount = Math.round((regularMonthlyPrice - monthlyRate) * 100) / 100;
  const percentage = Math.round((amount / regularMonthlyPrice) * 100);
  
  return { amount, percentage };
}

/**
 * Admin helper: Toggle weekly rate mode for a car
 * This would typically interact with a database/API
 * @param _carId - Car ID (unused in mock implementation)
 * @param useManual - Whether to use manual weekly rate
 * @param manualRate - Optional manual rate to set
 * @returns Updated pricing settings
 */
export function toggleWeeklyRateMode(
  _carId: string,
  useManual: boolean,
  manualRate?: number
): { weeklyRateEnabled: boolean; weeklyRate?: number } {
  // In a real application, this would update the database
  // For now, return the settings that should be applied
  return {
    weeklyRateEnabled: useManual,
    weeklyRate: useManual && manualRate ? manualRate : undefined,
  };
}

/**
 * Format currency
 * @param amount - Amount to format
 * @param currency - Currency code (default USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate total rental cost
 * @param car - Car object
 * @param days - Number of rental days
 * @returns Total cost
 */
export function calculateRentalCost(car: Car, days: number): number {
  if (days >= 30) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    const monthlyRate = getEffectiveMonthlyRate(car);
    return months * monthlyRate + remainingDays * car.price;
  } else if (days >= 7) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    const weeklyRate = getEffectiveWeeklyRate(car);
    return weeks * weeklyRate + remainingDays * car.price;
  } else {
    return days * car.price;
  }
}

