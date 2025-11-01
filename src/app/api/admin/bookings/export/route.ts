import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Booking } from '@/models/Booking';

// Generate booking number (temporary until schema is updated)
function generateBookingNumber(id: string): string {
  const year = new Date().getFullYear();
  const paddedId = id.slice(-3).padStart(3, '0');
  return `BKG-${year}${paddedId}`;
}

// POST /api/admin/bookings/export - Export bookings as CSV
export async function POST(request: NextRequest) {
  try {
    // TODO: Add proper admin authentication
    // For now, we'll allow access without authentication to match other admin routes
    // In production, you should implement proper admin role checking:
    // const session = await getSessionFromRequest(request);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // const user = await User.findById(session.userId);
    // if (!isAdminRole(user.role)) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    await dbConnect();

    // Parse query parameters from request body
    const body = await request.json();
    const { status = 'all', from = '', to = '' } = body;

    // Build MongoDB query
    const query: any = {};

    if (status !== 'all') {
      query.status = status;
    }

    if (from || to) {
      query.pickupDate = {};
      if (from) {
        query.pickupDate.$gte = new Date(from);
      }
      if (to) {
        query.pickupDate.$lte = new Date(to);
      }
    }

    // Fetch all matching bookings
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
      .lean();

    // Transform data for CSV
    const csvData = bookings.map(booking => {
      const car = booking.carId as any;
      const category = car?.categoryId as any;

      return {
        'Booking Number': generateBookingNumber(booking._id.toString()),
        'Client Name': `User ${booking.userId}`, // TODO: Get actual user name
        'Client Email': '', // TODO: Get actual user email
        'Car Make': car?.brand || 'Unknown',
        'Car Model': car?.model || 'Unknown',
        'Plate Number': car?.licensePlate || 'N/A',
        'Car Type': category?.name || 'Unknown',
        'Pickup Date': booking.pickupDate.toISOString().split('T')[0],
        'Dropoff Date': booking.returnDate.toISOString().split('T')[0],
        'Status': booking.status,
        'Total Amount': booking.totalAmount || 0,
        'Created At': booking.createdAt.toISOString().split('T')[0]
      };
    });

    // Convert to CSV
    const csvHeaders = [
      'Booking Number',
      'Client Name', 
      'Client Email',
      'Car Make',
      'Car Model',
      'Plate Number',
      'Car Type',
      'Pickup Date',
      'Dropoff Date',
      'Status',
      'Total Amount',
      'Created At'
    ];

    const csvContent = csvHeaders.join(',') + '\n' + 
      csvData.map(row => 
        csvHeaders.map(header => {
          const value = row[header];
          // Escape CSV values
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      ).join('\n');

    // Return CSV content
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="bookings_export.csv"'
      }
    });

  } catch (error) {
    console.error('Error exporting bookings CSV:', error);
    return NextResponse.json(
      { error: 'Failed to export bookings' },
      { status: 500 }
    );
  }
}
