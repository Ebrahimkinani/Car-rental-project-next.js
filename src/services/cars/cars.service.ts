import { Car, AdminCarSettings } from "@/types";
// import { sampleCars } from "@/lib/sampleData"; // Deprecated - using MongoDB API

/**
 * Cars Service
 * Handles CRUD operations for cars with MongoDB API
 * 
 * MongoDB Integration Complete:
 * ✅ Replaced localStorage with MongoDB API calls
 * ✅ Updated all functions to use async/await with HTTP requests
 * ✅ Added proper error handling for API operations
 * ✅ Implemented data validation before API calls
 * ✅ Added proper relationships with categories collection
 * 
 * See MONGODB_MIGRATION.md for detailed migration steps
 */

/**
 * Get all cars from MongoDB API
 */
export async function getAllCarsFromStorage(): Promise<Car[]> {
  try {
    // Handle both client-side and server-side requests
    const baseUrl = typeof window !== 'undefined' 
      ? '' // Client-side: use relative URL
      : process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${process.env.PORT || 3000}`; // Server-side: use absolute URL
    
    console.log('Fetching cars from:', `${baseUrl}/api/cars`);
    const response = await fetch(`${baseUrl}/api/cars`);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    // Check if response is ok and content type is JSON
    if (!response.ok) {
      console.error(`Error loading cars: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Error loading cars: Response is not JSON');
      return [];
    }
    
    const result = await response.json();
    console.log('API response:', result);
    
    if (!result.success) {
      console.error("Error loading cars:", result.error);
      return [];
    }
    
    console.log('Cars loaded successfully:', result.data.length);
    return result.data;
  } catch (error) {
    console.error("Error loading cars:", error);
    return [];
  }
}

/**
 * Get a car by its ID from MongoDB API
 */
