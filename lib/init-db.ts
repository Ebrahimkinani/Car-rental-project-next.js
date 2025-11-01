import { dbConnect } from '../src/lib/mongodb';
import { Category } from './models/Category';
import { Car } from './models/Car';

/**
 * Initialize MongoDB with sample data
 * This script should be run once to set up the database
 */
export async function initializeDatabase() {
  try {
    await dbConnect();
    
    console.log('Database connected successfully');
    
    // Check if categories already exist
    const categoriesCount = await Category.countDocuments();
    if (categoriesCount === 0) {
      // Insert default categories using Mongoose
      const defaultCategories = [
        {
          name: "BMW",
          code: "BMW",
          slug: "bmw",
          status: "Active",
          sortOrder: 1,
          description: "Bavarian Motor Works - German luxury vehicles",
          country: "Germany",
          founded: 1916,
          imageUrl: "/images/brands/bmw.jpg"
        },
        {
          name: "Mercedes-Benz",
          code: "MERCEDES",
          slug: "mercedes-benz",
          status: "Active",
          sortOrder: 2,
          description: "German luxury and commercial vehicles",
          country: "Germany",
          founded: 1926,
          imageUrl: "/images/brands/mercedes.jpg"
        },
        {
          name: "Audi",
          code: "AUDI",
          slug: "audi",
          status: "Active",
          sortOrder: 3,
          description: "German luxury vehicles with advanced technology",
          country: "Germany",
          founded: 1909,
          imageUrl: "/images/brands/audi.jpg"
        },
        {
          name: "Porsche",
          code: "PORSCHE",
          slug: "porsche",
          status: "Active",
          sortOrder: 4,
          description: "German sports car manufacturer",
          country: "Germany",
          founded: 1931,
          imageUrl: "/images/brands/porsche.jpg"
        },
        {
          name: "Tesla",
          code: "TESLA",
          slug: "tesla",
          status: "Active",
          sortOrder: 5,
          description: "American electric vehicle manufacturer",
          country: "USA",
          founded: 2003,
          imageUrl: "/images/brands/tesla.jpg"
        }
      ];
      
      await Category.insertMany(defaultCategories);
      console.log('Default categories inserted successfully');
    }
    
    console.log('Categories initialization completed');
    
    // Check if cars already exist
    const carsCount = await Car.countDocuments();
    if (carsCount === 0) {
      // Get the first category for sample cars
      const firstCategory = await Category.findOne().sort({ sortOrder: 1 });
      
      if (firstCategory) {
        // Insert sample cars
        const sampleCars = [
          {
            name: "BMW X5",
            model: "X5",
            brand: "BMW",
            categoryId: firstCategory._id,
            description: "Luxury SUV with advanced features and premium comfort",
            price: 180,
            weeklyRate: 1200,
            weeklyRateEnabled: true,
            monthlyRate: 4500,
            seats: 5,
            doors: 5,
            luggageCapacity: 650,
            engineType: "V6 TwinPower Turbo",
            horsepower: 335,
            acceleration: 5.5,
            topSpeed: 250,
            images: ["/images/hero/car1.png", "/images/hero/car2.png"],
            year: 2023,
            location: "Doha",
            mileage: 15000,
            fuelType: "gasoline",
            transmission: "automatic",
            color: "Alpine White",
            features: ["Leather Seats", "Sunroof", "Navigation", "Bluetooth", "Backup Camera"],
            available: true,
            status: "available",
            vin: "WBAFR7C50LC123456",
            licensePlate: "Q-12345",
            branch: "Doha",
            rentalTerms: ["Valid driver's license required", "Credit card required", "Minimum age 21"],
            cancellationPolicy: "Free cancellation up to 24 hours before pickup"
          },
          {
            name: "Mercedes-Benz C-Class",
            model: "C-Class",
            brand: "Mercedes-Benz",
            categoryId: firstCategory._id,
            description: "Elegant sedan with cutting-edge technology and luxury features",
            price: 160,
            weeklyRate: 1000,
            weeklyRateEnabled: true,
            monthlyRate: 3800,
            seats: 5,
            doors: 4,
            luggageCapacity: 480,
            engineType: "2.0L Turbo I4",
            horsepower: 255,
            acceleration: 6.0,
            topSpeed: 250,
            images: ["/images/hero/car2.png", "/images/hero/car3.png"],
            year: 2023,
            location: "Doha",
            mileage: 12000,
            fuelType: "gasoline",
            transmission: "automatic",
            color: "Obsidian Black",
            features: ["MBUX Infotainment", "Ambient Lighting", "Heated Seats", "Premium Audio"],
            available: true,
            status: "available",
            vin: "WDD2050461A123456",
            licensePlate: "Q-67890",
            branch: "Doha",
            rentalTerms: ["Valid driver's license required", "Credit card required", "Minimum age 21"],
            cancellationPolicy: "Free cancellation up to 24 hours before pickup"
          },
          {
            name: "Audi A4",
            model: "A4",
            brand: "Audi",
            categoryId: firstCategory._id,
            description: "Premium compact luxury sedan with quattro all-wheel drive",
            price: 150,
            weeklyRate: 950,
            weeklyRateEnabled: true,
            monthlyRate: 3600,
            seats: 5,
            doors: 4,
            luggageCapacity: 460,
            engineType: "2.0L TFSI",
            horsepower: 248,
            acceleration: 5.8,
            topSpeed: 250,
            images: ["/images/hero/car3.png", "/images/hero/car5.png"],
            year: 2023,
            location: "Al Wakrah",
            mileage: 18000,
            fuelType: "gasoline",
            transmission: "automatic",
            color: "Mythos Black",
            features: ["Virtual Cockpit", "Quattro AWD", "Bang & Olufsen Audio", "LED Headlights"],
            available: true,
            status: "available",
            vin: "WAUZZZ8V5LA123456",
            licensePlate: "Q-11111",
            branch: "Al Wakrah",
            rentalTerms: ["Valid driver's license required", "Credit card required", "Minimum age 21"],
            cancellationPolicy: "Free cancellation up to 24 hours before pickup"
          },
          {
            name: "Porsche 911",
            model: "911",
            brand: "Porsche",
            categoryId: firstCategory._id,
            description: "Iconic sports car with legendary performance and precision",
            price: 350,
            weeklyRate: 2200,
            weeklyRateEnabled: true,
            monthlyRate: 8500,
            seats: 4,
            doors: 2,
            luggageCapacity: 132,
            engineType: "3.0L Twin-Turbo H6",
            horsepower: 379,
            acceleration: 4.2,
            topSpeed: 293,
            images: ["/images/hero/car5.png", "/images/hero/car6.png"],
            year: 2023,
            location: "Doha",
            mileage: 8000,
            fuelType: "gasoline",
            transmission: "automatic",
            color: "Guards Red",
            features: ["Sport Chrono", "PASM Suspension", "Sport Exhaust", "Carbon Ceramic Brakes"],
            available: true,
            status: "available",
            vin: "WP0AB2A99PS123456",
            licensePlate: "Q-99999",
            branch: "Doha",
            rentalTerms: ["Valid driver's license required", "Credit card required", "Minimum age 25"],
            cancellationPolicy: "Free cancellation up to 48 hours before pickup"
          },
          {
            name: "Tesla Model S",
            model: "Model S",
            brand: "Tesla",
            categoryId: firstCategory._id,
            description: "Electric luxury sedan with autopilot and over-the-air updates",
            price: 200,
            weeklyRate: 1300,
            weeklyRateEnabled: true,
            monthlyRate: 5000,
            seats: 5,
            doors: 4,
            luggageCapacity: 804,
            engineType: "Dual Motor AWD",
            horsepower: 670,
            acceleration: 3.1,
            topSpeed: 200,
            images: ["/images/hero/car6.png", "/images/hero/car1.png"],
            year: 2023,
            location: "Al Khor",
            mileage: 10000,
            fuelType: "electric",
            transmission: "automatic",
            color: "Pearl White Multi-Coat",
            features: ["Autopilot", "17-inch Touchscreen", "Premium Audio", "Supercharging"],
            available: true,
            status: "available",
            vin: "5YJSA1E50MF123456",
            licensePlate: "Q-55555",
            branch: "Al Khor",
            rentalTerms: ["Valid driver's license required", "Credit card required", "Minimum age 21"],
            cancellationPolicy: "Free cancellation up to 24 hours before pickup"
          }
        ];
        
        await Car.insertMany(sampleCars);
        console.log('Sample cars inserted successfully');
      } else {
        console.log('No categories found, skipping car initialization');
      }
    }
    
    console.log('Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
