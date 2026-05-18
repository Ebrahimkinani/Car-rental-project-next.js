import type { Booking, Car } from "@/types";
import {
  MOCK_USERS,
  type MockUserRecord,
  type MockUserRole,
} from "@/data/mock-users";
import {
  getStoreCarById,
  getStoreBookingsByUser,
  addStoreBooking,
  removeStoreBooking,
  updateStoreBookingStatus,
} from "@/lib/mock-store";

type AuthStoreGlobal = {
  users: MockUserRecord[];
  favorites: Map<string, Set<string>>;
};

const globalKey = "_mockAuthStoreGlobal" as const;

function getAuthStore(): AuthStoreGlobal {
  const g = global as typeof global & { [globalKey]?: AuthStoreGlobal };
  if (!g[globalKey]) {
    g[globalKey] = {
      users: structuredClone(MOCK_USERS),
      favorites: new Map(),
    };
  }
  return g[globalKey]!;
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function findMockUserByEmail(email: string): MockUserRecord | null {
  const normalized = normalizeEmail(email);
  return getAuthStore().users.find((u) => normalizeEmail(u.email) === normalized) ?? null;
}

export function findMockUserById(id: string): MockUserRecord | null {
  return getAuthStore().users.find((u) => u.id === id) ?? null;
}

export function validateMockPassword(user: MockUserRecord, password: string): boolean {
  return user.password === password;
}

export function registerMockUser(input: {
  email: string;
  password: string;
  role?: MockUserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
}): MockUserRecord {
  const store = getAuthStore();
  const normalized = normalizeEmail(input.email);

  if (store.users.some((u) => normalizeEmail(u.email) === normalized)) {
    throw new Error("User with this email already exists");
  }

  const user: MockUserRecord = {
    id: `mock-user-${Date.now()}`,
    email: normalized,
    password: input.password,
    role: input.role ?? "customer",
    status: "active",
    firstName: input.firstName ?? "New",
    lastName: input.lastName ?? "User",
    phone: input.phone,
    branch: "Doha",
    tier: "Regular",
    joined: new Date().toISOString().split("T")[0],
  };

  store.users.push(user);
  return user;
}

export function getMockFavoriteCars(userId: string): Car[] {
  const carIds = getAuthStore().favorites.get(userId);
  if (!carIds?.size) return [];

  return Array.from(carIds)
    .map((id) => getStoreCarById(id))
    .filter((car): car is Car => car !== null);
}

export function addMockFavorite(userId: string, carId: string): void {
  const store = getAuthStore();
  if (!store.favorites.has(userId)) {
    store.favorites.set(userId, new Set());
  }
  store.favorites.get(userId)!.add(carId);
}

export function removeMockFavorite(userId: string, carId: string): boolean {
  const set = getAuthStore().favorites.get(userId);
  if (!set) return false;
  return set.delete(carId);
}

export function isMockFavorite(userId: string, carId: string): boolean {
  return getAuthStore().favorites.get(userId)?.has(carId) ?? false;
}

export function getMockBookings(userId: string): Booking[] {
  return getStoreBookingsByUser(userId);
}

export function getMockBookingById(userId: string, bookingId: string): Booking | null {
  const booking = getStoreBookingsByUser(userId).find((b) => b.id === bookingId);
  return booking ?? null;
}

export function createMockBooking(
  userId: string,
  data: {
    carId: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    returnLocation?: string;
    pickupTime: string;
    returnTime: string;
    rentalDays: number;
    dailyRate: number;
    totalAmount: number;
    notes?: string;
    driverAge?: string;
    additionalDriver?: boolean;
    insurance?: string;
  }
): Booking {
  const car = getStoreCarById(data.carId);
  if (!car) {
    throw new Error("Car not found");
  }

  const booking: Booking = {
    id: `booking-${Date.now()}`,
    userId,
    carId: data.carId,
    carName: car.name,
    carModel: `${car.year ?? new Date().getFullYear()} ${car.brand} ${car.model}`,
    carImage: car.images?.[0] ?? "/images/placeholder-car.jpg",
    status: "upcoming",
    pickupDate: data.pickupDate,
    returnDate: data.returnDate,
    pickupLocation: data.pickupLocation,
    returnLocation: data.returnLocation,
    pickupTime: data.pickupTime,
    returnTime: data.returnTime,
    rentalDays: data.rentalDays,
    dailyRate: data.dailyRate,
    totalAmount: data.totalAmount,
    paymentStatus: "paid",
    bookingDate: new Date().toISOString().split("T")[0]!,
    notes: data.notes,
    driverAge: data.driverAge,
    additionalDriver: data.additionalDriver,
    insurance: data.insurance,
  };

  addStoreBooking(booking);
  return booking;
}

export function deleteMockBooking(userId: string, bookingId: string): boolean {
  return removeStoreBooking(bookingId, userId);
}

export function updateMockBookingStatus(
  userId: string,
  bookingId: string,
  status: Booking["status"]
): Booking | null {
  return updateStoreBookingStatus(bookingId, userId, status);
}

export function toPublicMockUser(user: MockUserRecord) {
  return {
    id: user.id,
    email: user.email,
    role: user.role.toLowerCase(),
    status: user.status.toLowerCase(),
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
  };
}
