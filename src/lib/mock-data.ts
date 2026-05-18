/**
 * Central mock data accessors for UI preview mode (no database).
 * Shapes match @/types and admin API response interfaces.
 */

import type { Booking, Car, PaymentStatus, User } from "@/types";
import {
  getStoreBookings,
  getStoreBookingsByUser,
  getStoreCars,
  getStoreCarById,
  getStoreDashboardStats,
  type DashboardStats,
} from "@/lib/mock-store";
import { MOCK_USERS, type MockUserRecord } from "@/data/mock-users";

export interface MockPayment {
  id: string;
  bookingId: string;
  customerName: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  date: string;
}

function mockUserToUser(record: MockUserRecord): User {
  const now = new Date(record.joined ?? "2024-01-01");
  return {
    id: record.id,
    email: record.email,
    firstName: record.firstName,
    lastName: record.lastName,
    fullName: `${record.firstName} ${record.lastName}`,
    role: record.role,
    status: record.status,
    createdAt: now,
    updatedAt: now,
  };
}

export async function getCars(): Promise<Car[]> {
  return getStoreCars();
}

export async function getCarById(id: string): Promise<Car | null> {
  return getStoreCarById(id);
}

export async function getBookings(userId?: string): Promise<Booking[]> {
  if (userId) return getStoreBookingsByUser(userId);
  return getStoreBookings();
}

export async function getUsers(): Promise<User[]> {
  return MOCK_USERS.map(mockUserToUser);
}

export async function getPayments(): Promise<MockPayment[]> {
  return getStoreBookings().map((b) => {
    const user = MOCK_USERS.find((u) => u.id === b.userId);
    return {
      id: `pay-${b.id}`,
      bookingId: b.id,
      customerName: user ? `${user.firstName} ${user.lastName}` : b.userId,
      amount: b.totalAmount,
      status: b.paymentStatus,
      method: b.paymentStatus === "paid" ? "Card" : "Pending",
      date: b.bookingDate,
    };
  });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return getStoreDashboardStats();
}
