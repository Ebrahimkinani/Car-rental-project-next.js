/**
 * CSV Export Utility
 * Converts data arrays to CSV format
 */

export interface CSVExportOptions {
  filename?: string;
  headers?: string[];
  delimiter?: string;
}

/**
 * Convert array of objects to CSV string
 */
export function arrayToCSV(data: Record<string, any>[], options: CSVExportOptions = {}): string {
  const { delimiter = ',' } = options;
  
  if (!data.length) {
    return '';
  }

  // Get headers from first object keys
  const headers = options.headers || Object.keys(data[0]);
  
  // Escape CSV values
  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }
    
    const stringValue = String(value);
    
    // If value contains delimiter, newline, or quote, wrap in quotes and escape quotes
    if (stringValue.includes(delimiter) || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  };

  // Create CSV rows
  const csvRows = [
    // Header row
    headers.map(header => escapeCSV(header)).join(delimiter),
    // Data rows
    ...data.map(row => 
      headers.map(header => escapeCSV(row[header])).join(delimiter)
    )
  ];

  return csvRows.join('\n');
}

/**
 * Download CSV file in browser
 */
export function downloadCSV(csvContent: string, filename: string = 'export.csv'): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Generate CSV filename with timestamp
 */
export function generateCSVFilename(prefix: string = 'export'): string {
  const now = new Date();
  const timestamp = now.toISOString().split('T')[0]; // YYYY-MM-DD
  return `${prefix}_${timestamp}.csv`;
}
