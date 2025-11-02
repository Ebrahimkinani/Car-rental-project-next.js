"use client";
import { useMemo, useState } from "react";
import type { Client } from "../types/client";
import { ClientStatusPill } from "../ui/ClientStatusPill";
import { ClientTierPill } from "../ui/ClientTierPill";

type SortKey = keyof Client;
type SortDirection = "asc" | "desc";

interface SortState {
  key: SortKey;
  dir: SortDirection;
}

interface ClientsTableProps {
  data: Client[];
  onSort?: (key: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageCount?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}

export default function ClientsTable({ 
  data, 
  onSort, 
  sortBy = "name", 
  sortOrder = "asc", 
  page = 1, 
  pageCount = 1, 
  total = 0, 
  onPageChange 
}: ClientsTableProps) {
  // Use external pagination and sorting if provided, otherwise use internal state
  const [internalSort, setInternalSort] = useState<SortState>({ key: "name", dir: "asc" });
  const [internalPage, setInternalPage] = useState(1);
  const pageSize = 8;

  // Determine if we're using external or internal pagination/sorting
  const useExternal = onSort && onPageChange;
  
  const currentSort = useMemo(() => 
    useExternal ? { key: sortBy as SortKey, dir: sortOrder as SortDirection } : internalSort,
    [useExternal, sortBy, sortOrder, internalSort]
  );
  const currentPage = useExternal ? page : internalPage;

  const sorted = useMemo(() => {
    if (useExternal) {
      // If using external sorting, data is already sorted by the API
      return data;
    }
    
    // Internal sorting logic
    const clients = [...data];
    clients.sort((a, b) => {
      const valueA = a[currentSort.key];
      const valueB = b[currentSort.key];
      const stringA = String(valueA ?? "");
      const stringB = String(valueB ?? "");
      return currentSort.dir === "asc" 
        ? stringA.localeCompare(stringB) 
        : stringB.localeCompare(stringA);
    });
    return clients;
  }, [data, currentSort, useExternal]);

  const pages = useExternal ? pageCount : Math.max(1, Math.ceil(sorted.length / pageSize));
  const start = useExternal ? (currentPage - 1) * pageSize : (currentPage - 1) * pageSize;
  const rows = useExternal ? sorted : sorted.slice(start, start + pageSize);
  const totalCount = useExternal ? total : sorted.length;

  const handleSort = (key: SortKey) => {
    if (useExternal && onSort) {
      onSort(key);
    } else {
      setInternalSort(prevSort => ({
        key,
        dir: prevSort.key === key && prevSort.dir === "asc" ? "desc" : "asc"
      }));
    }
  };

  const TableHeader = ({ label, sortKey }: { label: string; sortKey: SortKey }) => (
    <button 
      onClick={() => handleSort(sortKey)} 
      className="flex items-center gap-1"
    >
      {label}
      <span className="text-xs text-zinc-400">
        {currentSort.key === sortKey ? (currentSort.dir === "asc" ? "▲" : "▼") : ""}
      </span>
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border bg-secondary-gradient">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-50 text-zinc-600">
          <tr>
            <th className="px-4 py-2 text-left font-medium">
              <TableHeader label="Name" sortKey="name" />
            </th>
            <th className="px-4 py-2 text-left font-medium">
              <TableHeader label="Email" sortKey="email" />
            </th>
            <th className="px-4 py-2 text-left font-medium">
              <TableHeader label="Phone" sortKey="phone" />
            </th>
            <th className="px-4 py-2 text-left font-medium">Branch</th>
            <th className="px-4 py-2 text-left font-medium">Tier</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
            <th className="px-4 py-2 text-right font-medium">
              <TableHeader label="Bookings" sortKey="bookings" />
            </th>
            <th className="px-4 py-2 text-right font-medium">Total Spent</th>
            <th className="px-4 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map(client => (
            <tr key={client.id} className="hover:bg-zinc-50">
              <td className="px-4 py-2 font-medium">{client.name}</td>
              <td className="px-4 py-2">{client.email}</td>
              <td className="px-4 py-2">{client.phone}</td>
              <td className="px-4 py-2">{client.branch}</td>
              <td className="px-4 py-2">
                <ClientTierPill tier={client.tier} />
              </td>
              <td className="px-4 py-2">
                <ClientStatusPill status={client.status} />
              </td>
              <td className="px-4 py-2 text-right">{client.bookings}</td>
              <td className="px-4 py-2 text-right">
                ${client.totalSpent.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right">
                <div className="inline-flex gap-2">
                  {/* TODO: implement client actions */}
                  <button className="rounded border px-2 py-1 text-xs">
                    View
                  </button>
                  <button className="rounded border px-2 py-1 text-xs">
                    Edit
                  </button>
                  <button className="rounded border px-2 py-1 text-xs">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-zinc-500">
                No clients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t px-4 py-2 text-sm">
        <span className="text-zinc-500">
          Showing {start + 1}–{Math.min(start + pageSize, totalCount)} of {totalCount}
        </span>
        <div className="flex items-center gap-2">
          <button 
            className="rounded border px-2 py-1 disabled:opacity-50" 
            disabled={currentPage === 1} 
            onClick={() => {
              if (useExternal && onPageChange) {
                onPageChange(currentPage - 1);
              } else {
                setInternalPage(p => Math.max(1, p - 1));
              }
            }}
          >
            Prev
          </button>
          <span className="text-zinc-700">{currentPage}/{pages}</span>
          <button 
            className="rounded border px-2 py-1 disabled:opacity-50" 
            disabled={currentPage === pages} 
            onClick={() => {
              if (useExternal && onPageChange) {
                onPageChange(currentPage + 1);
              } else {
                setInternalPage(p => Math.min(pages, p + 1));
              }
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}