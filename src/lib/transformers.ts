/**
 * API Transformation Helpers
 * Centralized field mapping between database and API responses
 */

import { Car, Category, CarStatus } from '@/types';

/**
 * Transform database car document to API format
 */
export function transformCarForAPI(dbCar: any): Car {
  // Handle categoryId - it could be an ObjectId or a populated object
  const categoryId = dbCar.categoryId ? 
    (typeof dbCar.categoryId === 'object' && dbCar.categoryId._id ? 
      dbCar.categoryId._id.toString() : 
      dbCar.categoryId.toString()) : 
    undefined;

  return {
    id: dbCar._id.toString(),
    name: dbCar.name,
    model: dbCar.model,
    brand: dbCar.brand,
    brandId: dbCar.brand, // Use brand string as brandId for now
    categoryId: categoryId,
    description: dbCar.description,
    price: dbCar.price,
    weeklyRate: dbCar.weeklyRate,
    weeklyRateEnabled: dbCar.weeklyRateEnabled,
    monthlyRate: dbCar.monthlyRate,
    seats: dbCar.seats,
    doors: dbCar.doors,
    luggageCapacity: dbCar.luggageCapacity,
    engineType: dbCar.engineType,
    horsepower: dbCar.horsepower,
    acceleration: dbCar.acceleration,
    topSpeed: dbCar.topSpeed,
    images: dbCar.images || [],
    year: dbCar.year,
    location: dbCar.location,
    mileage: dbCar.mileage,
    fuelType: dbCar.fuelType,
    transmission: dbCar.transmission,
    color: dbCar.color,
    features: dbCar.features || [],
    available: dbCar.available,
    status: transformStatusForAPI(dbCar.status),
    vin: dbCar.vin,
    licensePlate: dbCar.licensePlate,
    branch: dbCar.branch,
    rentalTerms: dbCar.rentalTerms || [],
    cancellationPolicy: dbCar.cancellationPolicy,
    isPopular: dbCar.isPopular,
    popularSince: dbCar.popularSince,
    createdAt: dbCar.createdAt,
    updatedAt: dbCar.updatedAt,
  };
}

/**
 * Transform API car data to database format
 */
export function transformCarFromAPI(apiCar: Partial<Car>): any {
  const dbCar: any = {
    name: apiCar.name,
    model: apiCar.model,
    brand: apiCar.brand,
    categoryId: apiCar.categoryId, // Use categoryId directly as it's now properly set
    description: apiCar.description,
    price: apiCar.price,
    weeklyRate: apiCar.weeklyRate,
    weeklyRateEnabled: apiCar.weeklyRateEnabled,
    monthlyRate: apiCar.monthlyRate,
    seats: apiCar.seats,
    doors: apiCar.doors,
    luggageCapacity: apiCar.luggageCapacity,
    engineType: apiCar.engineType,
    horsepower: apiCar.horsepower,
    acceleration: apiCar.acceleration,
    topSpeed: apiCar.topSpeed,
    images: apiCar.images || [],
    year: apiCar.year,
    location: apiCar.location,
    mileage: apiCar.mileage,
    fuelType: apiCar.fuelType,
    transmission: apiCar.transmission,
    color: apiCar.color,
    features: apiCar.features || [],
    available: apiCar.available !== undefined ? apiCar.available : true,
    status: transformStatusFromAPI(apiCar.status),
    vin: apiCar.vin,
    licensePlate: apiCar.licensePlate,
    branch: apiCar.branch,
    rentalTerms: apiCar.rentalTerms || [],
    cancellationPolicy: apiCar.cancellationPolicy,
    isPopular: apiCar.isPopular,
    popularSince: apiCar.popularSince,
  };

  // Remove undefined values and ensure required fields have defaults
  Object.keys(dbCar).forEach(key => {
    if (dbCar[key] === undefined) {
      delete dbCar[key];
    }
  });

  // Ensure required fields have proper defaults
  if (!dbCar.available) {
    dbCar.available = true;
  }
  
  if (!dbCar.status) {
    dbCar.status = 'available';
  }
  
  if (!dbCar.images) {
    dbCar.images = [];
  }
  
  if (!dbCar.features) {
    dbCar.features = [];
  }
  
  if (!dbCar.rentalTerms) {
    dbCar.rentalTerms = [];
  }

  return dbCar;
}

/**
 * Transform database category document to API format
 */
export function transformCategoryForAPI(dbCategory: any): Category {
  return {
    id: dbCategory._id.toString(),
    name: dbCategory.name,
    code: dbCategory.code,
    slug: dbCategory.slug,
    status: dbCategory.status || (dbCategory.isActive ? "Active" : "Hidden"),
    sortOrder: dbCategory.sortOrder || 0,
    description: dbCategory.description,
    defaultDailyRate: dbCategory.defaultDailyRate,
    seats: dbCategory.seats,
    imageUrl: dbCategory.imageUrl,
    country: dbCategory.country,
    founded: dbCategory.founded,
    capacity: dbCategory.capacity,
    createdAt: dbCategory.createdAt,
    updatedAt: dbCategory.updatedAt,
  };
}

/**
 * Transform API category data to database format
 */
export function transformCategoryFromAPI(apiCategory: Partial<Category>): any {
  const dbCategory: any = {
    name: apiCategory.name,
    code: apiCategory.code,
    slug: apiCategory.slug,
    status: apiCategory.status || "Active",
    sortOrder: apiCategory.sortOrder || 0,
    description: apiCategory.description,
    defaultDailyRate: apiCategory.defaultDailyRate,
    seats: apiCategory.seats,
    imageUrl: apiCategory.imageUrl,
    country: apiCategory.country,
    founded: apiCategory.founded,
    capacity: apiCategory.capacity,
  };

  // Remove undefined values
  Object.keys(dbCategory).forEach(key => {
    if (dbCategory[key] === undefined) {
      delete dbCategory[key];
    }
  });

  return dbCategory;
}

/**
 * Transform database status to API status (lowercase → lowercase)
 */
function transformStatusForAPI(dbStatus?: string): CarStatus {
  if (!dbStatus) return 'available';
  
  const statusMap: Record<string, CarStatus> = {
    'available': 'available',
    'rented': 'rented',
    'maintenance': 'maintenance',
    'reserved': 'reserved',
    // Support old capitalized values for backward compatibility
    'Available': 'available',
    'Rented': 'rented',
    'Maintenance': 'maintenance',
    'Inactive': 'reserved',
  };
  
  return statusMap[dbStatus] || 'available';
}

/**
 * Transform API status to database status (lowercase → lowercase for database)
 */
function transformStatusFromAPI(apiStatus?: CarStatus): string {
  if (!apiStatus) return 'available';
  
  const statusMap: Record<CarStatus, string> = {
    'available': 'available',
    'rented': 'rented',
    'maintenance': 'maintenance',
    'reserved': 'reserved',
  };
  
  return statusMap[apiStatus] || 'available';
}

/**
 * Transform array of database cars to API format
 */
export function transformCarsForAPI(dbCars: any[]): Car[] {
  return dbCars.map(transformCarForAPI);
}

/**
 * Transform array of database categories to API format
 */
export function transformCategoriesForAPI(dbCategories: any[]): Category[] {
  return dbCategories.map(transformCategoryForAPI);
}
