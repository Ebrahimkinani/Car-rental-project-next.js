import { Booking, Car, Category } from "@/types";
import { MOCK_CARS, createMockCar } from "@/data/mock-cars";
import { MOCK_CATEGORIES } from "@/data/mock-categories";
import { MOCK_SEED_BOOKINGS } from "@/data/mock-bookings";
import { MOCK_EXPENSES } from "@/data/mock-expenses";
import type { Expense } from "@/app/(admin)/_components/types/ExpenseTypes";
import type { AdminBookingRow } from "@/app/(admin)/_components/tables/AdminBookingTable";
import {
  MOCK_USERS,
  type MockUserRecord,
} from "@/data/mock-users";
import type { Client } from "@/app/(admin)/_components/types/client";

// Temporary mock data mode for UI/UX client preview. Replace with database queries later.

type MockStoreGlobal = {
  cars: Car[];
  categories: Category[];
  bookings: Booking[];
  expenses: Expense[];
};

const globalKey = "_mockStoreGlobal" as const;

function getStore(): MockStoreGlobal {
  const g = global as typeof global & { [globalKey]?: MockStoreGlobal };
  if (!g[globalKey]) {
    g[globalKey] = {
      cars: structuredClone(MOCK_CARS),
      categories: structuredClone(MOCK_CATEGORIES),
      bookings: structuredClone(MOCK_SEED_BOOKINGS),
      expenses: structuredClone(MOCK_EXPENSES),
    };
  }
  return g[globalKey]!;
}

function generateBookingNumber(id: string): string {
  const year = new Date().getFullYear();
  const paddedId = id.replace(/\D/g, "").slice(-3).padStart(3, "0");
  return `BKG-${year}${paddedId}`;
}

function findMockUser(userId: string): MockUserRecord | undefined {
  return MOCK_USERS.find((u) => u.id === userId);
}

function getCategoryName(categoryId?: string): string {
  if (!categoryId) return "Unknown";
  const cat = getStore().categories.find((c) => c.id === categoryId);
  return cat?.name ?? "Unknown";
}

// --- Cars ---

export function getStoreCars(): Car[] {
  return getStore().cars;
}

export function getStoreCarById(id: string): Car | null {
  return getStore().cars.find((c) => c.id === id) ?? null;
}

export function addStoreCar(data: Omit<Car, "id" | "createdAt" | "updatedAt">): Car {
  const car = createMockCar(data);
  getStore().cars.push(car);
  return car;
}

export function updateStoreCar(
  id: string,
  updates: Partial<Omit<Car, "id" | "createdAt">>
): Car {
  const store = getStore();
  const index = store.cars.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Car not found: ${id}`);
  }
  const updated: Car = {
    ...store.cars[index]!,
    ...updates,
    updatedAt: new Date(),
  };
  store.cars[index] = updated;
  return updated;
}

export function deleteStoreCar(id: string): boolean {
  const store = getStore();
  const index = store.cars.findIndex((c) => c.id === id);
  if (index === -1) return false;
  store.cars.splice(index, 1);
  return true;
}

// --- Categories ---

export function getStoreCategories(): Category[] {
  return getStore().categories;
}

export function getStoreCategoryById(id: string): Category | null {
  return getStore().categories.find((c) => c.id === id) ?? null;
}

export function getStoreCategoryBySlug(slug: string): Category | null {
  return getStore().categories.find((c) => c.slug === slug) ?? null;
}

export function addStoreCategory(
  data: Omit<Category, "id" | "createdAt" | "updatedAt">
): Category {
  const id = `cat-${Date.now()}`;
  const ts = new Date();
  const category: Category = { ...data, id, createdAt: ts, updatedAt: ts };
  getStore().categories.push(category);
  return category;
}

export function updateStoreCategory(
  id: string,
  updates: Partial<Omit<Category, "id" | "createdAt">>
): Category {
  const store = getStore();
  const index = store.categories.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Category not found: ${id}`);
  }
  const updated: Category = {
    ...store.categories[index]!,
    ...updates,
    updatedAt: new Date(),
  };
  store.categories[index] = updated;
  return updated;
}

export function deleteStoreCategory(id: string): boolean {
  const store = getStore();
  const index = store.categories.findIndex((c) => c.id === id);
  if (index === -1) return false;
  store.categories.splice(index, 1);
  return true;
}

// --- Bookings ---

