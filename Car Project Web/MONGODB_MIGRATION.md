# MongoDB Migration Guide

This document outlines the steps needed to migrate from localStorage to MongoDB for the Cars Project application.

## Current State

The application currently uses localStorage for data persistence with the following storage keys:
- `car_rental_categories` - Stores category data
- `car_rental_cars` - Stores car data

## MongoDB Schema

### Categories Collection

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  code: String (required, unique),
  slug: String (required, unique, indexed),
  status: String (enum: ["Active", "Hidden"], default: "Active"),
  sortOrder: Number (required),
  description: String,
  defaultDailyRate: Number,
  seats: Number,
  imageUrl: String,
  country: String,
  founded: Number,
  capacity: String,
  createdAt: Date (default: new Date()),
  updatedAt: Date (default: new Date())
}
```

**Indexes:**
- `{ slug: 1 }` (unique)
- `{ code: 1 }` (unique)
- `{ status: 1, sortOrder: 1 }`

### Cars Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  model: String (required),
  brand: String (required), // Display name
  categoryId: ObjectId (ref: "categories", required, indexed),
  description: String (required),
  price: Number (required), // Daily rate
  weeklyRate: Number,
  weeklyRateEnabled: Boolean,
  monthlyRate: Number,
  seats: Number (required),
  doors: Number (required),
  luggageCapacity: Number,
  engineType: String,
  horsepower: Number,
  acceleration: Number,
  topSpeed: Number,
  images: [String] (required),
  year: Number,
  location: String,
  mileage: Number,
  fuelType: String (enum: ["gasoline", "diesel", "electric", "hybrid"]),
  transmission: String (enum: ["manual", "automatic"]),
  color: String,
  features: [String],
  available: Boolean (required, default: true),
  status: String (enum: ["available", "rented", "maintenance", "reserved"]),
  vin: String,
  plate: String,
  branch: String (enum: ["Doha", "Al Wakrah", "Al Khor"]),
  rentalTerms: [String],
  cancellationPolicy: String,
  createdAt: Date (default: new Date()),
  updatedAt: Date (default: new Date())
}
```

**Indexes:**
- `{ categoryId: 1 }`
- `{ available: 1, status: 1 }`
- `{ price: 1 }`
- `{ brand: 1 }`
- `{ year: 1 }`
- `{ fuelType: 1 }`
- `{ transmission: 1 }`
- `{ location: 1 }`
- `{ branch: 1 }`

## Migration Steps

### 1. Set up MongoDB

1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `car_rental`
3. Create the collections and indexes as defined above

### 2. Create API Routes

Create the following API routes in `src/app/api/`:

- `src/app/api/categories/route.ts` - CRUD operations for categories
- `src/app/api/categories/[id]/route.ts` - Individual category operations
- `src/app/api/categories/slug/[slug]/route.ts` - Get category by slug
- `src/app/api/cars/route.ts` - CRUD operations for cars
- `src/app/api/cars/[id]/route.ts` - Individual car operations
- `src/app/api/cars/category/[categoryId]/route.ts` - Get cars by category

### 3. Update Service Layer

Replace the localStorage implementations in:
- `services/categories/categories.service.ts`
- `services/cars/cars.service.ts`

With HTTP calls to the new API routes.

### 4. Data Migration

Create a migration script to:
1. Read data from localStorage
2. Transform it to match MongoDB schema
3. Insert into MongoDB collections

### 5. Environment Variables

Add the following environment variables:
```
MONGODB_URI=mongodb://localhost:27017/car_rental
# or for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/car_rental
```

### 6. Dependencies

Install required dependencies:
```bash
npm install mongodb
# or
npm install mongoose
```

## Files to Update

### Service Files
- `services/categories/categories.service.ts` - Replace localStorage with API calls
- `services/cars/cars.service.ts` - Replace localStorage with API calls
- `services/api/categories.ts` - Update to use HTTP requests

### API Routes (New)
- `src/app/api/categories/route.ts`
- `src/app/api/categories/[id]/route.ts`
- `src/app/api/categories/slug/[slug]/route.ts`
- `src/app/api/cars/route.ts`
- `src/app/api/cars/[id]/route.ts`
- `src/app/api/cars/category/[categoryId]/route.ts`

### Configuration
- `.env.local` - Add MongoDB connection string
- `next.config.mjs` - Add any necessary configuration

## Testing

1. Test all CRUD operations for categories
2. Test all CRUD operations for cars
3. Test category-car relationships
4. Test search and filtering functionality
5. Test admin dashboard functionality

## Rollback Plan

If issues arise, the application can be rolled back by:
1. Reverting service files to localStorage implementation
2. Removing API routes
3. Restoring localStorage data from browser storage

## Performance Considerations

- Use MongoDB indexes for efficient queries
- Implement pagination for large datasets
- Consider caching frequently accessed data
- Use MongoDB aggregation for complex queries