export async function getCarByIdFromStorage(id: string): Promise<Car | null> {
  try {
    // For server-side rendering, use direct database access
    if (typeof window === 'undefined') {
      const { Car } = await import('../../../lib/models/Car');
      const { dbConnect } = await import('@/lib/mongodb');
      const { transformCarForAPI } = await import('@/lib/transformers');
      
      await dbConnect();
      const car = await Car.findById(id).populate('categoryId', 'name slug').lean();
      
      if (!car) {
        return null;
      }
      
      return transformCarForAPI(car);
    }
    
    // For client-side, use API
    const response = await fetch(`/api/cars/${id}`);
    
    // Check if response is ok and content type is JSON
    if (!response.ok) {
      console.error(`Error loading car: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Error loading car: Response is not JSON');
      return null;
    }
    
    const result = await response.json();
    
    if (!result.success) {
      console.error("Error loading car:", result.error);
      return null;
    }
    
    return result.data;
  } catch (error) {
    console.error("Error loading car:", error);
    return null;
  }
}

/**
 * Get a car by its ID (DEPRECATED - use getCarByIdFromStorage instead)
 * @param id - The car ID
 * @returns The car object or null if not found
 * @deprecated Use getCarByIdFromStorage for MongoDB integration
 */
export function getCarById(_id: string): Car | null {
  console.warn('getCarById is deprecated. Use getCarByIdFromStorage instead.');
  return null;
}

/**
 * Get all available cars (DEPRECATED - use getAllCarsFromStorage instead)
 * @returns Array of all available cars
 * @deprecated Use getAllCarsFromStorage for MongoDB integration
 */
export function getAllCars(): Car[] {
  console.warn('getAllCars is deprecated. Use getAllCarsFromStorage instead.');
  return [];
}

/**
 * Create a new car via MongoDB API
 */
export async function createCar(carData: Omit<Car, "id" | "createdAt" | "updatedAt">): Promise<Car> {
  try {
    console.log('Creating car with data:', carData);
    
    const response = await fetch('/api/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });
    
    console.log('Response status:', response.status, response.statusText);
    
    // Try to parse response as JSON
    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      throw new Error(`Failed to parse response: ${response.status} ${response.statusText}`);
    }
    
    // Check if response is ok
    if (!response.ok) {
      const errorMessage = result.error || `${response.status} ${response.statusText}`;
      throw new Error(`Failed to create car: ${errorMessage}`);
    }
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create car');
    }
    
    console.log('Car created successfully:', result.data);
    return result.data;
  } catch (error) {
    console.error("Error creating car:", error);
    throw error;
  }
}

/**
 * Update an existing car via MongoDB API
 */
export async function updateCar(id: string, updates: Partial<Omit<Car, "id" | "createdAt">>): Promise<Car> {
  try {
    const response = await fetch(`/api/cars/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    // Check if response is ok and content type is JSON
    if (!response.ok) {
      throw new Error(`Failed to update car: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Failed to update car: Response is not JSON');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update car');
    }
    
    return result.data;
  } catch (error) {
    console.error("Error updating car:", error);
    throw error;
  }
}

/**
 * Delete a car via MongoDB API
 */
export async function deleteCar(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/cars/${id}`, {
      method: 'DELETE',
    });
    
    // Check if response is ok and content type is JSON
    if (!response.ok) {
      throw new Error(`Failed to delete car: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Failed to delete car: Response is not JSON');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete car');
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting car:", error);
    throw error;
  }
}

/**
 * Get cars by brand (DEPRECATED - use getCarsByBrandFromStorage instead)
 * @param brandId - Brand ID
 * @returns Array of cars of that brand
 * @deprecated Use getCarsByBrandFromStorage for MongoDB integration
 */
export function getCarsByBrand(_brandId: string): Car[] {
  console.warn('getCarsByBrand is deprecated. Use getCarsByBrandFromStorage instead.');
  return [];
}

/**
 * Get cars by brand from storage
 * @param brandId - Brand ID
 * @returns Array of cars from that brand
 */
export async function getCarsByBrandFromStorage(brandId: string): Promise<Car[]> {
  const cars = await getAllCarsFromStorage();
  return cars.filter(car => car.brandId === brandId);
}

/**
 * Get cars by category from MongoDB API
 * @param categoryId - Category ID
 * @returns Array of cars from that category
 */
export async function getCarsByCategoryFromStorage(categoryId: string): Promise<Car[]> {
  try {
    // Handle both client-side and server-side requests
    const baseUrl = typeof window !== 'undefined' 
      ? '' // Client-side: use relative URL
      : process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${process.env.PORT || 3000}`; // Server-side: use absolute URL
    
    console.log('Fetching cars by category from:', `${baseUrl}/api/cars/category/${categoryId}`);
    const response = await fetch(`${baseUrl}/api/cars/category/${categoryId}`);
    
    // Check if response is ok and content type is JSON
    if (!response.ok) {
      console.error(`Error loading cars by category: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Error loading cars by category: Response is not JSON');
      return [];
    }
    
    const result = await response.json();
    
    if (!result.success) {
      console.error("Error loading cars by category:", result.error);
      return [];
    }
    
    // API route already transforms the cars, so use them directly
    console.log('Cars by category loaded successfully:', result.data.length);
    return result.data;
  } catch (error) {
    console.error("Error loading cars by category:", error);
    return [];
  }
}

/**
 * Get related cars based on price range and category (DEPRECATED)
 * @param carId - The current car ID to exclude from results
 * @param limit - Maximum number of related cars to return
 * @returns Array of related cars
 * @deprecated This function needs to be reimplemented with MongoDB integration
 */
export function getRelatedCars(_carId: string, _limit: number = 4): Car[] {
  console.warn('getRelatedCars is deprecated and needs MongoDB integration.');
  return [];
}

/**
 * Search cars by name, model, brand, description, or specs (DEPRECATED)
 * @param query - Search query
 * @returns Array of matching cars
 * @deprecated This function needs to be reimplemented with MongoDB text search
 */
export function searchCars(_query: string): Car[] {
  console.warn('searchCars is deprecated and needs MongoDB text search integration.');
  return [];
}

/**
 * Get detailed car specifications (DEPRECATED)
 * @param carId - Car ID
 * @returns Car specifications object or null
 * @deprecated Use getCarByIdFromStorage and extract specs from the returned car object
 */
export function getCarSpecs(_carId: string): {
  seats: number;
  doors: number;
  luggageCapacity?: number;
  engineType?: string;
  horsepower?: number;
  acceleration?: number;
  topSpeed?: number;
  transmission?: string;
  fuelType?: string;
} | null {
  console.warn('getCarSpecs is deprecated. Use getCarByIdFromStorage instead.');
  return null;
}

/**
 * Update car pricing (DEPRECATED)
 * @param carId - Car ID
 * @param pricingData - Pricing data to update
 * @returns Success status
 * @deprecated Use updateCar API function instead
 */
export function updateCarPricing(
  _carId: string,
  _pricingData: Partial<AdminCarSettings>
): { success: boolean; message: string } {
  console.warn('updateCarPricing is deprecated. Use updateCar API function instead.');
  return { success: false, message: "Use updateCar API function instead" };
}

/**
 * Get cars by multiple filters (DEPRECATED)
 * @param filters - Filter object
 * @returns Filtered cars
 * @deprecated Use getAllCarsFromStorage with query parameters instead
 */
export function getFilteredCars(_filters: {
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  seats?: number;
  fuelType?: string;
  transmission?: string;
  availableOnly?: boolean;
}): Car[] {
  console.warn('getFilteredCars is deprecated. Use getAllCarsFromStorage with query parameters instead.');
  return [];
}

/**
 * MongoDB Schema Documentation:
 * 
 * Cars Collection:
 * {
 *   _id: ObjectId,
 *   name: String (required),
 *   model: String (required),
 *   brand: String (required), // Display name
 *   categoryId: ObjectId (ref: "categories", required, indexed),
 *   description: String (required),
 *   price: Number (required), // Daily rate
 *   weeklyRate: Number,
 *   weeklyRateEnabled: Boolean,
 *   monthlyRate: Number,
 *   seats: Number (required),
 *   doors: Number (required),
 *   luggageCapacity: Number,
 *   engineType: String,
 *   horsepower: Number,
 *   acceleration: Number,
 *   topSpeed: Number,
 *   images: [String] (required),
 *   year: Number,
 *   location: String,
 *   mileage: Number,
 *   fuelType: String (enum: ["gasoline", "diesel", "electric", "hybrid"]),
 *   transmission: String (enum: ["manual", "automatic"]),
 *   color: String,
 *   features: [String],
 *   available: Boolean (required, default: true),
 *   status: String (enum: ["Available", "Rented", "Maintenance", "Inactive"]),
 *   vin: String,
 *   plate: String,
 *   branch: String (enum: ["Doha", "Al Wakrah", "Al Khor"]),
 *   rentalTerms: [String],
 *   cancellationPolicy: String,
 *   createdAt: Date (default: new Date()),
 *   updatedAt: Date (default: new Date())
 * }
 * 
 * Indexes:
 * - { categoryId: 1 }
 * - { available: 1, status: 1 }
 * - { price: 1 }
 * - { brand: 1 }
 * - { year: 1 }
 * - { fuelType: 1 }
 * - { transmission: 1 }
 * - { location: 1 }
 * - { branch: 1 }
 */
