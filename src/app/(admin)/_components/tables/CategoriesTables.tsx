/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import type { Category } from "@/types";
import ActivePill from "@/app/(admin)/_components/ui/ActivePill";

type SortKey = keyof Category;

type Props = {
  data: Category[];
  onEdit: (row: Category) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function CategoriesTable({ data, onEdit, onToggle, onDelete }: Props) {
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "name", dir: "asc" });
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const sorted = useMemo(() => {
    const c = [...data];
    c.sort((a, b) => {
      const A = a[sort.key] as any; const B = b[sort.key] as any;
      if (typeof A === "number" && typeof B === "number") return sort.dir === "asc" ? A - B : B - A;
      return sort.dir === "asc" ? String(A ?? "").localeCompare(String(B ?? "")) : String(B ?? "").localeCompare(String(A ?? ""));
    });
    return c;
  }, [data, sort]);

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const start = (page - 1) * pageSize;
  const rows = sorted.slice(start, start + pageSize);

  function header(label: string, key: SortKey) {
    return (
      <button
        className="flex items-center gap-1"
        onClick={() => setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }))}
        aria-label={`Sort by ${label}`}
      >
        {label}
        <span className="text-xs text-zinc-400">{sort.key === key ? (sort.dir === "asc" ? "▲" : "▼") : ""}</span>
      </button>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-secondary-gradient">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-50 text-zinc-600">
          <tr>
            <th className="px-4 py-2 text-left font-medium">{header("Name", "name")}</th>
            <th className="px-4 py-2 text-left font-medium">{header("Code", "code")}</th>
            <th className="px-4 py-2 text-left font-medium">{header("Status", "status")}</th>
            <th className="px-4 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((c) => (
            <tr key={c.id} className="hover:bg-zinc-50">
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  {c.imageUrl && (
                    <img 
                      src={c.imageUrl} 
                      alt={c.name}
                      className="w-8 h-8 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <span className="font-medium">{c.name}</span>
                    {c.description && (
                      <div className="text-xs text-zinc-500 truncate max-w-48" title={c.description}>
                        {c.description}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-2">
                <span className="font-mono text-sm bg-zinc-100 px-2 py-1 rounded">{c.code}</span>
              </td>
              <td className="px-4 py-2"><ActivePill status={c.status} /></td>
              <td className="px-4 py-2 text-right">
                <div className="inline-flex gap-2">
                  <button className="rounded border px-2 py-1 text-xs" onClick={() => onEdit(c)}>Edit</button>
                  <button className="rounded border px-2 py-1 text-xs" onClick={() => onToggle(c.id)}>{c.status === "Active" ? "Hide" : "Activate"}</button>
                  <button className="rounded border px-2 py-1 text-xs" onClick={() => onDelete(c.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr><td colSpan={4} className="px-4 py-8 text-center text-zinc-500">No categories found.</td></tr>
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t px-4 py-2 text-sm">
        <span className="text-zinc-500">Showing {(start + 1)}–{Math.min(start + pageSize, sorted.length)} of {sorted.length}</span>
        <div className="flex items-center gap-2">
          <button className="rounded border px-2 py-1 disabled:opacity-50" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
          <span className="text-zinc-700">{page}/{pages}</span>
          <button className="rounded border px-2 py-1 disabled:opacity-50" disabled={page===pages} onClick={()=>setPage(p=>Math.min(pages,p+1))}>Next</button>
        </div>
      </div>
    </div>
  );
}