"use client";
import { useState } from 'react';

interface ExportFilters {
  status: string;
  search: string;
  carType: string;
  dateFrom?: string;
  dateTo?: string;
}

export function useCSVExport() {
  const [exporting, setExporting] = useState(false);

  const exportBookings = async (filters: ExportFilters) => {
    try {
      setExporting(true);

      const response = await fetch('/api/admin/bookings/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error('Failed to export bookings');
      }

      // Get the CSV content
      const csvContent = await response.text();
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export bookings. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return {
    exportBookings,
    exporting
  };
}
