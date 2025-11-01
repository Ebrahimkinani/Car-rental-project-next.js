import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { getSessionFromRequest } from '@/lib/auth';
import { Booking } from '../../../../lib/models/Booking';
import { Car } from '../../../../lib/models/Car';
import mongoose from 'mongoose';
import { createNotification } from '@/lib/notifications';

// GET /api/bookings - Get user's bookings
export async function GET(request: NextRequest) {
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
    
    const bookings = await Booking.find({ userId: session.userId })
      .populate('carId', 'name model brand images price')
      .sort({ bookingDate: -1 })
      .lean();
    
    // Transform bookings to match frontend format (with safe guards)
    const transformedBookings = bookings.map((booking: any) => {
      const car = booking.carId as any;
      const carIdString = car?._id ? String(car._id) : (typeof booking.carId === 'string' ? booking.carId : String(booking.carId || ''));
      const carName = car?.name ?? 'Unknown Car';
      const carModel = car
        ? `${car.year || new Date().getFullYear()} ${car.brand ?? ''} ${car.model ?? ''}`.trim()
        : 'Unknown Model';
      const carImage = (car?.images && Array.isArray(car.images) && car.images[0]) ? car.images[0] : '/images/placeholder-car.jpg';

      const toDateString = (d: any) => {
        const dateObj = d instanceof Date ? d : new Date(d);
        return isNaN(dateObj.getTime()) ? '' : dateObj.toISOString().split('T')[0];
      };

      return {
        id: String(booking._id),
        userId: booking.userId,
        carId: carIdString,
        carName,
        carModel,
        carImage,
        status: booking.status,
        pickupDate: toDateString(booking.pickupDate),
        returnDate: toDateString(booking.returnDate),
        pickupLocation: booking.pickupLocation,
        returnLocation: booking.returnLocation,
        pickupTime: booking.pickupTime,
        returnTime: booking.returnTime,
        rentalDays: booking.rentalDays,
        dailyRate: booking.dailyRate,
        totalAmount: booking.totalAmount,
        paymentStatus: booking.paymentStatus,
        bookingDate: toDateString(booking.bookingDate),
        notes: booking.notes,
        driverAge: booking.driverAge,
        additionalDriver: booking.additionalDriver,
        insurance: booking.insurance,
      };
    });
    
    return NextResponse.json(transformedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
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
    
    const bookingData = await request.json();
    const {
      carId,
      pickupDate,
      returnDate,
      pickupLocation,
      returnLocation,
      pickupTime,
      returnTime,
      rentalDays,
      dailyRate,
      totalAmount,
      notes,
      driverAge,
      additionalDriver,
      insurance
    } = bookingData;
    
    // Validate required fields
    if (!carId || !pickupDate || !returnDate || !pickupLocation || !pickupTime || !returnTime || !rentalDays || !dailyRate || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if car exists
    let carObjectId;
    try {
      carObjectId = new mongoose.Types.ObjectId(carId);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid car ID format' },
        { status: 400 }
      );
    }
    
    const car = await Car.findById(carObjectId);
    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }
    
    // Check if car is available for the requested dates
    const existingBooking = await Booking.findOne({
      carId: carObjectId,
      status: { $in: ['confirmed', 'upcoming', 'active'] },
      $or: [
        {
          pickupDate: { $lte: new Date(returnDate) },
          returnDate: { $gte: new Date(pickupDate) }
        }
      ]
    });
    
    if (existingBooking) {
      return NextResponse.json(
        { error: 'Car is not available for the selected dates' },
        { status: 409 }
      );
    }
    
    // Create new booking
    // In this demo, bookings are automatically confirmed and marked as paid
    // In production, this would happen after successful payment processing
    const booking = new Booking({
      userId: session.userId,
      carId: carObjectId,
      status: 'confirmed',
      pickupDate: new Date(pickupDate),
      returnDate: new Date(returnDate),
      pickupLocation,
      returnLocation,
      pickupTime,
      returnTime,
      rentalDays: parseInt(rentalDays),
      dailyRate: parseFloat(dailyRate),
      totalAmount: parseFloat(totalAmount),
      paymentStatus: 'paid',
      notes,
      driverAge,
      additionalDriver: Boolean(additionalDriver),
      insurance
    });
    
    await booking.save();
    
    // Populate car details for response
    await booking.populate('carId', 'name model brand images price');
    
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

    // Best-effort: create a user notification (non-blocking)
    (async () => {
      try {
        await createNotification({
          userId: String(session.userId),
          bookingId: booking._id.toString(),
          type: 'BOOKING_CREATED',
          title: 'Booking created',
          message: `Your booking for ${booking.carId.brand} ${booking.carId.model} is pending confirmation.`,
          actionUrl: '/bookings',
        });
      } catch {
        // ignore notification errors
      }
    })();
    
    return NextResponse.json({
      message: 'Booking created successfully',
      booking: transformedBooking
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
