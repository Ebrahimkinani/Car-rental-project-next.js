import { Booking } from "@/types";
import { MOCK_SEED_BOOKINGS } from "@/data/mock-bookings";

/** @deprecated Use getBookings() from @/lib/mock-data or /api/bookings instead */
export const sampleBookings: Booking[] = MOCK_SEED_BOOKINGS.filter(
  (b) => b.userId === "mock-customer"
);
