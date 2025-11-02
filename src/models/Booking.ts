import mongoose, { Schema, HydratedDocument, models } from 'mongoose';

// Interface for booking data
export interface IBooking {
  userId: string;
  carId: mongoose.Types.ObjectId;
  status: 'pending' | 'confirmed' | 'upcoming' | 'active' | 'completed' | 'cancelled';
  pickupDate: Date;
  returnDate: Date;
  pickupLocation: string;
  returnLocation?: string;
  pickupTime: string;
  returnTime: string;
  rentalDays: number;
  dailyRate: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  bookingDate: Date;
  notes?: string;
  driverAge?: string;
  additionalDriver?: boolean;
  insurance?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type alias for hydrated documents
export type BookingDocument = HydratedDocument<IBooking>;

const BookingSchema = new Schema<IBooking>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  carId: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'upcoming', 'active', 'completed', 'cancelled'],
    default: 'pending',
    required: true,
    index: true
  },
  pickupDate: {
    type: Date,
    required: true,
    index: true
  },
  returnDate: {
    type: Date,
    required: true,
    index: true
  },
  pickupLocation: {
    type: String,
    required: true
  },
  returnLocation: {
    type: String
  },
  pickupTime: {
    type: String,
    required: true
  },
  returnTime: {
    type: String,
    required: true
  },
  rentalDays: {
    type: Number,
    required: true,
    min: 1
  },
  dailyRate: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending',
    required: true,
    index: true
  },
  bookingDate: {
    type: Date,
    default: Date.now,
    required: true,
    index: true
  },
  notes: {
    type: String
  },
  driverAge: {
    type: String
  },
  additionalDriver: {
    type: Boolean,
    default: false
  },
  insurance: {
    type: String
  }
}, {
  timestamps: true,
  collection: 'bookings'
});

// Compound indexes for efficient queries
BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ userId: 1, pickupDate: 1 });
BookingSchema.index({ carId: 1, pickupDate: 1, returnDate: 1 });

export const Booking = models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

