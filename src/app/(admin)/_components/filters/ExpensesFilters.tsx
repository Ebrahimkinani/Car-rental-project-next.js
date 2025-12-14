"use client";

type Props = {
  category: string; onCategory: (v: string)=>void;
  vendor: string; onVendor: (v: string)=>void;
  method: string; onMethod: (v: string)=>void;
  status: string; onStatus: (v: string)=>void;
  dateFrom: string; onDateFrom: (v: string)=>void;
  dateTo: string; onDateTo: (v: string)=>void;
  minAmt: string; onMinAmt: (v: string)=>void;
  maxAmt: string; onMaxAmt: (v: string)=>void;
  query: string; onQuery: (v: string)=>void;
};

const CATS = ["All","Fuel","Maintenance","Salaries","Rent","Utilities","Insurance","Other"];
const METHODS = ["All","Card","Cash","Money Transfer","Wallet"];
const STATUSES = ["All","Pending","Posted","Refunded"];

export default function ExpenseFilters(p: Props) {
  return (
    <div className="space-y-4">
      {/* Main filters row with three dropdowns */}
      <div className="grid gap-3 md:grid-cols-3">
        <select className="rounded border p-2 text-sm" value={p.status} onChange={(e)=>p.onStatus(e.target.value)}>
          {STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
        <select className="rounded border p-2 text-sm" value={p.category} onChange={(e)=>p.onCategory(e.target.value)}>
          {CATS.map(c=><option key={c}>{c}</option>)}
        </select>
        <select className="rounded border p-2 text-sm" value={p.method} onChange={(e)=>p.onMethod(e.target.value)}>
          {METHODS.map(m=><option key={m}>{m}</option>)}
        </select>
      </div>
      
      {/* Additional filters row */}
      <div className="grid gap-3 md:grid-cols-4">
        <input className="rounded border p-2 text-sm" placeholder="Search (desc/vendor)…" value={p.query} onChange={(e)=>p.onQuery(e.target.value)} />
        <input className="rounded border p-2 text-sm" placeholder="Vendor" value={p.vendor} onChange={(e)=>p.onVendor(e.target.value)} />
        <input className="rounded border p-2 text-sm" type="date" value={p.dateFrom} onChange={(e)=>p.onDateFrom(e.target.value)} />
        <input className="rounded border p-2 text-sm" type="date" value={p.dateTo} onChange={(e)=>p.onDateTo(e.target.value)} />
      </div>
      
      {/* Amount filters row */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-2">
          <input className="rounded border p-2 text-sm" type="number" step="0.01" placeholder="Min $" value={p.minAmt} onChange={(e)=>p.onMinAmt(e.target.value)} />
          <input className="rounded border p-2 text-sm" type="number" step="0.01" placeholder="Max $" value={p.maxAmt} onChange={(e)=>p.onMaxAmt(e.target.value)} />
        </div>
      </div>
    </div>
  );
}