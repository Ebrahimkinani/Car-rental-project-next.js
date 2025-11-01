# MongoDB Setup Guide for Cars Project

## Quick Setup Options

### Option 1: MongoDB Atlas (Recommended - Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string
5. Create a `.env.local` file in your project root:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/car_rental?retryWrites=true&w=majority
MONGODB_DB=car_rental
API_URL=http://localhost:3000/api
```

### Option 2: Local MongoDB Installation
1. Install MongoDB using Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

2. Or install via Homebrew (if Xcode is updated):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

## Testing the Setup

### 1. Initialize Database
```bash
curl -X POST http://localhost:3000/api/init-db
```

### 2. Test Categories CRUD

#### Get all categories:
```bash
curl http://localhost:3000/api/categories
```

#### Create a new category:
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Toyota",
    "code": "TOYOTA",
    "slug": "toyota",
    "status": "Active",
    "sortOrder": 6,
    "description": "Japanese automotive manufacturer",
    "country": "Japan",
    "founded": 1937,
    "imageUrl": "/images/brands/toyota.jpg"
  }'
```

#### Update a category:
```bash
curl -X PUT http://localhost:3000/api/categories/[CATEGORY_ID] \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Toyota Motors",
    "description": "Updated description"
  }'
```

#### Delete a category:
```bash
curl -X DELETE http://localhost:3000/api/categories/[CATEGORY_ID]
```

### 3. Test Cars CRUD

#### Get all cars:
```bash
curl http://localhost:3000/api/cars
```

#### Create a new car:
```bash
curl -X POST http://localhost:3000/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Toyota Camry",
    "model": "Camry",
    "brand": "Toyota",
    "categoryId": "[CATEGORY_ID]",
    "description": "Reliable mid-size sedan",
    "price": 80,
    "seats": 5,
    "doors": 4,
    "luggageCapacity": 428,
    "fuelType": "gasoline",
    "transmission": "automatic",
    "color": "Silver",
    "features": ["Navigation", "Bluetooth", "Backup Camera"],
    "available": true,
    "status": "available",
    "images": ["/images/cars/toyota-camry-1.jpg"]
  }'
```

#### Update a car:
```bash
curl -X PUT http://localhost:3000/api/cars/[CAR_ID] \
  -H "Content-Type: application/json" \
  -d '{
    "price": 85,
    "available": false
  }'
```

#### Delete a car:
```bash
curl -X DELETE http://localhost:3000/api/cars/[CAR_ID]
```

## Admin Panel Testing

1. Start the development server:
```bash
npm run dev
```

2. Navigate to the admin panel:
- Categories: http://localhost:3000/admin/categories
- Cars: http://localhost:3000/admin/units

3. Test the forms:
- Add new categories using the "Add Category" button
- Add new cars using the "Add Car" button
- Edit existing items
- Delete items

## API Endpoints Summary

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `GET /api/categories/[id]` - Get category by ID
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category
- `GET /api/categories/slug/[slug]` - Get category by slug

### Cars
- `GET /api/cars` - Get all cars (with filters)
- `POST /api/cars` - Create car
- `GET /api/cars/[id]` - Get car by ID
- `PUT /api/cars/[id]` - Update car
- `DELETE /api/cars/[id]` - Delete car
- `GET /api/cars/category/[categoryId]` - Get cars by category

### Database Initialization
- `POST /api/init-db` - Initialize database with sample data

## Troubleshooting

### MongoDB Connection Issues
1. Check if MongoDB is running: `brew services list | grep mongodb`
2. Verify connection string in `.env.local`
3. Check MongoDB logs for errors

### API Errors
1. Check browser console for errors
2. Check server logs in terminal
3. Verify API routes are accessible

### Admin Panel Issues
1. Ensure services are updated to use API calls
2. Check for CORS issues
3. Verify form validation

## Next Steps

1. Set up MongoDB Atlas account
2. Configure environment variables
3. Initialize database with sample data
4. Test CRUD operations
5. Test admin panel functionality
6. Add more features like search, filtering, pagination
