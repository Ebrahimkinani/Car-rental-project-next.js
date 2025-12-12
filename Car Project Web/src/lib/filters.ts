import { Car } from "@/types";

/**
 * Filter interface
 */
export interface CarFilters {
  brandId?: string;
  vehicleTypeId?: string;
  minPrice?: number;
  maxPrice?: number;
  seats?: number;
  doors?: number;
  transmission?: "manual" | "automatic";
  fuelType?: "gasoline" | "diesel" | "electric" | "hybrid";
  minHorsepower?: number;
  maxHorsepower?: number;
  availableOnly?: boolean;
  year?: number;
  color?: string;
}

/**
 * Filter cars by specifications
 * @param cars - Array of cars
 * @param specs - Specification filters
 * @returns Filtered cars
 */
export function filterCarsBySpecs(
  cars: Car[],
  specs: {
    seats?: number;
    doors?: number;
    transmission?: "manual" | "automatic";
    fuelType?: "gasoline" | "diesel" | "electric" | "hybrid";
  }
): Car[] {
  return cars.filter((car) => {
    if (specs.seats && car.seats !== specs.seats) return false;
    if (specs.doors && car.doors !== specs.doors) return false;
    if (specs.transmission && car.transmission !== specs.transmission) return false;
    if (specs.fuelType && car.fuelType !== specs.fuelType) return false;
    return true;
  });
}

/**
 * Filter cars by price range
 * @param cars - Array of cars
 * @param minPrice - Minimum price (optional)
 * @param maxPrice - Maximum price (optional)
 * @returns Filtered cars
 */
export function filterByPriceRange(
  cars: Car[],
  minPrice?: number,
  maxPrice?: number
): Car[] {
  return cars.filter((car) => {
    if (minPrice !== undefined && car.price < minPrice) return false;
    if (maxPrice !== undefined && car.price > maxPrice) return false;
    return true;
  });
}

/**
 * Filter by availability
 * @param cars - Array of cars
 * @returns Only available cars
 */
export function filterByAvailability(cars: Car[]): Car[] {
  return cars.filter((car) => car.available && car.status === "available");
}

/**
 * Filter by brand
 * @param cars - Array of cars
 * @param brandId - Brand ID
 * @returns Filtered cars
 */
export function filterByBrand(cars: Car[], brandId: string): Car[] {
  return cars.filter((car) => car.brandId === brandId);
}

/**
 * Filter by vehicle type (category)
 * @param cars - Array of cars
 * @param vehicleTypeId - Vehicle type/category ID
 * @returns Filtered cars
 */
export function filterByVehicleType(cars: Car[], vehicleTypeId: string): Car[] {
  return cars.filter((car) => car.categoryId === vehicleTypeId);
}

/**
 * Filter by horsepower range
 * @param cars - Array of cars
 * @param minHorsepower - Minimum horsepower (optional)
 * @param maxHorsepower - Maximum horsepower (optional)
 * @returns Filtered cars
 */
export function filterByHorsepower(
  cars: Car[],
  minHorsepower?: number,
  maxHorsepower?: number
): Car[] {
  return cars.filter((car) => {
    if (!car.horsepower) return false;
    if (minHorsepower !== undefined && car.horsepower < minHorsepower) return false;
    if (maxHorsepower !== undefined && car.horsepower > maxHorsepower) return false;
    return true;
  });
}

/**
 * Apply multiple filters
 * @param cars - Array of cars
 * @param filters - Filter object
 * @returns Filtered cars
 */
export function applyMultipleFilters(cars: Car[], filters: CarFilters): Car[] {
  let filteredCars = [...cars];

  // Filter by availability if requested
  if (filters.availableOnly) {
    filteredCars = filterByAvailability(filteredCars);
  }

  // Filter by brand
  if (filters.brandId) {
    filteredCars = filterByBrand(filteredCars, filters.brandId);
  }

  // Filter by vehicle type
  if (filters.vehicleTypeId) {
    filteredCars = filterByVehicleType(filteredCars, filters.vehicleTypeId);
  }

  // Filter by price range
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    filteredCars = filterByPriceRange(
      filteredCars,
      filters.minPrice,
      filters.maxPrice
    );
  }

  // Filter by specs
  const specs: any = {};
  if (filters.seats) specs.seats = filters.seats;
  if (filters.doors) specs.doors = filters.doors;
  if (filters.transmission) specs.transmission = filters.transmission;
  if (filters.fuelType) specs.fuelType = filters.fuelType;

  if (Object.keys(specs).length > 0) {
    filteredCars = filterCarsBySpecs(filteredCars, specs);
  }

  // Filter by horsepower
  if (filters.minHorsepower !== undefined || filters.maxHorsepower !== undefined) {
    filteredCars = filterByHorsepower(
      filteredCars,
      filters.minHorsepower,
      filters.maxHorsepower
    );
  }

  // Filter by year
  if (filters.year) {
    filteredCars = filteredCars.filter((car) => car.year === filters.year);
  }

  // Filter by color
  if (filters.color) {
    filteredCars = filteredCars.filter(
      (car) => car.color?.toLowerCase() === filters.color?.toLowerCase()
    );
  }

  return filteredCars;
}

/**
 * Sort cars
 */
export type SortOption =
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "year-desc"
  | "year-asc"
  | "horsepower-desc"
  | "horsepower-asc";

export function sortCars(cars: Car[], sortBy: SortOption): Car[] {
  const sorted = [...cars];

  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "year-desc":
      return sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
    case "year-asc":
      return sorted.sort((a, b) => (a.year || 0) - (b.year || 0));
    case "horsepower-desc":
      return sorted.sort((a, b) => (b.horsepower || 0) - (a.horsepower || 0));
    case "horsepower-asc":
      return sorted.sort((a, b) => (a.horsepower || 0) - (b.horsepower || 0));
    default:
      return sorted;
  }
}

