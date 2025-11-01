#!/bin/bash

# MongoDB CRUD Testing Script
# This script demonstrates how to test the Cars Project API endpoints

echo "🚗 Cars Project MongoDB CRUD Testing"
echo "=================================="

# Base URL
BASE_URL="http://localhost:3000/api"

echo ""
echo "1. Testing Categories CRUD Operations"
echo "------------------------------------"

# Get all categories
echo "📋 Getting all categories..."
curl -s "$BASE_URL/categories" | jq '.' 2>/dev/null || curl -s "$BASE_URL/categories"

echo ""
echo "➕ Creating a new category..."
CATEGORY_RESPONSE=$(curl -s -X POST "$BASE_URL/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Honda",
    "code": "HONDA",
    "slug": "honda",
    "status": "Active",
    "sortOrder": 7,
    "description": "Japanese automotive manufacturer",
    "country": "Japan",
    "founded": 1948,
    "imageUrl": "/images/brands/honda.jpg"
  }')

echo "$CATEGORY_RESPONSE" | jq '.' 2>/dev/null || echo "$CATEGORY_RESPONSE"

# Extract category ID (this is a simplified approach)
CATEGORY_ID=$(echo "$CATEGORY_RESPONSE" | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$CATEGORY_ID" ]; then
    echo ""
    echo "🔍 Getting category by ID: $CATEGORY_ID"
    curl -s "$BASE_URL/categories/$CATEGORY_ID" | jq '.' 2>/dev/null || curl -s "$BASE_URL/categories/$CATEGORY_ID"
    
    echo ""
    echo "✏️ Updating category..."
    curl -s -X PUT "$BASE_URL/categories/$CATEGORY_ID" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Honda Motor Co.",
        "description": "Updated description for Honda"
      }' | jq '.' 2>/dev/null || echo "Update completed"
fi

echo ""
echo "2. Testing Cars CRUD Operations"
echo "-------------------------------"

# Get all cars
echo "🚙 Getting all cars..."
curl -s "$BASE_URL/cars" | jq '.' 2>/dev/null || curl -s "$BASE_URL/cars"

echo ""
echo "➕ Creating a new car..."
CAR_RESPONSE=$(curl -s -X POST "$BASE_URL/cars" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Honda Civic",
    "model": "Civic",
    "brand": "Honda",
    "categoryId": "'$CATEGORY_ID'",
    "description": "Compact sedan with excellent fuel efficiency",
    "price": 75,
    "seats": 5,
    "doors": 4,
    "luggageCapacity": 400,
    "fuelType": "gasoline",
    "transmission": "automatic",
    "color": "Blue",
    "features": ["Navigation", "Bluetooth", "Backup Camera", "Lane Assist"],
    "available": true,
    "status": "available",
    "images": ["/images/cars/honda-civic-1.jpg", "/images/cars/honda-civic-2.jpg"],
    "year": 2023,
    "location": "Doha",
    "mileage": 8000,
    "vin": "1HGCV1F30JA123456",
    "plate": "Q-ABC123",
    "branch": "Doha"
  }')

echo "$CAR_RESPONSE" | jq '.' 2>/dev/null || echo "$CAR_RESPONSE"

# Extract car ID
CAR_ID=$(echo "$CAR_RESPONSE" | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$CAR_ID" ]; then
    echo ""
    echo "🔍 Getting car by ID: $CAR_ID"
    curl -s "$BASE_URL/cars/$CAR_ID" | jq '.' 2>/dev/null || curl -s "$BASE_URL/cars/$CAR_ID"
    
    echo ""
    echo "✏️ Updating car..."
    curl -s -X PUT "$BASE_URL/cars/$CAR_ID" \
      -H "Content-Type: application/json" \
      -d '{
        "price": 80,
        "available": false,
        "status": "maintenance"
      }' | jq '.' 2>/dev/null || echo "Update completed"
fi

echo ""
echo "3. Testing Filtering and Search"
echo "------------------------------"

echo "🔍 Getting cars by category..."
if [ ! -z "$CATEGORY_ID" ]; then
    curl -s "$BASE_URL/cars/category/$CATEGORY_ID" | jq '.' 2>/dev/null || curl -s "$BASE_URL/cars/category/$CATEGORY_ID"
fi

echo ""
echo "🔍 Getting available cars only..."
curl -s "$BASE_URL/cars?available=true" | jq '.' 2>/dev/null || curl -s "$BASE_URL/cars?available=true"

echo ""
echo "🔍 Getting cars with price filter..."
curl -s "$BASE_URL/cars?minPrice=70&maxPrice=100" | jq '.' 2>/dev/null || curl -s "$BASE_URL/cars?minPrice=70&maxPrice=100"

echo ""
echo "4. Testing Database Initialization"
echo "----------------------------------"

echo "🗄️ Initializing database with sample data..."
curl -s -X POST "$BASE_URL/init-db" | jq '.' 2>/dev/null || curl -s -X POST "$BASE_URL/init-db"

echo ""
echo "✅ CRUD Testing Complete!"
echo ""
echo "Next steps:"
echo "1. Set up MongoDB Atlas account"
echo "2. Configure MONGODB_URI in .env.local"
echo "3. Test admin panel at http://localhost:3000/admin/categories"
echo "4. Test admin panel at http://localhost:3000/admin/units"
