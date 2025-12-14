import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { getSessionFromRequest } from '@/lib/auth';
import { Booking } from '../../../../../lib/models/Booking';
import mongoose from 'mongoose';

// GET /api/bookings/[id] - Get a specific booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    // Get user from authenticated request
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    // Validate booking ID
    let bookingObjectId;
    try {
      bookingObjectId = new mongoose.Types.ObjectId(id);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid booking ID format' },
        { status: 400 }
      );
    }
    
    // Get booking and verify ownership
    const booking = await Booking.findOne({
      _id: bookingObjectId,
      userId: session.userId
    }).populate('carId', 'name model brand images price');
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Transform booking to match frontend format
    const transformedBooking = {
      id: booking._id.toString(),
      userId: booking.userId,
      carId: booking.carId._id.toString(),
      carName: booking.carId.name,
      carModel: `${booking.carId.year || new Date().getFullYear()} ${booking.carId.brand} ${booking.carId.model}`,
      carImage: booking.carId.images?.[0] || '/images/placeholder-car.jpg',
      status: booking.status,
      pickupDate: booking.pickupDate.toISOString().split('T')[0],
      returnDate: booking.returnDate.toISOString().split('T')[0],
      pickupLocation: booking.pickupLocation,
      returnLocation: booking.returnLocation,
      pickupTime: booking.pickupTime,
      returnTime: booking.returnTime,
      rentalDays: booking.rentalDays,
      dailyRate: booking.dailyRate,
      totalAmount: booking.totalAmount,
      paymentStatus: booking.paymentStatus,
      bookingDate: booking.bookingDate.toISOString().split('T')[0],
      notes: booking.notes,
      driverAge: booking.driverAge,
      additionalDriver: booking.additionalDriver,
      insurance: booking.insurance,
    };
    
    return NextResponse.json(transformedBooking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings/[id] - Update a booking
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    // Get user from authenticated request
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    // Validate booking ID
    let bookingObjectId;
    try {
      bookingObjectId = new mongoose.Types.ObjectId(id);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid booking ID format' },
        { status: 400 }
      );
    }
    
    const updateData = await request.json();
    
    // Only allow certain fields to be updated
    const allowedUpdates = ['status', 'paymentStatus', 'notes', 'driverAge', 'additionalDriver', 'insurance'];
    const updates: any = {};
    
    for (const field of allowedUpdates) {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    }
    
    // Update booking and verify ownership
    const booking = await Booking.findOneAndUpdate(
      {
        _id: bookingObjectId,
        userId: session.userId
      },
      updates,
      { new: true, runValidators: true }
    ).populate('carId', 'name model brand images price');
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Transform booking to match frontend format
    const transformedBooking = {
      id: booking._id.toString(),
      userId: booking.userId,
      carId: booking.carId._id.toString(),
      carName: booking.carId.name,
      carModel: `${booking.carId.year || new Date().getFullYear()} ${booking.carId.brand} ${booking.carId.model}`,
      carImage: booking.carId.images?.[0] || '/images/placeholder-car.jpg',
      status: booking.status,
      pickupDate: booking.pickupDate.toISOString().split('T')[0],
      returnDate: booking.returnDate.toISOString().split('T')[0],
      pickupLocation: booking.pickupLocation,
      returnLocation: booking.returnLocation,
      pickupTime: booking.pickupTime,
      returnTime: booking.returnTime,
      rentalDays: booking.rentalDays,
      dailyRate: booking.dailyRate,
      totalAmount: booking.totalAmount,
      paymentStatus: booking.paymentStatus,
      bookingDate: booking.bookingDate.toISOString().split('T')[0],
      notes: booking.notes,
      driverAge: booking.driverAge,
      additionalDriver: booking.additionalDriver,
      insurance: booking.insurance,
    };
    
    return NextResponse.json({
      message: 'Booking updated successfully',
      booking: transformedBooking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Cancel a booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    // Get user from authenticated request
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    // Validate booking ID
    let bookingObjectId;
    try {
      bookingObjectId = new mongoose.Types.ObjectId(id);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid booking ID format' },
        { status: 400 }
      );
    }
    
    // Check if booking exists and can be cancelled
    const booking = await Booking.findOne({
      _id: bookingObjectId,
      userId: session.userId
    });
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Check if booking can be cancelled
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Booking cannot be cancelled' },
        { status: 400 }
      );
    }
    
    // Check if pickup date is within 24 hours
    const pickupDate = new Date(booking.pickupDate);
    const now = new Date();
    const hoursUntilPickup = (pickupDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilPickup <= 24) {
      return NextResponse.json(
        { error: 'Booking cannot be cancelled within 24 hours of pickup' },
        { status: 400 }
      );
    }
    
    // Update booking status to cancelled
    await Booking.findByIdAndUpdate(bookingObjectId, {
      status: 'cancelled',
      paymentStatus: 'refunded'
    });
    
    return NextResponse.json({
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
