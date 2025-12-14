import mongoose, { Schema, Document, models } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  // Additional fields used by transformers (optional for backward compatibility)
  code?: string;
  status?: "Active" | "Hidden";
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
    trim: true
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Additional fields for backward compatibility
  code: {
    type: String,
    trim: true,
    sparse: true
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
CategorySchema.index({ slug: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ status: 1, sortOrder: 1 });

export const Category = models.Category || mongoose.model<ICategory>('Category', CategorySchema);

