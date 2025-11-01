"use client";
import { useEffect, useState } from "react";

type Props = {
  query: string;
  onQuery: (v: string) => void;
  carType: string;
  onCarType: (v: string) => void;
  dateFrom: string;
  onDateFrom: (v: string) => void;
  dateTo: string;
  onDateTo: (v: string) => void;
};

export default function BookingFilters({
  query, onQuery, carType, onCarType, dateFrom, onDateFrom, dateTo, onDateTo
}: Props) {
  const [carTypes, setCarTypes] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);

  // Fetch car types from API
  useEffect(() => {
    const fetchCarTypes = async () => {
      try {
        const response = await fetch('/api/admin/car-types');
        if (response.ok) {
          const data = await response.json();
          setCarTypes(data.carTypes || ['All']);
        }
      } catch (error) {
        console.error('Error fetching car types:', error);
        // Fallback to default types if API fails
        setCarTypes(['All', 'SUV', 'Sedan', 'Hatchback', 'Luxury']);
      } finally {
        setLoading(false);
      }
    };

    fetchCarTypes();
  }, []);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <input
        className="w-full rounded border p-2 text-sm"
        placeholder="Search (client, car, plate, booking #)…"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
      />
      <select
        className="w-full rounded border p-2 text-sm"
        value={carType}
        onChange={(e) => onCarType(e.target.value)}
        disabled={loading}
      >
        {carTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <input
        className="w-full rounded border p-2 text-sm"
        type="date"
        placeholder="From"
        value={dateFrom}
        onChange={(e) => onDateFrom(e.target.value)}
      />
      <input
        className="w-full rounded border p-2 text-sm"
        type="date"
        placeholder="To"
        value={dateTo}
        onChange={(e) => onDateTo(e.target.value)}
      />
    </div>
  );
}