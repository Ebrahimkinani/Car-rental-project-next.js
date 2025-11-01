import { Car } from '@/types';
import { dbConnect } from '@/lib/mongodb';
import { Car as CarModel } from '../../lib/models/Car';
import { transformCarsForAPI } from '@/lib/transformers';

/**
 * Server-side function to fetch cars directly from the database
 * This runs on the server during build time or request time
 */
export async function getCars(): Promise<Car[]> {
  try {
    await dbConnect();
    
    const cars = await CarModel.find({}).populate('categoryId', 'name slug').lean();
    
    // Transform database cars to API format
    const transformedCars = transformCarsForAPI(cars);
    
    return transformedCars;
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
}
