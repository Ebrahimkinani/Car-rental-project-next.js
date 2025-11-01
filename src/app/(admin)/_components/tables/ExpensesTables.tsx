"use client";
import { useMemo, useState } from "react";
import type { Expense } from "../types/ExpenseTypes";
import { ExpenseStatusPill } from "../ui/ExpenseStatusPill";

type SortKey = keyof Expense;

export default function ExpensesTable({ data }: { data: Expense[] }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc"|"desc" }>({ key: "date", dir: "desc" });
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const sorted = useMemo(()=>{
    const c = [...data];
    c.sort((a,b)=>{
      const A = a[sort.key]; const B = b[sort.key];
      if (typeof A === "number" && typeof B === "number") return sort.dir==="asc" ? A-B : B-A;
      const va = String(A); const vb = String(B);
      return sort.dir==="asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return c;
  }, [data, sort]);

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const start = (page-1)*pageSize;
  const rows = sorted.slice(start, start+pageSize);

  function header(label: string, key: SortKey) {
    return (
      <button
        className="flex items-center gap-1"
        onClick={()=>setSort(s=>({ key, dir: s.key===key && s.dir==="asc" ? "desc":"asc" }))}
      >
        {label}
        <span className="text-xs text-zinc-400">{sort.key===key ? (sort.dir==="asc"?"▲":"▼") : ""}</span>
      </button>
    );
  }

  const totalPage = rows.reduce((acc,r)=>acc + r.amount, 0);

  return (
    <div className="overflow-hidden rounded-xl border bg-secondary-gradient">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-50 text-zinc-600">
          <tr>
            <th className="px-4 py-2 text-left font-medium">{header("Date","date")}</th>
            <th className="px-4 py-2 text-left font-medium">{header("Category","category")}</th>
            <th className="px-4 py-2 text-left font-medium">Vendor</th>
            <th className="px-4 py-2 text-left font-medium">Description</th>
            <th className="px-4 py-2 text-left font-medium">{header("Method","method")}</th>
            <th className="px-4 py-2 text-left font-medium">{header("Status","status")}</th>
            <th className="px-4 py-2 text-right font-medium">{header("Amount","amount")}</th>
            <th className="px-4 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((e)=>(
            <tr key={e.id} className="hover:bg-zinc-50">
              <td className="px-4 py-2">{e.date}</td>
              <td className="px-4 py-2">{e.category}</td>
              <td className="px-4 py-2">{e.vendor}</td>
              <td className="px-4 py-2">{e.description}</td>
              <td className="px-4 py-2">{e.method}</td>
              <td className="px-4 py-2"><ExpenseStatusPill status={e.status} /></td>
              <td className="px-4 py-2 text-right">${e.amount.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">
                <div className="inline-flex gap-2">
                  <button className="rounded border px-2 py-1 text-xs">View</button>
                  <button className="rounded border px-2 py-1 text-xs">Edit</button>
                  <button className="rounded border px-2 py-1 text-xs">Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr><td colSpan={8} className="px-4 py-8 text-center text-zinc-500">No expenses found.</td></tr>
          )}
        </tbody>
        <tfoot className="bg-zinc-50">
          <tr>
            <td colSpan={6} className="px-4 py-2 text-right font-medium">Page Total</td>
            <td className="px-4 py-2 text-right font-semibold">${totalPage.toLocaleString()}</td>
            <td />
          </tr>
        </tfoot>
      </table>

      <div className="flex items-center justify-between border-t px-4 py-2 text-sm">
        <span className="text-zinc-500">
          Showing {(start + 1)}–{Math.min(start + pageSize, sorted.length)} of {sorted.length}
        </span>
        <div className="flex items-center gap-2">
          <button className="rounded border px-2 py-1 disabled:opacity-50" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
          <span className="text-zinc-700">{page}/{pages}</span>
          <button className="rounded border px-2 py-1 disabled:opacity-50" disabled={page===pages} onClick={()=>setPage(p=>Math.min(pages,p+1))}>Next</button>
        </div>
      </div>
    </div>
  );
}