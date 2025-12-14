import { Booking, BookingStatus } from "@/types";

/**
 * Booking service for managing user bookings
 */
export class BookingService {
  /**
   * Get all bookings for a specific user
   */
  static async getUserBookings(): Promise<Booking[]> {
    try {
      const response = await fetch('/api/bookings', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view your bookings');
        }
        throw new Error('Failed to load bookings');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  /**
   * Get a single booking by ID
   */
  static async getBookingById(bookingId: string): Promise<Booking | null> {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch booking');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  /**
   * Cancel a booking
   */
  static async cancelBooking(bookingId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel booking');
      }
      
      return true;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  /**
   * Filter bookings by status
   */
  static filterBookingsByStatus(bookings: Booking[], status: BookingStatus | "all"): Booking[] {
    if (status === "all") {
      return bookings;
    }
    return bookings.filter(booking => booking.status === status);
  }

  /**
   * Get booking statistics for a user
   */
  static async getBookingStats() {
    const bookings = await this.getUserBookings();
    
    return {
      total: bookings.length,
      upcoming: bookings.filter(b => b.status === "upcoming").length,
      active: bookings.filter(b => b.status === "active").length,
      completed: bookings.filter(b => b.status === "completed").length,
      cancelled: bookings.filter(b => b.status === "cancelled").length,
      totalSpent: bookings
        .filter(b => b.status === "completed")
        .reduce((sum, booking) => sum + booking.totalAmount, 0)
    };
  }

  /**
   * Check if a booking can be cancelled
   */
  static canCancelBooking(booking: Booking): boolean {
    // Can't cancel completed or already cancelled bookings
    if (booking.status === "completed" || booking.status === "cancelled") {
      return false;
    }

    // Can't cancel if pickup date is within 24 hours
    const pickupDate = new Date(booking.pickupDate);
    const now = new Date();
    const hoursUntilPickup = (pickupDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return hoursUntilPickup > 24;
  }

  /**
   * Get upcoming bookings (next 7 days)
   */
  static async getUpcomingBookings(): Promise<Booking[]> {
    const bookings = await this.getUserBookings();
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return bookings.filter(booking => {
      const pickupDate = new Date(booking.pickupDate);
      return booking.status === "upcoming" && 
             pickupDate >= now && 
             pickupDate <= nextWeek;
    });
  }
}