export function getStoreBookings(): Booking[] {
  return getStore().bookings;
}

export function getStoreBookingsByUser(userId: string): Booking[] {
  return getStore().bookings.filter((b) => b.userId === userId);
}

export function addStoreBooking(booking: Booking): Booking {
  getStore().bookings.unshift(booking);
  return booking;
}

export function removeStoreBooking(bookingId: string, userId?: string): boolean {
  const store = getStore();
  const index = store.bookings.findIndex(
    (b) => b.id === bookingId && (!userId || b.userId === userId)
  );
  if (index === -1) return false;
  store.bookings.splice(index, 1);
  return true;
}

export function updateStoreBookingStatus(
  bookingId: string,
  userId: string,
  status: Booking["status"]
): Booking | null {
  const booking = getStore().bookings.find(
    (b) => b.id === bookingId && b.userId === userId
  );
  if (!booking) return null;
  booking.status = status;
  return booking;
}

export function bookingToAdminRow(booking: Booking): AdminBookingRow {
  const user = findMockUser(booking.userId);
  const car = getStoreCarById(booking.carId);
  const adminStatus = booking.status === "upcoming" ? "pending" : booking.status;

  return {
    id: booking.id,
    bookingNumber: generateBookingNumber(booking.id),
    client: {
      id: booking.userId,
      fullName: user ? `${user.firstName} ${user.lastName}` : `User ${booking.userId}`,
      email: user?.email ?? "",
      phone: user?.phone,
    },
    car: {
      id: booking.carId,
      make: car?.brand ?? booking.carName.split(" ")[0] ?? "Unknown",
      model: car?.model ?? booking.carModel,
      plateNumber: car?.licensePlate ?? "N/A",
      type: getCategoryName(car?.categoryId),
    },
    pickupDate: booking.pickupDate,
    dropoffDate: booking.returnDate,
    status: adminStatus as AdminBookingRow["status"],
    totalAmount: booking.totalAmount,
    createdAt: booking.bookingDate,
  };
}

