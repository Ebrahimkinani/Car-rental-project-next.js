/**
 * TypeScript type definitions
 * Central location for all type definitions used across the app
 */

/**
 * User types
 */
export interface User {
  id: string;
  firebaseUid?: string; // DEPRECATED: Legacy Firebase UID (no longer used with MongoDB auth)
  username?: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: UserRole;
  status?: 'active' | 'suspended';
  permissions?: string[];
  authProvider?: 'email' | 'google'; // Track authentication method
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = "admin" | "manager" | "employee" | "customer";
export type CarStatus = "available" | "rented" | "maintenance" | "reserved";

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  website?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

/**
 * Product types
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  stock: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Car Category types - Unified system
 */
export type CategoryStatus = "Active" | "Hidden";

export interface Category {
  id: string;
  name: string;
  code: string;
  slug: string; // For URL routing
  status: CategoryStatus;
  sortOrder: number;
  description: string;
  defaultDailyRate?: number;
  seats?: number;
  imageUrl?: string;
  
  // Brand-specific fields (optional)
  country?: string;
  founded?: number;
  
  // Vehicle type-specific fields (optional)
  capacity?: string; // e.g., "2-5 passengers"
  
  // MongoDB preparation fields
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Car types
 */
export interface Car {
  id: string;
  name: string;
  model: string;
  brand: string; // Car manufacturer brand
  brandId: string; // Reference to Brand Category
  categoryId?: string; // MongoDB category reference
  description: string;
  
  // Pricing
  price: number; // Daily rental price
  weeklyRate?: number;
  weeklyRateEnabled?: boolean;
  monthlyRate?: number;
  
  // Core specs
  seats: number;
  doors: number;
  luggageCapacity?: number; // in liters
  
  // 
  engineType?: string; // e.g., "V8", "Inline-6", "Electric Motor"
  horsepower?: number;
  acceleration?: number; // 0-60 mph in seconds
  topSpeed?: number; // in mph
  
  // Existing fields
  images: string[];
  year?: number;
  location?: string;
  mileage?: number;
  fuelType?: "gasoline" | "diesel" | "electric" | "hybrid";
  transmission?: "manual" | "automatic";
  color?: string;
  features?: string[];
  
  // Availability
  available: boolean;
  status?: "available" | "rented" | "maintenance" | "reserved";
  branch?: "Doha" | "Al Wakrah" | "Al Khor";
  
  // Optional identifiers
  vin?: string;
  licensePlate?: string;
  
  // Rental details
  rentalType?: "daily" | "weekly" | "monthly";
  pickupLocation?: string;
  returnLocation?: string;
  minimumRentalDays?: number;
  maximumRentalDays?: number;
  insuranceIncluded?: boolean;
  unlimitedMileage?: boolean;
  rentalTerms?: string[];
  cancellationPolicy?: string;
  
  // Popular car feature
  isPopular?: boolean;
  popularSince?: Date | null;
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Admin types for pricing
 */
export interface PricingSettings {
  weeklyDiscount: number; // percentage
  monthlyDiscount: number; // percentage
}

export interface AdminCarSettings {
  carId: string;
  weeklyRateEnabled: boolean;
  customWeeklyRate?: number;
}

/**
 * API Response types
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Form types
 */
export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
  role?: UserRole;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Theme types
 */
export type Theme = "light" | "dark" | "system";

export interface ThemeConfig {
  theme: Theme;
  systemTheme?: "light" | "dark";
}

/**
 * Navigation types
 */
export interface NavLink {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavLink[];
}

/**
 * Component prop types
 */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export interface InputProps extends BaseComponentProps {
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  hover?: boolean;
}

/**
 * Utility types
 */
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type WithId<T> = T & { id: string };
export type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Payment types
 */
export interface PaymentFormData {
  paymentMethod: "card" | "paypal" | "apple_pay" | "google_pay";
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface BookingSummaryData {
  carName: string;
  carModel: string;
  rentalDays: number;
  dailyRate: number;
  totalAmount: number;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
}

/**
 * Favorites types
 */
export interface Favorite {
  id: string;
  userId: string;
  carId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking types
 */
export type BookingStatus = "upcoming" | "active" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  carName: string;
  carModel: string;
  carImage: string;
  status: BookingStatus;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation?: string;
  pickupTime: string;
  returnTime: string;
  rentalDays: number;
  dailyRate: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  bookingDate: string;
  notes?: string;
  driverAge?: string;
  additionalDriver?: boolean;
  insurance?: string;
}

/**
 * DEPRECATED: Firebase Authentication types
 * These are legacy types kept for backward compatibility.
 * Firebase Auth is no longer used - all authentication is now MongoDB-based.
 */
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string, role?: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

/**
 * HTTP types
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
}

