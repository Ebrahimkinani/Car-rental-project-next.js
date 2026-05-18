import { Category } from "@/types";
import { USE_MOCK_DATA } from "@/lib/data-source";
import {
  getStoreCategories,
  getStoreCategoryById,
  getStoreCategoryBySlug,
  addStoreCategory,
  updateStoreCategory,
  deleteStoreCategory,
} from "@/lib/mock-store";

// Temporary mock data mode for UI/UX client preview. Replace with database queries later.

export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK_DATA) {
    return getStoreCategories();
  }

  /* DATABASE_MODE — use categories API / MongoDB when reconnecting
  return [];
  */
  return [];
}

export async function getActiveCategories(): Promise<Category[]> {
  const categories = await getCategories();
  return categories.filter((c) => c.status === "Active");
}

export async function getCategoryById(id: string): Promise<Category | null> {
  if (USE_MOCK_DATA) {
    return getStoreCategoryById(id);
  }
  return null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (USE_MOCK_DATA) {
    return getStoreCategoryBySlug(slug);
  }
  return null;
}

export async function createCategoryInStore(
  data: Omit<Category, "id" | "createdAt" | "updatedAt">
): Promise<Category> {
  return addStoreCategory(data);
}

export async function updateCategoryInStore(
  id: string,
  updates: Partial<Omit<Category, "id" | "createdAt">>
): Promise<Category> {
  return updateStoreCategory(id, updates);
}

export async function deleteCategoryFromStore(id: string): Promise<boolean> {
  return deleteStoreCategory(id);
}

// Legacy exports kept for any remaining imports
export const carBrands: Category[] = [];
export const vehicleTypes: Category[] = [];

export function getBrandById(id: string): Category | undefined {
  return getStoreCategoryById(id) ?? undefined;
}

export function getVehicleTypeById(id: string): Category | undefined {
  return getStoreCategoryById(id) ?? undefined;
}

export function getAllCategories(): Category[] {
  return getStoreCategories();
}

export function getCategoryByIdSync(id: string): Category | undefined {
  return getStoreCategoryById(id) ?? undefined;
}

export function getBrandBySlug(slug: string): Category | undefined {
  return getStoreCategoryBySlug(slug) ?? undefined;
}

export function getVehicleTypeBySlug(slug: string): Category | undefined {
  return getStoreCategoryBySlug(slug) ?? undefined;
}