export function filterAdminBookings(options: {
  status?: string;
  search?: string;
  carType?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}): { data: AdminBookingRow[]; page: number; pageCount: number; total: number } {
  const {
    status = "all",
    search = "",
    carType = "All",
    from = "",
    to = "",
    page = 1,
    limit = 10,
  } = options;

  const q = search.trim().toLowerCase();

  let rows = getStoreBookings().map(bookingToAdminRow);

  if (status !== "all") {
    rows = rows.filter((b) => {
      if (status === "pending") return b.status === "pending" || b.status === "upcoming";
      return b.status === status;
    });
  }

  if (carType !== "All") {
    rows = rows.filter((b) => b.car.type === carType);
  }

  if (from || to) {
    rows = rows.filter((b) => {
      if (from && b.pickupDate < from) return false;
      if (to && b.pickupDate > to) return false;
      return true;
    });
  }

  if (q) {
    rows = rows.filter((b) => {
      const hay = [
        b.bookingNumber,
        b.client.fullName,
        b.client.email,
        b.car.make,
        b.car.model,
        b.car.plateNumber,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = rows.slice(start, start + limit);

  return { data, page, pageCount, total };
}

// --- Clients (derived from mock users) ---

export function getStoreClients(): Client[] {
  return MOCK_USERS.filter((u) => u.role === "customer").map((user) => {
    const userBookings = getStoreBookingsByUser(user.id);
    const completed = userBookings.filter((b) => b.status === "completed");
    const totalSpent = completed.reduce((sum, b) => sum + b.totalAmount, 0);

    const statusMap: Record<MockUserRecord["status"], Client["status"]> = {
      active: "Active",
      suspended: "Suspended",
    };

    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone ?? "N/A",
      branch: user.branch ?? "Doha",
      joined: user.joined ?? "2024-01-01",
      status: statusMap[user.status],
      tier: user.tier ?? "Regular",
      bookings: userBookings.length,
      totalSpent,
    };
  });
}

export function filterStoreClients(options: {
  search?: string;
  branch?: string;
  tier?: string;
  status?: string;
  from?: string;
  to?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}): { data: Client[]; total: number; page: number; pageCount: number } {
  const {
    search = "",
    branch = "All",
    tier = "All",
    status = "All",
    from = "",
    to = "",
    sortBy = "name",
    sortOrder = "asc",
    page = 1,
    limit = 10,
  } = options;

  let clients = getStoreClients();
  const q = search.trim().toLowerCase();

  if (q) {
    clients = clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
    );
  }
  if (branch !== "All") clients = clients.filter((c) => c.branch === branch);
  if (tier !== "All") clients = clients.filter((c) => c.tier === tier);
  if (status !== "All") clients = clients.filter((c) => c.status === status);
  if (from) clients = clients.filter((c) => c.joined >= from);
  if (to) clients = clients.filter((c) => c.joined <= to);

  clients.sort((a, b) => {
    const key = sortBy as keyof Client;
    const av = a[key];
    const bv = b[key];
    if (typeof av === "number" && typeof bv === "number") {
      return sortOrder === "asc" ? av - bv : bv - av;
    }
    return sortOrder === "asc"
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const total = clients.length;
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;

  return {
    data: clients.slice(start, start + limit),
    total,
    page,
    pageCount,
  };
}

export function getStoreClientKpis(): {
  total: number;
  active: number;
  newThisMonth: number;
  suspended: number;
} {
  const clients = getStoreClients();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0]!;

  return {
    total: clients.length,
    active: clients.filter((c) => c.status === "Active").length,
    newThisMonth: clients.filter((c) => c.joined >= startOfMonth).length,
    suspended: clients.filter((c) => c.status === "Suspended").length,
  };
}

export function getStoreClientTrend(days = 30): { date: string; total: number }[] {
  const clients = getStoreClients();
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - Math.max(1, days) + 1);

  const map = new Map<string, number>();
  for (const c of clients) {
    if (c.joined >= start.toISOString().split("T")[0]!) {
      map.set(c.joined, (map.get(c.joined) ?? 0) + 1);
    }
  }

  const points: { date: string; total: number }[] = [];
  const cursor = new Date(start);
  while (cursor <= now) {
    const key = cursor.toISOString().split("T")[0]!;
    points.push({ date: key, total: map.get(key) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  return points;
}

// --- Expenses ---

export function getStoreExpenses(): Expense[] {
  return getStore().expenses;
}

export function filterStoreExpenses(options: {
  status?: string;
  category?: string;
  method?: string;
  vendor?: string;
  search?: string;
  from?: string;
  to?: string;
  min?: string;
  max?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: string;
}): import("@/app/(admin)/_components/types/ExpenseTypes").ExpensesResponse {
  const {
    status = "All",
    category = "All",
    method = "All",
    vendor = "All",
    search = "",
    from = "",
    to = "",
    min = "",
    max = "",
    page = 1,
    limit = 10,
    sortBy = "date",
    sortDir = "desc",
  } = options;

  let items = [...getStoreExpenses()];
  const q = search.trim().toLowerCase();

  if (status !== "All") items = items.filter((e) => e.status === status);
  if (category !== "All") items = items.filter((e) => e.category === category);
  if (method !== "All") items = items.filter((e) => e.method === method);
  if (vendor !== "All")
    items = items.filter((e) => e.vendor.toLowerCase().includes(vendor.toLowerCase()));
  if (from) items = items.filter((e) => e.date >= from);
  if (to) items = items.filter((e) => e.date <= to);
  if (min) items = items.filter((e) => e.amount >= parseFloat(min));
  if (max) items = items.filter((e) => e.amount <= parseFloat(max));
  if (q) {
    items = items.filter(
      (e) =>
        e.description.toLowerCase().includes(q) || e.vendor.toLowerCase().includes(q)
    );
  }

  items.sort((a, b) => {
    const av = a[sortBy as keyof Expense];
    const bv = b[sortBy as keyof Expense];
    const cmp =
      typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
    return sortDir === "desc" ? -cmp : cmp;
  });

  const filteredTotal = items.reduce((s, e) => s + e.amount, 0);
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);

  const now = new Date();
  const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const allExpenses = getStoreExpenses();
  const totalAllTime = allExpenses.reduce((s, e) => s + e.amount, 0);
  const totalThisMonth = allExpenses
    .filter((e) => e.date >= startOfMonth)
    .reduce((s, e) => s + e.amount, 0);

  const categoryTotals = new Map<string, number>();
  for (const e of items) {
    categoryTotals.set(e.category, (categoryTotals.get(e.category) ?? 0) + e.amount);
  }
  let topCategory: string | null = null;
  let topAmount = 0;
  for (const [cat, amt] of categoryTotals) {
    if (amt > topAmount) {
      topAmount = amt;
      topCategory = cat;
    }
  }

  const dates = items.map((e) => e.date).sort();
  const daysDiff =
    dates.length > 1
      ? Math.ceil(
          (new Date(dates[dates.length - 1]!).getTime() - new Date(dates[0]!).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 1;

  const trendMap = new Map<string, number>();
  for (const e of items) {
    trendMap.set(e.date, (trendMap.get(e.date) ?? 0) + e.amount);
  }
  const trend = [...trendMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, totalAmt]) => ({ date, total: totalAmt }));

  return {
    data,
    total,
    page,
    pageCount,
    filteredTotal,
    trend,
    kpis: {
      totalAllTime,
      totalThisMonth,
      avgPerDay: filteredTotal / daysDiff,
      topCategory,
    },
  };
}

// --- Dashboard analytics ---

export interface DashboardStats {
  kpis: {
    totalRevenue: number;
    totalRevenueAllTime: number;
    activeRentals: number;
    newBookings: number;
    availableCars: number;
  };
  earningsWeekly: { week: string; revenue: number }[];
  earningsMonthly: { month: string; revenue: number }[];
  earningsYearly: { year: string; revenue: number }[];
  rentStatus: {
    active: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  bookingsMonthly: { month: string; count: number }[];
  carTypes: { name: string; count: number; percentage: number }[];
}

export function getStoreDashboardStats(): DashboardStats {
  const bookings = getStoreBookings();
  const cars = getStoreCars();

  const paidBookings = bookings.filter(
    (b) => b.paymentStatus === "paid" && b.status !== "cancelled"
  );
  const totalRevenue = paidBookings.reduce((s, b) => s + b.totalAmount, 0);
  const totalRevenueAllTime = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((s, b) => s + b.totalAmount, 0);

  const activeRentals = bookings.filter((b) => b.status === "active").length;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const newBookings = bookings.filter(
    (b) => new Date(b.bookingDate) >= sevenDaysAgo
  ).length;
  const availableCars = cars.filter((c) => c.status === "available").length;

  const rentStatus = {
    active: bookings.filter((b) => b.status === "active").length,
    pending: bookings.filter((b) => b.status === "upcoming").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const bookingsMonthly = monthNames.slice(0, 6).map((month, i) => ({
    month,
    count: bookings.filter((b) => {
      const d = new Date(b.bookingDate);
      return d.getMonth() === i;
    }).length,
  }));

  const earningsWeekly = [
    { week: "W1", revenue: Math.round(totalRevenue * 0.12 / 1000) },
    { week: "W2", revenue: Math.round(totalRevenue * 0.18 / 1000) },
    { week: "W3", revenue: Math.round(totalRevenue * 0.22 / 1000) },
    { week: "W4", revenue: Math.round(totalRevenue * 0.28 / 1000) },
    { week: "W5", revenue: Math.round(totalRevenue * 0.2 / 1000) },
  ];

  const earningsMonthly = monthNames.map((month) => ({
    month,
    revenue: Math.round(
      (bookings
        .filter((b) => {
          const d = new Date(b.bookingDate);
          return monthNames[d.getMonth()] === month && b.paymentStatus === "paid";
        })
        .reduce((s, b) => s + b.totalAmount, 0) /
        1000)
    ),
  }));

  const earningsYearly = [
    { year: "2023", revenue: Math.round(totalRevenueAllTime * 0.35 / 1000) },
    { year: "2024", revenue: Math.round(totalRevenueAllTime * 0.45 / 1000) },
    { year: "2025", revenue: Math.round(totalRevenueAllTime * 0.2 / 1000) },
  ];

  const typeCounts = new Map<string, number>();
  for (const car of cars) {
    const name = getCategoryName(car.categoryId);
    typeCounts.set(name, (typeCounts.get(name) ?? 0) + 1);
  }
  const totalCars = cars.length || 1;
  const carTypes = [...typeCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalCars) * 100),
    }));

  return {
    kpis: {
      totalRevenue: Math.round(totalRevenue),
      totalRevenueAllTime: Math.round(totalRevenueAllTime),
      activeRentals,
      newBookings,
      availableCars,
    },
    earningsWeekly,
    earningsMonthly,
    earningsYearly,
    rentStatus,
    bookingsMonthly,
    carTypes,
  };
}
