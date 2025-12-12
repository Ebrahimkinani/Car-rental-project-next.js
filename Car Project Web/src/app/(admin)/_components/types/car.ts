export type CarStatus = "available" | "rented" | "maintenance" | "reserved";

export type Car = {
  id: string;
  name: string;
  model: string;
  brand: string; // Car manufacturer brand
  brandId: string; // Reference to Brand Category
  categoryId?: string; // MongoDB category reference
  description: string;
  
  // Pricing
  price: number; // Daily rental price
  weeklyRate?: number;
  weeklyRateEnabled?: boolean;
  monthlyRate?: number;
  
  // Core specs
  seats: number;
  doors: number;
  luggageCapacity?: number; // in liters
  
  // Engine specs
  engineType?: string; // e.g., "V8", "Inline-6", "Electric Motor"
  horsepower?: number;
  acceleration?: number; // 0-60 mph in seconds
  topSpeed?: number; // in mph
  
  // Details
  images: string[];
  year?: number;
  location?: string;
  mileage?: number;
  fuelType?: "gasoline" | "diesel" | "electric" | "hybrid";
  transmission?: "manual" | "automatic";
  color?: string;
  features?: string[];
  
  // Availability
  available: boolean;
  status?: CarStatus;
  
  // Identifiers
  vin?: string;
  licensePlate?: string; // License plate
  branch?: "Doha" | "Al Wakrah" | "Al Khor";
  
  // Rental details
  rentalTerms?: string[];
  cancellationPolicy?: string;
  
  // Popular car feature
  isPopular?: boolean;
  popularSince?: Date | null;
  
  // MongoDB preparation fields
  createdAt: Date;
  updatedAt: Date;
};
