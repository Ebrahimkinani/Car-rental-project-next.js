import MockDatabase from '../../src/lib/mock-db';
import mongoose from 'mongoose';

export interface IFavorite {
  userId: string;
  carId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export class MockFavorite {
  public userId: string;
  public carId: mongoose.Types.ObjectId;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: { userId: string; carId: mongoose.Types.ObjectId }) {
    this.userId = data.userId;
    this.carId = data.carId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save(): Promise<this> {
    MockDatabase.addFavorite(this.userId, this.carId.toString());
    return this;
  }

  toObject(): any {
    return {
      userId: this.userId,
      carId: this.carId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static findOne(query: { userId: string; carId: mongoose.Types.ObjectId }): Promise<MockFavorite | null> {
    const isFavorite = MockDatabase.isFavorite(query.userId, query.carId.toString());
    if (isFavorite) {
      return Promise.resolve(new MockFavorite(query));
    }
    return Promise.resolve(null);
  }

  static find(query: { userId: string }): Promise<MockFavorite[]> {
    const favorites = MockDatabase.getFavorites(query.userId);
    return Promise.resolve(favorites.map(fav => new MockFavorite({
      userId: fav.userId,
      carId: new mongoose.Types.ObjectId(fav.carId)
    })));
  }

  static deleteOne(query: { userId: string; carId: mongoose.Types.ObjectId }): Promise<{ deletedCount: number }> {
    const deleted = MockDatabase.removeFavorite(query.userId, query.carId.toString());
    return Promise.resolve({ deletedCount: deleted ? 1 : 0 });
  }
}

export const Favorite = MockFavorite;
