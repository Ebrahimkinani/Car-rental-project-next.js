import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  code: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  status: "Active" | "Hidden";
  sortOrder?: number;
  defaultDailyRate?: number;
  seats?: number;
  imageUrl?: string;
  country?: string;
  founded?: number;
  capacity?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    uppercase: true
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ["Active", "Hidden"],
    default: "Active"
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  defaultDailyRate: {
    type: Number,
    min: 0
  },
  seats: {
    type: Number,
    min: 1
  },
  imageUrl: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  founded: {
    type: Number,
    min: 1800
  },
  capacity: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'categories'
});

// Indexes
CategorySchema.index({ status: 1, sortOrder: 1 });

// Text search index
CategorySchema.index({
  name: 'text',
  description: 'text'
});

export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
