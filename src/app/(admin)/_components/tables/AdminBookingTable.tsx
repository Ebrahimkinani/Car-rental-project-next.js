"use client";
import { useState, useEffect } from "react";
import { StatusPill } from "../ui/StatusPill";

// Types matching the API response
export interface AdminBookingRow {
  id: string;
  bookingNumber: string;
  client: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
  car: {
    id: string;
    make: string;
    model: string;
    plateNumber: string;
    type: string;
  };
  pickupDate: string;
  dropoffDate: string;
  status: 'active' | 'pending' | 'cancelled' | 'confirmed' | 'upcoming' | 'completed';
  totalAmount: number;
  createdAt: string;
}

export interface AdminBookingsResponse {
  data: AdminBookingRow[];
  page: number;
  pageCount: number;
  total: number;
}

type Props = {
  scope: "all" | "active" | "pending" | "cancelled";
  query: string;
  carType: string;
  dateFrom?: string;
  dateTo?: string;
};

export default function BookingsTable({ scope, query, carType, dateFrom, dateTo }: Props) {
  const [bookings, setBookings] = useState<AdminBookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  // Fetch bookings from API
  const fetchBookings = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        status: scope,
        search: query,
        carType: carType,
        page: pageNum.toString(),
        limit: pageSize.toString(),
        ...(dateFrom && { from: dateFrom }),
        ...(dateTo && { to: dateTo })
      });

      const response = await fetch(`/api/admin/bookings?${params}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.status}`);
      }

      const data: AdminBookingsResponse = await response.json();
      setBookings(data.data);
      setPage(data.page);
      setPageCount(data.pageCount);
      setTotal(data.total);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchBookings(1);
    setPage(1);
  }, [scope, query, carType, dateFrom, dateTo]);

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pageCount) {
      fetchBookings(newPage);
    }
  };

  // Handle action buttons
  const handleView = (bookingId: string) => {
    // TODO: Implement view booking modal/page
    console.log('View booking:', bookingId);
  };

  const handleEdit = (bookingId: string) => {
    // TODO: Implement edit booking modal/page
    console.log('Edit booking:', bookingId);
  };

  const handleDelete = (bookingId: string) => {
    // TODO: Implement delete booking with confirmation
    console.log('Delete booking:', bookingId);
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border bg-secondary-gradient">
        <div className="p-8 text-center">
          <div className="text-gray-500">Loading bookings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-xl border bg-secondary-gradient">
        <div className="p-8 text-center">
          <div className="text-red-500 mb-2">Error loading bookings</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={() => fetchBookings(page)}
            className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-secondary-gradient">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-50 text-zinc-600">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Booking #</th>
            <th className="px-4 py-2 text-left font-medium">Client</th>
            <th className="px-4 py-2 text-left font-medium">Car</th>
            <th className="px-4 py-2 text-left font-medium">Type</th>
            <th className="px-4 py-2 text-left font-medium">Pickup</th>
            <th className="px-4 py-2 text-left font-medium">Dropoff</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
            <th className="px-4 py-2 text-right font-medium">Total</th>
            <th className="px-4 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-zinc-50">
              <td className="px-4 py-2">{booking.bookingNumber}</td>
              <td className="px-4 py-2">
                <div className="flex flex-col">
                  <span className="font-medium">{booking.client.fullName}</span>
                  <span className="text-xs text-zinc-500">{booking.client.email}</span>
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="flex flex-col">
                  <span>{booking.car.make} {booking.car.model}</span>
                  <span className="text-xs text-zinc-500">{booking.car.plateNumber}</span>
                </div>
              </td>
              <td className="px-4 py-2">{booking.car.type}</td>
              <td className="px-4 py-2">{booking.pickupDate}</td>
              <td className="px-4 py-2">{booking.dropoffDate}</td>
              <td className="px-4 py-2">
                <StatusPill status={booking.status} />
              </td>
              <td className="px-4 py-2 text-right">${booking.totalAmount.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">
                <div className="inline-flex gap-2">
                  <button 
                    className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                    onClick={() => handleView(booking.id)}
                  >
                    View
                  </button>
                  <button 
                    className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                    onClick={() => handleEdit(booking.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                    onClick={() => handleDelete(booking.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {!bookings.length && (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-zinc-500">
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div className="flex items-center justify-between border-t px-4 py-2 text-sm">
        <span className="text-zinc-500">
          Showing {bookings.length > 0 ? ((page - 1) * pageSize + 1) : 0}–{Math.min(page * pageSize, total)} of {total}
        </span>
        <div className="flex items-center gap-2">
          <button
            className="rounded border px-2 py-1 disabled:opacity-50 hover:bg-gray-50"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Prev
          </button>
          <span className="text-zinc-700">{page}/{pageCount}</span>
          <button
            className="rounded border px-2 py-1 disabled:opacity-50 hover:bg-gray-50"
            disabled={page === pageCount}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
