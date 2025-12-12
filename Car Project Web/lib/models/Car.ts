import mongoose, { Schema, HydratedDocument } from 'mongoose';

// Interface for car data without extending Document to avoid conflicts
export interface ICar {
  name: string;
  model: string; // Changed from carModel to model for consistency
  brand: string;
  categoryId: mongoose.Types.ObjectId;
  description: string;
  price: number;
  weeklyRate?: number;
  weeklyRateEnabled?: boolean;
  monthlyRate?: number;
  seats: number;
  doors: number;
  luggageCapacity?: number;
  engineType?: string;
  horsepower?: number;
  acceleration?: number;
  topSpeed?: number;
  images: string[];
  year?: number;
  location?: string;
  mileage?: number;
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  transmission?: 'manual' | 'automatic';
  color?: string;
  features?: string[];
  available: boolean;
  status?: 'available' | 'rented' | 'maintenance' | 'reserved'; // Changed to lowercase for consistency
  vin?: string;
  licensePlate?: string; // Changed from plate to licensePlate for consistency
  branch?: 'Doha' | 'Al Wakrah' | 'Al Khor';
  rentalTerms?: string[];
  cancellationPolicy?: string;
  isPopular?: boolean;
  popularSince?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Type alias for hydrated documents (recommended for newer Mongoose versions)
export type CarDocument = HydratedDocument<ICar>;

const CarSchema = new Schema<ICar>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  weeklyRate: {
    type: Number,
    min: 0
  },
  weeklyRateEnabled: {
    type: Boolean,
    default: false
  },
  monthlyRate: {
    type: Number,
    min: 0
  },
  seats: {
    type: Number,
    required: true,
    min: 1
  },
  doors: {
    type: Number,
    required: true,
    min: 1
  },
  luggageCapacity: {
    type: Number,
    min: 0
  },
  engineType: {
    type: String,
    trim: true
  },
  horsepower: {
    type: Number,
    min: 0
  },
  acceleration: {
    type: Number,
    min: 0
  },
  topSpeed: {
    type: Number,
    min: 0
  },
  images: [{
    type: String
  }],
  year: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  location: {
    type: String,
    trim: true
  },
  mileage: {
    type: Number,
    min: 0
  },
  fuelType: {
    type: String,
    enum: ['gasoline', 'diesel', 'electric', 'hybrid']
  },
  transmission: {
    type: String,
    enum: ['manual', 'automatic']
  },
  color: {
    type: String,
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  available: {
    type: Boolean,
    required: true,
    default: true
  },
  status: {
    type: String,
    enum: ['available', 'rented', 'maintenance', 'reserved'],
    default: 'available'
  },
  vin: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  licensePlate: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  branch: {
    type: String,
    enum: ['Doha', 'Al Wakrah', 'Al Khor']
  },
  rentalTerms: [{
    type: String
  }],
  cancellationPolicy: {
    type: String
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  popularSince: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  collection: 'cars'
});

// Indexes for better query performance
CarSchema.index({ categoryId: 1 });
CarSchema.index({ available: 1, status: 1 });
CarSchema.index({ price: 1 });
CarSchema.index({ brand: 1 });
CarSchema.index({ year: 1 });
CarSchema.index({ fuelType: 1 });
CarSchema.index({ transmission: 1 });
CarSchema.index({ location: 1 });
CarSchema.index({ branch: 1 });
CarSchema.index({ isPopular: 1 });

// Text search index
CarSchema.index({
  name: 'text',
  model: 'text',
  brand: 'text',
  description: 'text',
  color: 'text',
  features: 'text'
});

export const Car = mongoose.models.Car || mongoose.model<ICar>('Car', CarSchema);
