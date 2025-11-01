import mongoose, { Schema, HydratedDocument } from 'mongoose';

// Interface for favorite data
export interface IFavorite {
  userId: string;
  carId: mongoose.Types.ObjectId; // This will store the ObjectId of the car
  createdAt: Date;
  updatedAt: Date;
}

// Type alias for hydrated documents
export type FavoriteDocument = HydratedDocument<IFavorite>;

const FavoriteSchema = new Schema<IFavorite>({
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
  }
}, {
  timestamps: true,
  collection: 'favorites'
});

// Compound index to ensure unique user-car combinations
FavoriteSchema.index({ userId: 1, carId: 1 }, { unique: true });

export const Favorite = mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);
