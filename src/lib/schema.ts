/**
 * Database Schema Definitions
 * Prisma-style schema for car rental system
 * This can be used as a reference for future database implementation
 */

/**
 * Example Prisma Schema (for reference):
 * 
 * model CarBrand {
 *   id          String   @id @default(uuid())
 *   name        String
 *   code        String   @unique
 *   description String?
 *   slug        String   @unique
 *   country     String?
 *   founded     Int?
 *   imageUrl    String?
 *   status      String   @default("Active")
 *   sortOrder   Int
 *   createdAt   DateTime @default(now())
 *   updatedAt   DateTime @updatedAt
 *   
 *   // Relations
 *   cars        Car[] @relation("BrandCars")
 *   
 *   @@index([slug])
 *   @@index([status, sortOrder])
 * }
 * 
 * model Car {
 *   id                String   @id @default(uuid())
 *   name              String
 *   model             String
 *   brand             String
 *   brandId           String
 *   description       String   @db.Text
 *   
 *   // Pricing
 *   price             Float    // daily rate
 *   weeklyRate        Float?
 *   weeklyRateEnabled Boolean  @default(false)
 *   monthlyRate       Float?
 *   
 *   // Core specs
 *   seats             Int
 *   doors             Int
 *   luggageCapacity   Int?
 *   
 *
 *   
 *   // Details
 *   images            String[]
 *   year              Int?
 *   location          String?
 *   mileage           Int?
 *   fuelType          String?  // enum: gasoline, diesel, electric, hybrid
 *   transmission      String?  // enum: manual, automatic
 *   color             String?
 *   features          String[]
 *   
 *   // Availability
 *   available         Boolean  @default(true)
 *   status            String?  // enum: available, rented, maintenance, reserved
 *   
 *   // Optional identifiers
 *   vin               String?  @unique
 *   licensePlate      String?  @unique
 *   
 *   // Rental details
 *   rentalType        String?
 *   pickupLocation    String?
 *   returnLocation    String?
 *   minRentalDays     Int?
 *   maxRentalDays     Int?
 *   insuranceIncluded Boolean  @default(false)
 *   unlimitedMileage  Boolean  @default(false)
 *   rentalTerms       String[]
 *   cancellationPolicy String? @db.Text
 *   
 *   createdAt         DateTime @default(now())
 *   updatedAt         DateTime @updatedAt
 *   
 *   // Relations
 *   brandCategory     CarBrand @relation("BrandCars", fields: [brandId], references: [id])
 *   
 *   @@index([brandId])
 *   @@index([status])
 *   @@index([available])
 *   @@index([fuelType])
 *   @@index([transmission])
 *   @@index([price])
 * }
 * 
 * model Booking {
 *   id              String   @id @default(uuid())
 *   carId           String
 *   userId          String
 *   pickupDate      DateTime
 *   returnDate      DateTime
 *   totalDays       Int
 *   dailyRate       Float
 *   totalAmount     Float
 *   status          String   // pending, confirmed, completed, cancelled
 *   pickupLocation  String
 *   returnLocation  String?
 *   createdAt       DateTime @default(now())
 *   updatedAt       DateTime @updatedAt
 *   
 *   @@index([carId])
 *   @@index([userId])
 *   @@index([status])
 *   @@index([pickupDate])
 * }
 */

// TypeScript schema types for validation
export const CarSchema = {
  required: ['id', 'name', 'model', 'brand', 'brandId', 'description', 'price', 'seats', 'doors', 'available'],
  optional: [
    'weeklyRate', 'weeklyRateEnabled', 'monthlyRate',
    'luggageCapacity', 'engineType', 'horsepower', 'acceleration', 'topSpeed',
    'images', 'year', 'location', 'mileage', 'fuelType', 'transmission', 'color', 'features',
    'status', 'vin', 'licensePlate', 'rentalType', 'pickupLocation', 'returnLocation',
    'minimumRentalDays', 'maximumRentalDays', 'insuranceIncluded', 'unlimitedMileage',
    'rentalTerms', 'cancellationPolicy'
  ]
};

export const BrandSchema = {
  required: ['id', 'name', 'code', 'slug', 'status', 'sortOrder'],
  optional: ['description', 'country', 'founded', 'imageUrl']
};

