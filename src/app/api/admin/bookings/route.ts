import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth/requireAuth';
import { Booking } from '@/models/Booking';
import { Car } from '@/models/Car';
import { Category } from '@/models/Category';

// Types for the API response
export interface AdminBookingRow {
  id: string;
  bookingNumber: string; // TODO: bookingNumber field not in schema. Need to add auto-generated booking numbers like "BKG-24001"
  client: {
    id: string;
    fullName: string; // TODO: fullName not in user schema. Need to add firstName + lastName or fullName field
    email: string;
    phone?: string; // TODO: phone field not in user schema
  };
  car: {
    id: string;
    make: string; // brand field
    model: string;
    plateNumber: string; // licensePlate field
    type: string; // category name
  };
  pickupDate: string; // ISO date
  dropoffDate: string; // ISO date (returnDate field)
  status: 'active' | 'pending' | 'cancelled' | 'confirmed' | 'upcoming' | 'completed';
  totalAmount: number; // totalAmount field exists
  createdAt: string; // ISO date
}

export interface AdminBookingsResponse {
  data: AdminBookingRow[];
  page: number;
  pageCount: number;
  total: number;
}

// Generate booking number (temporary until schema is updated)
function generateBookingNumber(id: string): string {
  const year = new Date().getFullYear();
  const paddedId = id.slice(-3).padStart(3, '0');
  return `BKG-${year}${paddedId}`;
}

// GET /api/admin/bookings - Get all bookings with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // Require admin, manager, or employee role
    await requireAuth(request, ['admin', 'manager', 'employee']);

    await dbConnect();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    const carType = searchParams.get('carType') || 'All';
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build MongoDB query
    const query: any = {};

    // Status filter
    if (status !== 'all') {
      query.status = status;
    }

    // Date range filter
    if (from || to) {
      query.pickupDate = {};
      if (from) {
        query.pickupDate.$gte = new Date(from);
      }
      if (to) {
        query.pickupDate.$lte = new Date(to);
      }
    }

    // ✅ NEW: Get category ID if carType filter is applied (filter BEFORE fetching)
    let categoryId: string | null = null;
    if (carType !== 'All') {
      const category = await Category.findOne({ name: carType }).lean();
      if (category) {
        categoryId = String((category as any)._id);
      }
    }

    // ✅ NEW: If category filter exists, filter by cars with that category
    if (categoryId) {
      const carsWithCategory = await Car.find({ categoryId }).select('_id').lean();
      const carIds = carsWithCategory.map(car => car._id);
      if (carIds.length > 0) {
        query.carId = { $in: carIds };
      } else {
        // No cars with this category, return empty result
        return NextResponse.json({
          data: [],
          page,
          pageCount: 0,
          total: 0
        });
      }
    }

    // ✅ NEW: Add search filter to MongoDB query if possible (for car fields)
    // Note: Search for userId/bookingNumber still needs to be done after population
    let needsPostFilterSearch = false;
    if (search.trim()) {
      // Try to match against car fields first
      const searchRegex = new RegExp(search.trim(), 'i');
      const matchingCars = await Car.find({
        $or: [
          { brand: searchRegex },
          { model: searchRegex },
          { licensePlate: searchRegex }
        ]
      }).select('_id').lean();
      
      if (matchingCars.length > 0) {
        // Filter bookings by matching car IDs
        const matchingCarIds = matchingCars.map(car => car._id);
        if (query.carId && '$in' in query.carId) {
          // Combine with existing carId filter
          const existingCarIds = query.carId.$in as any[];
          query.carId = { $in: matchingCarIds.filter(id => existingCarIds.includes(id)) };
        } else {
          query.carId = { $in: matchingCarIds };
        }
      } else {
        // No matching cars, but search might be for userId/bookingNumber
        // We'll filter those after population
        needsPostFilterSearch = true;
      }
    }

    // ✅ NEW: Get total count BEFORE pagination (accurate count!)
    const total = await Booking.countDocuments(query);

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch bookings with population (now with proper filters applied)
    const bookings = await Booking.find(query)
      .populate({
        path: 'carId',
        model: 'Car',
        select: 'brand model licensePlate categoryId',
        populate: {
          path: 'categoryId',
          model: 'Category',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Transform and apply remaining filters (userId, bookingNumber search)
    const transformedBookings: AdminBookingRow[] = [];
    const searchRegex = search.trim() && needsPostFilterSearch 
      ? new RegExp(search.trim(), 'i') 
      : null;

    for (const booking of bookings) {
      const car = booking.carId as any;
      const category = car?.categoryId as any;

      // ✅ Apply search filter for userId/bookingNumber (if needed)
      if (searchRegex && needsPostFilterSearch) {
        const searchText = [
          generateBookingNumber((booking._id as any).toString()),
          booking.userId || ''
        ].join(' ');

        if (!searchRegex.test(searchText)) {
          continue;
        }
      }

      // Transform to API format
      transformedBookings.push({
        id: (booking._id as any).toString(),
        bookingNumber: generateBookingNumber((booking._id as any).toString()),
        client: {
          id: booking.userId || '',
          fullName: `User ${booking.userId}`, // TODO: Get from users collection
          email: '', // TODO: Get from users collection
          phone: '' // TODO: Get from users collection
        },
        car: {
          id: car?._id?.toString() || '',
          make: car?.brand || 'Unknown',
          model: car?.model || 'Unknown',
          plateNumber: car?.licensePlate || 'N/A',
          type: category?.name || 'Unknown'
        },
        pickupDate: booking.pickupDate.toISOString().split('T')[0],
        dropoffDate: booking.returnDate.toISOString().split('T')[0],
        status: booking.status as any,
        totalAmount: booking.totalAmount || 0,
        createdAt: booking.createdAt.toISOString().split('T')[0]
      });
    }

    // ✅ Calculate accurate pagination info
    const pageCount = Math.ceil(total / limit);

    const response: AdminBookingsResponse = {
      data: transformedBookings,
      page,
      pageCount: Math.max(1, pageCount),
      total: total // ✅ Accurate total from MongoDB count
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
