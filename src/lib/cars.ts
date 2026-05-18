import { Car } from "@/types";
import { USE_MOCK_DATA } from "@/lib/data-source";
import {
  getStoreCars,
  getStoreCarById,
  addStoreCar,
  updateStoreCar,
  deleteStoreCar,
} from "@/lib/mock-store";

// Temporary mock data mode for UI/UX client preview. Replace with database queries later.

export async function getCars(): Promise<Car[]> {
  if (USE_MOCK_DATA) {
    return getStoreCars();
  }

  /* DATABASE_MODE — uncomment when reconnecting MongoDB
  try {
    const { dbConnect } = await import("@/lib/mongodb");
    const { Car: CarModel } = await import("@/models/Car");
    const { transformCarsForAPI } = await import("@/lib/transformers");

    await dbConnect();
    const cars = await CarModel.find({}).populate("categoryId", "name slug").lean();
    return transformCarsForAPI(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
  */
  return [];
}

export async function getFeaturedCars(): Promise<Car[]> {
  const cars = await getCars();
  return cars.filter((c) => c.isPopular === true);
}

export async function getCarById(id: string): Promise<Car | null> {
  if (USE_MOCK_DATA) {
    return getStoreCarById(id);
  }

  /* DATABASE_MODE
  try {
    const { dbConnect } = await import("@/lib/mongodb");
    const { Car: CarModel } = await import("@/models/Car");
    const { transformCarForAPI } = await import("@/lib/transformers");

    await dbConnect();
    const car = await CarModel.findById(id).populate("categoryId", "name slug").lean();
    if (!car) return null;
    return transformCarForAPI(car);
  } catch (error) {
    console.error("Error fetching car:", error);
    return null;
  }
  */
  return null;
}

export async function getCarsByCategory(categoryId: string): Promise<Car[]> {
  const cars = await getCars();
  return cars.filter((c) => c.categoryId === categoryId);
}

export async function getCarsByBrand(brandId: string): Promise<Car[]> {
  const cars = await getCars();
  return cars.filter((c) => c.brandId === brandId);
}

export async function getRelatedCars(
  carId: string,
  limit = 4
): Promise<Car[]> {
  const current = await getCarById(carId);
  if (!current?.categoryId) return [];

  const cars = await getCars();
  return cars
    .filter((c) => c.id !== carId && c.categoryId === current.categoryId)
    .slice(0, limit);
}

// Mock-mode CRUD (used by cars.service when USE_MOCK_DATA)
export async function createCarInStore(
  data: Omit<Car, "id" | "createdAt" | "updatedAt">
): Promise<Car> {
  return addStoreCar(data);
}

export async function updateCarInStore(
  id: string,
  updates: Partial<Omit<Car, "id" | "createdAt">>
): Promise<Car> {
  return updateStoreCar(id, updates);
}

export async function deleteCarFromStore(id: string): Promise<boolean> {
  return deleteStoreCar(id);
}
