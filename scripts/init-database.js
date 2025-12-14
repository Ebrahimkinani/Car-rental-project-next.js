#!/usr/bin/env node

/**
 * Database Initialization Script
 * This script initializes the MongoDB database with sample data
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental';

async function initializeDatabase() {
  let client;
  
  try {
    console.log('🚀 Starting database initialization...');
    console.log(`📍 Connection URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // Create indexes for categories
    console.log('📊 Creating indexes for categories...');
    await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
    await db.collection('categories').createIndex({ code: 1 }, { unique: true });
    await db.collection('categories').createIndex({ status: 1, sortOrder: 1 });
    
    // Create indexes for cars
    console.log('📊 Creating indexes for cars...');
    await db.collection('cars').createIndex({ categoryId: 1 });
    await db.collection('cars').createIndex({ available: 1, status: 1 });
    await db.collection('cars').createIndex({ price: 1 });
    await db.collection('cars').createIndex({ brand: 1 });
    await db.collection('cars').createIndex({ year: 1 });
    await db.collection('cars').createIndex({ fuelType: 1 });
    await db.collection('cars').createIndex({ transmission: 1 });
    
    console.log('✅ Database indexes created successfully');
    
    // Check if categories already exist
    const categoriesCount = await db.collection('categories').countDocuments();
    if (categoriesCount === 0) {
      console.log('📝 Inserting default categories...');
      
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
          imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&crop=center",
          createdAt: new Date(),
          updatedAt: new Date()
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
          imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&crop=center",
          createdAt: new Date(),
          updatedAt: new Date()
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
          imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=300&fit=crop&crop=center",
          createdAt: new Date(),
          updatedAt: new Date()
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
          imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&crop=center",
          createdAt: new Date(),
          updatedAt: new Date()
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
          imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop&crop=center",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Toyota",
          code: "TOYOTA",
          slug: "toyota",
          status: "Active",
          sortOrder: 6,
          description: "Japanese automotive manufacturer known for reliability",
          country: "Japan",
          founded: 1937,
          imageUrl: "https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop&crop=center",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Honda",
          code: "HONDA",
          slug: "honda",
          status: "Active",
          sortOrder: 7,
          description: "Japanese manufacturer of automobiles and motorcycles",
          country: "Japan",
          founded: 1948,
          imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&crop=center",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Ford",
          code: "FORD",
          slug: "ford",
          status: "Active",
          sortOrder: 8,
          description: "American multinational automobile manufacturer",
          country: "USA",
          founded: 1903,
          imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop&crop=center",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await db.collection('categories').insertMany(defaultCategories);
      console.log(`✅ Inserted ${defaultCategories.length} categories`);
    } else {
      console.log(`ℹ️  Categories already exist (${categoriesCount} found)`);
    }
    
    // Check if cars already exist
    const carsCount = await db.collection('cars').countDocuments();
    if (carsCount === 0) {
      console.log('🚗 Inserting sample cars...');
      
      // Get the first category to use as reference
      const firstCategory = await db.collection('categories').findOne({});
      
      if (firstCategory) {
        const sampleCars = [
          {
            name: "BMW X5",
            model: "X5",
            brand: "BMW",
            categoryId: firstCategory._id,
            description: "Luxury SUV with advanced technology and premium comfort",
            price: 150,
            seats: 5,
            doors: 5,
            luggageCapacity: 650,
            engineType: "V6 TwinPower Turbo",
            horsepower: 335,
            acceleration: 5.5,
            topSpeed: 250,
            images: [
              "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center",
              "https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop&crop=center"
            ],
            year: 2023,
            location: "Doha",
            mileage: 15000,
            fuelType: "gasoline",
            transmission: "automatic",
            color: "Alpine White",
            features: ["Navigation", "Leather Seats", "Sunroof", "Bluetooth"],
            available: true,
            status: "available",
            vin: "WBAFR7C50LC123456",
            licensePlate: "Q-12345",
            branch: "Doha",
            rentalTerms: ["Minimum 1 day rental", "Valid driving license required"],
            cancellationPolicy: "Free cancellation up to 24 hours before pickup",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: "Mercedes-Benz C-Class",
            model: "C-Class",
            brand: "Mercedes-Benz",
            categoryId: firstCategory._id,
            description: "Elegant sedan with cutting-edge technology",
            price: 120,
            seats: 5,
            doors: 4,
            luggageCapacity: 455,
            engineType: "2.0L Turbo",
            horsepower: 255,
            acceleration: 6.0,
            topSpeed: 250,
            images: [
              "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&crop=center",
              "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop&crop=center"
            ],
            year: 2023,
            location: "Doha",
            mileage: 12000,
            fuelType: "gasoline",
            transmission: "automatic",
            color: "Obsidian Black",
            features: ["MBUX System", "Leather Seats", "Ambient Lighting", "Wireless Charging"],
            available: true,
            status: "available",
            vin: "WDD2050461A123456",
            licensePlate: "Q-67890",
            branch: "Doha",
            rentalTerms: ["Minimum 1 day rental", "Valid driving license required"],
            cancellationPolicy: "Free cancellation up to 24 hours before pickup",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: "Tesla Model 3",
            model: "Model 3",
            brand: "Tesla",
            categoryId: firstCategory._id,
            description: "Electric sedan with autopilot and over-the-air updates",
            price: 130,
            seats: 5,
            doors: 4,
            luggageCapacity: 425,
            engineType: "Electric Motor",
            horsepower: 283,
            acceleration: 5.3,
            topSpeed: 225,
            images: [
              "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&crop=center",
              "https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop&crop=center"
            ],
            year: 2023,
            location: "Doha",
            mileage: 5000,
            fuelType: "electric",
            transmission: "automatic",
            color: "Pearl White",
            features: ["Autopilot", "Supercharging", "15-inch Touchscreen", "Premium Audio"],
            available: true,
            status: "available",
            vin: "5YJ3E1EA4KF123456",
            licensePlate: "Q-22222",
            branch: "Doha",
            rentalTerms: ["Minimum 1 day rental", "Valid driving license required"],
            cancellationPolicy: "Free cancellation up to 24 hours before pickup",
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        
        await db.collection('cars').insertMany(sampleCars);
        console.log(`✅ Inserted ${sampleCars.length} cars`);
      }
    } else {
      console.log(`ℹ️  Cars already exist (${carsCount} found)`);
    }
    
    // Final statistics
    const finalCategoriesCount = await db.collection('categories').countDocuments();
    const finalCarsCount = await db.collection('cars').countDocuments();
    
    console.log('\n🎉 Database initialization completed successfully!');
    console.log(`📊 Final statistics:`);
    console.log(`   - Categories: ${finalCategoriesCount}`);
    console.log(`   - Cars: ${finalCarsCount}`);
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Visit: http://localhost:3000 to see your application');
    console.log('3. Visit: http://localhost:3000/api/init-db (GET) to check database status');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MongoDB is running locally');
    console.log('2. Check your MONGODB_URI in .env.local');
    console.log('3. For local MongoDB: mongod --dbpath /path/to/your/db');
    console.log('4. For Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Connection closed');
    }
  }
}

// Run the initialization
initializeDatabase().catch(console.error);
