"use client";

import { memo, useMemo, useState } from "react";
import type { User, UserRole } from "../Users/Types/User";

type Props = {
  users: User[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onUpdateRole: (id: string, role: UserRole) => void;
  onSearch?: (q: string) => void;
};

const ROLES: UserRole[] = ["Admin", "Manager", "Employee", "Viewer"];

const ListItem = memo(function ListItem({
  u, active, onClick, onUpdateRole
}: { u: User; active: boolean; onClick: () => void; onUpdateRole: (r: UserRole) => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-lg border px-3 py-2 text-left transition-colors",
        active ? "border-zinc-900 bg-zinc-900/5" : "hover:bg-zinc-50"
      ].join(" ")}
      aria-current={active ? "true" : "false"}
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">{u.name}</div>
        <span className="text-xs text-zinc-500">{u.branch}</span>
      </div>
      <div className="mt-0.5 text-xs text-zinc-600">{u.email}</div>
      <div className="mt-2">
        <select
          className="w-full rounded border p-1.5 text-xs"
          value={u.role}
          onChange={(e) => onUpdateRole(e.target.value as UserRole)}
          aria-label={`Change role for ${u.name}`}
        >
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
    </button>
  );
});

export default function UsersPanel({ users, selectedId, onSelect, onUpdateRole, onSearch }: Props) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return users;
    return users.filter(u => (`${u.name} ${u.email}`).toLowerCase().includes(needle));
  }, [q, users]);

  return (
    <aside className="w-full max-w-sm space-y-4">
      <div className="rounded-xl border bg-secondary-gradient p-3">
        <input
          className="w-full rounded border p-2 text-sm"
          placeholder="Search users (name/email)…"
          value={q}
          onChange={(e) => { setQ(e.target.value); onSearch?.(e.target.value); }}
          aria-label="Search users"
        />
      </div>

      <div className="space-y-2">
        {filtered.map(u => (
          <ListItem
            key={u.id}
            u={u}
            active={u.id === selectedId}
            onClick={() => onSelect(u.id)}
            onUpdateRole={(r) => onUpdateRole(u.id, r)}
          />
        ))}
        {!filtered.length && (
          <div className="rounded-lg border bg-secondary-gradient p-4 text-center text-sm text-zinc-500">
            No users found.
          </div>
        )}
      </div>
    </aside>
  );
}