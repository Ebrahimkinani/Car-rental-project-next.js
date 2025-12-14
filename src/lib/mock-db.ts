/**
 * Mock Database for testing when MongoDB is not available
 * This is a temporary solution for development
 */

interface MockSession {
  userId: string;
  email: string;
  displayName?: string;
  token: string;
  expiresAt: Date;
  isActive: boolean;
  device?: string;
  ip?: string;
  userAgent?: string;
}

interface MockFavorite {
  userId: string;
  carId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MockCar {
  _id: string;
  name: string;
  model: string;
  brand: string;
  year: number;
  price: number;
  imageUrl: string;
  categoryId: string;
}

interface MockBooking {
  _id: string;
  userId: string;
  carId: string;
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

// In-memory storage
const mockSessions: Map<string, MockSession> = new Map();
const mockFavorites: Map<string, MockFavorite> = new Map();
const mockCars: Map<string, MockCar> = new Map();
const mockBookings: Map<string, MockBooking> = new Map();

// Initialize with some sample data
const sampleCars: MockCar[] = [
  {
    _id: '507f1f77bcf86cd799439011',
    name: 'BMW X5',
    model: 'X5',
    brand: 'BMW',
    year: 2023,
    price: 120,
    imageUrl: '/images/cars/bmw-x5.jpg',
    categoryId: '507f1f77bcf86cd799439012'
  },
  {
    _id: '507f1f77bcf86cd799439013',
    name: 'Mercedes C-Class',
    model: 'C-Class',
    brand: 'Mercedes',
    year: 2023,
    price: 110,
    imageUrl: '/images/cars/mercedes-c-class.jpg',
    categoryId: '507f1f77bcf86cd799439012'
  }
];

// Initialize sample cars
sampleCars.forEach(car => {
  mockCars.set(car._id, car);
});

export class MockDatabase {
  // Session operations
  static createSession(userId: string, email: string, displayName?: string): string {
    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    const session: MockSession = {
      userId,
      email,
      displayName,
      token,
      expiresAt,
      isActive: true
    };
    
    mockSessions.set(token, session);
    return token;
  }

  static findActiveSession(token: string): MockSession | null {
    const session = mockSessions.get(token);
    if (!session || !session.isActive || session.expiresAt < new Date()) {
      return null;
    }
    return session;
  }

  static deactivateSession(token: string): boolean {
    const session = mockSessions.get(token);
    if (session) {
      session.isActive = false;
      return true;
    }
    return false;
  }

  // Favorite operations
  static addFavorite(userId: string, carId: string): MockFavorite {
    const favorite: MockFavorite = {
      userId,
      carId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const key = `${userId}_${carId}`;
    mockFavorites.set(key, favorite);
    return favorite;
  }

  static removeFavorite(userId: string, carId: string): boolean {
    const key = `${userId}_${carId}`;
    return mockFavorites.delete(key);
  }

  static getFavorites(userId: string): MockFavorite[] {
    return Array.from(mockFavorites.values()).filter(fav => fav.userId === userId);
  }

  static getFavoriteCars(userId: string): MockCar[] {
    const userFavorites = this.getFavorites(userId);
    const carIds = userFavorites.map(fav => fav.carId);
    return carIds.map(carId => mockCars.get(carId)).filter(Boolean) as MockCar[];
  }

  static isFavorite(userId: string, carId: string): boolean {
    const key = `${userId}_${carId}`;
    return mockFavorites.has(key);
  }

  // Car operations
  static getCar(carId: string): MockCar | null {
    return mockCars.get(carId) || null;
  }

  static getAllCars(): MockCar[] {
    return Array.from(mockCars.values());
  }

  // Booking operations
  static createBooking(bookingData: Omit<MockBooking, '_id' | 'createdAt' | 'updatedAt'>): MockBooking {
    const booking: MockBooking = {
      ...bookingData,
      _id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockBookings.set(booking._id, booking);
    return booking;
  }

  static getBooking(bookingId: string): MockBooking | null {
    return mockBookings.get(bookingId) || null;
  }

  static getUserBookings(userId: string): MockBooking[] {
    return Array.from(mockBookings.values()).filter(booking => booking.userId === userId);
  }

  static updateBooking(bookingId: string, updates: Partial<MockBooking>): MockBooking | null {
    const booking = mockBookings.get(bookingId);
    if (!booking) return null;

    const updatedBooking = {
      ...booking,
      ...updates,
      updatedAt: new Date()
    };
    
    mockBookings.set(bookingId, updatedBooking);
    return updatedBooking;
  }

  static deleteBooking(bookingId: string): boolean {
    return mockBookings.delete(bookingId);
  }

  static getAllBookings(): MockBooking[] {
    return Array.from(mockBookings.values());
  }

  // Utility methods
  static clear(): void {
    mockSessions.clear();
    mockFavorites.clear();
    mockCars.clear();
    mockBookings.clear();
    
    // Re-initialize sample cars
    sampleCars.forEach(car => {
      mockCars.set(car._id, car);
    });
  }

  static getStats(): { sessions: number; favorites: number; cars: number; bookings: number } {
    return {
      sessions: mockSessions.size,
      favorites: mockFavorites.size,
      cars: mockCars.size,
      bookings: mockBookings.size
    };
  }
}

export default MockDatabase;
