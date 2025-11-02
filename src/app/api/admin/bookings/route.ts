import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth/requireAuth';
import { Booking } from '@/models/Booking';

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

    // Search filter - will be applied after population
    let searchRegex: RegExp | null = null;
    if (search.trim()) {
      searchRegex = new RegExp(search.trim(), 'i');
    }

    // Car type filter - will be applied after population
    let carTypeFilter: string | null = null;
    if (carType !== 'All') {
      carTypeFilter = carType;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch bookings with population
    const bookings = await Booking.find(query)
      .populate({
        path: 'carId',
        model: 'Car',
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

    // Transform and filter data
    const transformedBookings: AdminBookingRow[] = [];

    for (const booking of bookings) {
      const car = booking.carId as any;
      const category = car?.categoryId as any;

      // Apply car type filter
      if (carTypeFilter && category?.name !== carTypeFilter) {
        continue;
      }

      // Apply search filter
      if (searchRegex) {
        const searchText = [
          generateBookingNumber((booking._id as any).toString()),
          booking.userId, // TODO: Replace with actual user name when user schema is updated
          car?.brand || '',
          car?.model || '',
          car?.licensePlate || ''
        ].join(' ');

        if (!searchRegex.test(searchText)) {
          continue;
        }
      }

      // TODO: Get user details from users collection
      // For now, using userId as placeholder
      const userFullName = `User ${booking.userId}`; // TODO: Replace with actual user lookup

      transformedBookings.push({
        id: (booking._id as any).toString(),
        bookingNumber: generateBookingNumber((booking._id as any).toString()),
        client: {
          id: booking.userId,
          fullName: userFullName, // TODO: Get from users collection
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

    // Calculate final pagination info
    const pageCount = Math.ceil(transformedBookings.length / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = transformedBookings.slice(startIndex, startIndex + limit);

    const response: AdminBookingsResponse = {
      data: paginatedData,
      page,
      pageCount: Math.max(1, pageCount),
      total: transformedBookings.length
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
