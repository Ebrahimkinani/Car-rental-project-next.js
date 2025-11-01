"use client";

import { useState, useEffect, useMemo } from "react";
import { BookingStatus, Booking } from "@/types";
import BookingCard from "@/components/bookings/BookingCard";
import BookingFilters from "@/components/bookings/BookingFilters";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";

export default function BookingsPage() {
  const [activeFilter, setActiveFilter] = useState<BookingStatus | "all">("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  
  // Load user bookings
  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/bookings', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view your bookings');
        }
        throw new Error('Failed to load bookings');
      }
      
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter bookings based on active filter
  const filteredBookings = useMemo(() => {
    if (activeFilter === "all") {
      return bookings;
    }
    return bookings.filter(booking => booking.status === activeFilter);
  }, [bookings, activeFilter]);

  // Get booking statistics
  const stats = useMemo(() => {
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
  }, [bookings]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel booking');
      }
      
      // Refresh bookings after successful cancellation
      await loadBookings();
      alert("Booking cancelled successfully!");
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert(err instanceof Error ? err.message : "Unable to cancel booking. Please contact support.");
    }
  };

  const handleFilterChange = (filter: BookingStatus | "all") => {
    setActiveFilter(filter);
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-gray-500 text-lg">Loading...</div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-100">
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              {/* Hero Icon */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full shadow-lg">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>

              {/* Main Content */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Bookings
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Sign in to view and manage your car rental bookings
              </p>
              <p className="text-gray-500 mb-12 max-w-lg mx-auto">
                Create an account or sign in to access your booking history, 
                manage upcoming reservations, and track your rental activity.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/auth/login"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign In
                </a>
                <a
                  href="/auth/register"
                  className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Create Account
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show loading state while fetching bookings
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-gray-500 text-lg">Loading your bookings...</div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show error state if there's an error loading bookings
  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-4">Error loading bookings</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button
                onClick={loadBookings}
                variant="primary"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">
              My Bookings
            </h1>
            <p className="text-lg text-gray-600">
              Manage your car rental bookings and reservations
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{stats.upcoming}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-orange-600">{stats.active}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <BookingFilters
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Bookings Grid */}
          {filteredBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancelBooking}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-500 mb-6">
                {activeFilter === "all" 
                  ? "You haven't made any bookings yet."
                  : `No ${activeFilter} bookings found.`
                }
              </p>
              <Button
                onClick={() => window.location.href = "/"}
                variant="primary"
              >
                Browse Cars
              </Button>
            </div>
          )}

          {/* Quick Actions */}
          {bookings.length > 0 && (
            <div className="mt-12 bg-primary-50 rounded-2xl p-6 border border-primary-200">
              <h3 className="text-lg font-semibold text-primary-900 mb-3">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "/"}
                  className="border-primary-300 text-primary-700 hover:bg-primary-100"
                >
                  Book Another Car
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "/contact"}
                  className="border-primary-300 text-primary-700 hover:bg-primary-100"
                >
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="border-primary-300 text-primary-700 hover:bg-primary-100"
                >
                  Print Bookings
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
