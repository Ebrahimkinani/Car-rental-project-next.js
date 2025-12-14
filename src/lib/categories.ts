// TODO: This file is deprecated and will be removed
// All category functionality has been moved to the service layer
// Use categoriesApi from @/services/api/categories instead

import { Category } from "@/types";

// Legacy exports for backward compatibility during transition
// These will be removed once all components are updated to use the service layer

export const carBrands: Category[] = [];
export const vehicleTypes: Category[] = [];

export function getBrandById(_id: string): Category | undefined {
  console.warn("getBrandById is deprecated. Use categoriesApi.getById() instead.");
  return undefined;
}

export function getVehicleTypeById(_id: string): Category | undefined {
  console.warn("getVehicleTypeById is deprecated. Use categoriesApi.getById() instead.");
  return undefined;
}

export function getAllCategories(): Category[] {
  console.warn("getAllCategories is deprecated. Use categoriesApi.getAll() instead.");
  return [];
}

export function getCategoryById(_id: string): Category | undefined {
  console.warn("getCategoryById is deprecated. Use categoriesApi.getById() instead.");
  return undefined;
}

export function getBrandBySlug(_slug: string): Category | undefined {
  console.warn("getBrandBySlug is deprecated. Use categoriesApi.getBySlug() instead.");
  return undefined;
}

export function getVehicleTypeBySlug(_slug: string): Category | undefined {
  console.warn("getVehicleTypeBySlug is deprecated. Use categoriesApi.getBySlug() instead.");
  return undefined;
}