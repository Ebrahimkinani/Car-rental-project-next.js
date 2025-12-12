"use client";

import { useState } from "react";
import useSWR from "swr";

interface Category {
  id: string;
  name: string;
}

interface AvailabilityResponse {
  success: boolean;
  data: {
    availableCount: number;
    filters: {
      carType: string | null;
      branch: string | null;
      date: string | null;
      time: string | null;
    };
  };
}

const fetcher = (url: string) => 
  fetch(url, { credentials: 'include' }).then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  });

export function CarAvailabilityForm() {
  const [carType, setCarType] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availabilityResult, setAvailabilityResult] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Fetch categories for car type dropdown
  const { data: categoriesData } = useSWR<{ success: boolean; data: Category[] }>(
    '/api/categories',
    fetcher
  );

  const categories = categoriesData?.data || [];

  const handleCheckAvailability = async () => {
    if (!date || !time) {
      alert("Please select both date and time");
      return;
    }

    setIsChecking(true);
    try {
      const params = new URLSearchParams();
      if (carType) params.append('carType', carType);
      if (branch) params.append('branch', branch);
      if (date) params.append('date', date);
      if (time) params.append('time', time);

      const response = await fetch(`/api/admin/availability?${params}`);
      const result: AvailabilityResponse = await response.json();
      
      if (result.success) {
        setAvailabilityResult(result.data.availableCount);
      } else {
        console.error('Failed to check availability:', result);
        alert('Failed to check availability');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      alert('Error checking availability');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-3">
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); handleCheckAvailability(); }}>
        <div className="grid grid-cols-2 gap-2">
          <select 
            className="w-full rounded border p-2 text-sm"
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
          >
            <option value="">Car Type</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <select 
            className="w-full rounded border p-2 text-sm"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="">Branch</option>
            <option value="Doha">Doha</option>
            <option value="Al Wakrah">Al Wakrah</option>
            <option value="Al Khor">Al Khor</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input 
            className="w-full rounded border p-2 text-sm" 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input 
            className="w-full rounded border p-2 text-sm" 
            type="time" 
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full rounded bg-zinc-900 p-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
          disabled={isChecking}
        >
          {isChecking ? "Checking..." : "Check Availability"}
        </button>
      </form>

      {/* Display availability result */}
      {availabilityResult !== null && (
        <div className="mt-4 p-3 rounded bg-primary-50 border border-primary-200">
          <div className="text-sm font-medium text-primary-900">
            Available Cars: {availabilityResult}
          </div>
          <div className="text-xs text-primary-700 mt-1">
            {/* TODO: Add booking conflict checking in availability (date range overlap) */}
            Based on current filters
          </div>
        </div>
      )}
    </div>
  );
}