# Car Module System Documentation

## Overview

This document describes the comprehensive car module system implemented for the car rental application. The system includes detailed car properties, dual-category organization (brands and vehicle types), flexible pricing with admin controls, and database-ready schema.

## Table of Contents

1. [Type Definitions](#type-definitions)
2. [Category System](#category-system)
3. [Car Properties](#car-properties)
4. [Pricing System](#pricing-system)
5. [Database Schema](#database-schema)
6. [Services](#services)
7. [Filtering & Search](#filtering--search)
8. [UI Components](#ui-components)
9. [Admin Features](#admin-features)

---

## Type Definitions

### Car Interface

Located in `types/index.ts`, the Car interface includes:

#### Core Properties
- `id`: Unique identifier
- `name`: Full car name
- `model`: Car model
- `brand`: Brand name (string)
- `brandId`: Reference to brand category
- `vehicleTypeId`: Reference to vehicle type category
- `description`: Detailed description

#### Pricing
- `price`: Daily rental rate
- `weeklyRate`: Optional manual weekly rate
- `weeklyRateEnabled`: Toggle for manual vs auto-calculated weekly rate
- `monthlyRate`: Optional monthly rate

#### Specifications
- `seats`: Number of passengers (2-7)
- `doors`: Number of doors (2-5)
- `luggageCapacity`: Cargo space in liters
- `engineType`: Engine description (e.g., "3.0L Twin-Turbo V6")
- `horsepower`: Engine power
- `acceleration`: 0-60 mph time in seconds
- `topSpeed`: Maximum speed in mph
- `transmission`: "manual" | "automatic"
- `fuelType`: "gasoline" | "diesel" | "electric" | "hybrid"

#### Additional Properties
- `images`: Array of image URLs
- `year`: Model year
- `location`: Pickup location
- `mileage`: Current mileage
- `color`: Exterior color
- `features`: Array of feature descriptions
- `available`: Boolean availability status
- `status`: "available" | "rented" | "maintenance" | "reserved"
- `vin`: Vehicle Identification Number (optional)
- `licensePlate`: License plate (optional)
- Rental terms and policies

### Category Types

#### CarCategory (Base)
```typescript
{
  id: string;
  name: string;
  type: "brand" | "vehicle-type";
  description?: string;
  slug: string;
}
```

#### CarBrand (extends CarCategory)
```typescript
{
  type: "brand";
  country?: string;
  founded?: number;
}
```

#### VehicleType (extends CarCategory)
```typescript
{
  type: "vehicle-type";
  capacity?: string; // e.g., "2-5 passengers"
}
```

---

## Category System

### Brands (`lib/categories.ts`)

The system includes 10 luxury car brands:
- BMW (Germany, 1916)
- Mercedes-Benz (Germany, 1926)
- Audi (Germany, 1909)
- Porsche (Germany, 1931)
- Ferrari (Italy, 1939)
- Lamborghini (Italy, 1963)
- McLaren (UK, 1963)
- Tesla (USA, 2003)
- Bentley (UK, 1919)
- Rolls-Royce (UK, 1904)

### Vehicle Types

10 vehicle type categories:
- SUV - Sport Utility Vehicle
- Sedan - Four-door passenger car
- Sports Car - High-performance vehicles
- Luxury - Premium comfort vehicles
- Electric - Battery-powered vehicles
- Hybrid - Electric + gasoline power
- Convertible - Retractable roof vehicles
- Wagon - Extended body with cargo area
- Coupe - Two-door sporty styling
- Supercar - Extreme performance exotics

### Helper Functions

```typescript
getBrandById(id: string): CarBrand | undefined
getVehicleTypeById(id: string): VehicleType | undefined
getAllCategories(): CarCategory[]
getCategoryById(id: string): CarCategory | undefined
getBrandBySlug(slug: string): CarBrand | undefined
getVehicleTypeBySlug(slug: string): VehicleType | undefined
```

---

## Car Properties

### Sample Data (`lib/sampleData.ts`)

The system includes 15 diverse sample cars covering:
- Different brands (BMW, Mercedes, Audi, Porsche, Tesla, Ferrari, etc.)
- Various vehicle types (Sedan, Sports, SUV, Luxury, Electric, etc.)
- Price range: $350 - $900 per day
- Seats: 2-5 passengers
- Horsepower: 379 - 1020 HP
- Performance specs (acceleration, top speed)

Each car includes:
- Complete specifications
- Multiple images
- Detailed descriptions
- Rental terms and policies
- Category relationships

---

## Pricing System

### Pricing Utilities (`lib/pricing.ts`)

#### Default Settings
- Weekly Discount: 15%
- Monthly Discount: 25%

#### Key Functions

**calculateWeeklyRate(dailyPrice, discount)**
- Auto-calculates weekly rate from daily price
- Default 15% discount

**calculateMonthlyRate(dailyPrice, discount)**
- Auto-calculates monthly rate
- Default 25% discount

**getEffectiveWeeklyRate(car)**
- Returns manual rate if enabled
- Otherwise returns calculated rate

**getEffectiveMonthlyRate(car)**
- Returns manual monthly rate if set
- Otherwise calculates from daily rate

**calculateWeeklySavings(car)**
- Returns amount and percentage saved

**calculateMonthlySavings(car)**
- Returns amount and percentage saved

**formatCurrency(amount, currency)**
- Formats numbers as currency

**calculateRentalCost(car, days)**
- Calculates total cost for rental period
- Optimizes for weekly/monthly rates

#### Admin Toggle

**toggleWeeklyRateMode(carId, useManual, manualRate?)**
- Switches between auto-calculated and manual weekly rates
- Sets custom rate when in manual mode

---

## Database Schema

### Prisma Schema Reference (`lib/schema.ts`)

The file includes complete Prisma-style schema definitions for:

#### CarCategory Model
- Stores both brands and vehicle types
- Indexed by type and slug
- Relations to cars

#### Car Model
- All car properties with appropriate types
- Foreign keys to brand and vehicle type categories
- Indexes for performance:
  - brandId, vehicleTypeId
  - status, available
  - fuelType, transmission
  - price

#### Booking Model (for future implementation)
- Links cars to users
- Tracks rental periods and pricing
- Status tracking

---

## Services

### Car Service (`services/cars/cars.service.ts`)

#### Core Functions

**getCarById(id: string): Car | null**
- Retrieve single car by ID

**getAllCars(): Car[]**
- Get all available cars

**getCarsByCategory(categoryId: string): Car[]**
- Filter by brand OR vehicle type

**getCarsByBrand(brandId: string): Car[]**
- Filter by specific brand

**getCarsByVehicleType(typeId: string): Car[]**
- Filter by vehicle type

**getRelatedCars(carId: string, limit: number): Car[]**
- Smart related car suggestions
- Prioritizes same vehicle type
- Then same brand
- Finally similar price range

**searchCars(query: string): Car[]**
- Multi-field search
- Searches: name, model, brand, description, color, fuel type, engine type, features

**getCarSpecs(carId: string)**
- Returns detailed specifications object

**updateCarPricing(carId: string, pricingData)**
- Admin function to update pricing
- Validates pricing data

**getFilteredCars(filters)**
- Apply multiple filters simultaneously
- Supports: brand, vehicle type, price range, seats, fuel type, transmission, availability

---

## Filtering & Search

### Filter Utilities (`lib/filters.ts`)

#### Filter Interface
```typescript
{
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
```

#### Filter Functions

**filterCarsBySpecs(cars, specs)**
- Filter by seats, doors, transmission, fuel type

**filterByPriceRange(cars, minPrice?, maxPrice?)**
- Price range filtering

**filterByAvailability(cars)**
- Only available cars

**filterByBrand(cars, brandId)**
- Brand-specific filtering

**filterByVehicleType(cars, vehicleTypeId)**
- Type-specific filtering

**filterByHorsepower(cars, min?, max?)**
- Performance-based filtering

**applyMultipleFilters(cars, filters)**
- Combines all filter types
- Single function for complex filtering

#### Sorting

**sortCars(cars, sortBy: SortOption)**

Sort options:
- `price-asc` / `price-desc`
- `name-asc` / `name-desc`
- `year-desc` / `year-asc`
- `horsepower-desc` / `horsepower-asc`

---

## UI Components

### Category Component (`components/carGrid/Catogery.tsx`)

Features:
- Toggle between "Brands" and "Vehicle Types" view
- Interactive category selection
- Shows country for brands, capacity for vehicle types
- Visual feedback for selected category
- Horizontal scrollable layout

### Car Grid (`components/carGrid/CarGrid.tsx`)

Displays:
- Brand and vehicle type badges on images
- Car name and model
- Quick specs (seats, transmission, horsepower)
- Daily pricing
- Responsive grid layout
- Hover effects and transitions

### Car Info Panel (`components/carDetails/CarInfoPanel.tsx`)

Enhanced with:
- Brand and vehicle type badges
- Model display
- Complete specifications grid:
  - Seats, doors
  - Transmission, fuel type
  - Horsepower, acceleration, top speed
  - Luggage capacity, mileage, color
-
- Detailed descriptions

### Price Display (`components/carDetails/PriceDisplay.tsx`)

Shows:
- Daily rate (formatted)
- Weekly rate with savings percentage
- Monthly rate with savings percentage
- Uses pricing utilities for calculations
- Displays auto vs manual rates correctly

---

## Admin Features

### Pricing Toggle Component (`components/admin/PricingToggle.tsx`)

Admin interface for weekly rate management:

#### Features
- Visual toggle between auto/manual modes
- Current daily rate display
- Auto-calculated rate with discount info
- Custom rate input with validation
- Preview of both rates
- Difference calculation from auto rate
- Save/Reset functionality

#### Usage
```tsx
<PricingToggle 
  car={car}
  onUpdate={(carId, weeklyRateEnabled, customWeeklyRate) => {
    // Handle pricing update
  }}
/>
```

---

## Usage Examples

### Getting Cars by Category

```typescript
import { getCarsByBrand, getCarsByVehicleType } from '@/services/cars/cars.service';

// Get all BMW cars
const bmwCars = getCarsByBrand('brand-bmw');

// Get all electric vehicles
const electricCars = getCarsByVehicleType('type-electric');
```

### Applying Filters

```typescript
import { applyMultipleFilters } from '@/lib/filters';
import { sampleCars } from '@/lib/sampleData';

const filteredCars = applyMultipleFilters(sampleCars, {
  brandId: 'brand-porsche',
  minPrice: 400,
  maxPrice: 600,
  seats: 4,
  fuelType: 'gasoline',
  availableOnly: true
});
```

### Calculating Rental Costs

```typescript
import { calculateRentalCost, formatCurrency } from '@/lib/pricing';

const car = getCarById('1');
const days = 14;
const totalCost = calculateRentalCost(car, days);

console.log(formatCurrency(totalCost)); // "$4,200"
```

### Searching Cars

```typescript
import { searchCars } from '@/services/cars/cars.service';

// Search across multiple fields
const results = searchCars('electric'); // Finds Teslas, electric type cars
const bmwResults = searchCars('BMW'); // Finds all BMW vehicles
const fastCars = searchCars('turbo'); // Finds cars with turbo in name/description
```

---

## Future Enhancements

1. **Database Integration**
   - Implement Prisma schema
   - Connect to PostgreSQL/MySQL
   - Real-time data updates

2. **Advanced Filtering UI**
   - Filter sidebar component
   - Multi-select filters
   - Price range slider

3. **Booking System**
   - Calendar integration
   - Availability checking
   - Booking management

4. **Admin Dashboard**
   - Full CRUD operations
   - Analytics and reporting
   - Inventory management

5. **Image Management**
   - Upload functionality
   - Image optimization
   - Gallery management

---

## File Structure

```
/lib
  - categories.ts         # Category data and helpers
  - pricing.ts           # Pricing calculations
  - filters.ts           # Filter utilities
  - sampleData.ts        # Sample car data
  - schema.ts            # Database schema reference

/types
  - index.ts             # TypeScript type definitions

/services/cars
  - cars.service.ts      # Car service layer

/components
  /carGrid
    - Catogery.tsx       # Category toggle component
    - CarGrid.tsx        # Car grid display
  /carDetails
    - CarInfoPanel.tsx   # Detailed car info
    - PriceDisplay.tsx   # Pricing display
  /admin
    - PricingToggle.tsx  # Admin pricing control
```

---

## Summary

The car module system provides:

✅ **Complete Car Properties**: 20+ properties per car including specs, pricing, and details  
✅ **Dual Category System**: Brands (10) and Vehicle Types (10) with full metadata  
✅ **Flexible Pricing**: Auto-calculated with admin manual override capability  
✅ **Database Ready**: Prisma schema with proper relations and indexes  
✅ **Rich Filtering**: Multi-criteria filtering and search  
✅ **Professional UI**: Modern components with all specs displayed  
✅ **15 Sample Cars**: Diverse collection covering all categories  
✅ **Type Safety**: Full TypeScript support throughout  
✅ **Scalable Architecture**: Clean separation of concerns  

The system is production-ready and can be easily connected to a real database when needed.

