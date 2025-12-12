"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import type { ModuleKey, PermAction, Role, RoleMatrix } from "../../_components/types/permission";
import { MODULES } from "../../_components/Permissions/modules.config";
import PermissionsMatrix from "../../_components/Permissions/PermissionsMatrix";
import UsersPanel from "../../_components/Permissions/UsersPanle";
import UserCreationForm from "../../_components/Permissions/UserCreationForm";
import type { User, UserRole, PermissionSet } from "../../_components/Users/Types/User";

/** Roles shown in matrix */
const ROLES: Role[] = ["Admin", "Manager", "Agent", "Viewer"];

/** Convert user permissions to matrix format for a single role */
function permissionsToMatrix(permissions: PermissionSet[]): Record<ModuleKey, Record<PermAction, boolean>> {
  const matrix: any = {};
  
  // Create matrix for all modules, regardless of role
  for (const m of MODULES) {
    matrix[m.key] = {};
    for (const a of m.actions) {
      const perm = permissions.find(p => p.module === m.key);
      matrix[m.key][a] = perm?.[a] ?? false;
    }
  }
  
  return matrix;
}

/** Convert role matrix to permissions array */
function matrixToPermissions(matrix: Record<ModuleKey, Record<PermAction, boolean>>): PermissionSet[] {
  const permissions: PermissionSet[] = [];
  
  for (const m of MODULES) {
    const perm: PermissionSet = { module: m.key };
    for (const a of m.actions) {
      if (matrix[m.key][a]) {
        perm[a] = true;
      }
    }
    permissions.push(perm);
  }
  
  return permissions;
}

/** Build default empty matrix */
function buildDefaultMatrix(): RoleMatrix {
  const base: RoleMatrix = {
    Admin: {} as any, Manager: {} as any, Agent: {} as any, Viewer: {} as any,
  };
  for (const role of ROLES) {
    for (const m of MODULES) {
      (base[role] as any)[m.key] = {};
      for (const a of m.actions) {
        (base[role] as any)[m.key][a] = false;
      }
    }
  }
  return base;
}

export default function PermissionsPage() {
  // users state
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        if (data.users) {
          setUsers(data.users);
          if (data.users.length > 0) {
            setSelectedUserId(data.users[0].id);
          }
        }
      } catch (err) {
        setError('Failed to load users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // matrix state
  const [filter, setFilter] = useState("");
  const [matrix, setMatrix] = useState<RoleMatrix>(() => buildDefaultMatrix());

  // current role = role of selected user (falls back to Manager for empty)
  const selectedUser = useMemo(() => users.find(u => u.id === selectedUserId), [users, selectedUserId]);
  const role: Role = (selectedUser?.role === "Employee" ? "Agent" : (selectedUser?.role ?? "Manager")) as Role;

  // Update matrix when user is selected
  useEffect(() => {
    if (selectedUser) {
      // If user has permissions, load them; otherwise use empty defaults
      const userMatrix = permissionsToMatrix(selectedUser.permissions || []);
      
      // Update the matrix for this role with the user's permissions
      setMatrix((prev) => ({ ...prev, [role]: userMatrix as any }));
    }
  }, [selectedUser, role]);

  // matrix handlers
  const handleToggle = useCallback((args: { role: Role; module: ModuleKey; action: PermAction; value: boolean }) => {
    setMatrix(prev => ({
      ...prev,
      [args.role]: {
        ...prev[args.role],
        [args.module]: {
          ...prev[args.role][args.module],
          [args.action]: args.value,
        },
      },
    }));
  }, []);

  const handleRowAll = useCallback((args: { role: Role; module: ModuleKey; value: boolean }) => {
    setMatrix(prev => {
      const mod = prev[args.role][args.module];
      const next = { ...mod };
      for (const a of MODULES.find(m => m.key === args.module)!.actions) next[a] = args.value;
      return { ...prev, [args.role]: { ...prev[args.role], [args.module]: next } };
    });
  }, []);

  const handleColAll = useCallback((args: { role: Role; action: PermAction; value: boolean }) => {
    setMatrix(prev => {
      const nextRole = { ...prev[args.role] };
      for (const m of MODULES) {
        if (!m.actions.includes(args.action)) continue;
        nextRole[m.key] = { ...nextRole[m.key], [args.action]: args.value };
      }
      return { ...prev, [args.role]: nextRole };
    });
  }, []);

  const summary = useMemo(() => {
    if (!role || !matrix[role]) return { on: 0, total: 0 };
    const entries = Object.entries(matrix[role]) as [ModuleKey, Record<PermAction, boolean>][];
    let on = 0, total = 0;
    for (const [mk, actions] of entries) {
      const def = MODULES.find(m => m.key === mk)!;
      for (const a of def.actions) { total++; if (actions[a]) on++; }
    }
    return { on, total };
  }, [matrix, role]);

  // user handlers
  const onCreateUser = useCallback(async (payload: Omit<User, "id" | "joined" | "permissions">) => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      // Refresh users list
      const usersResponse = await fetch('/api/admin/users');
      const usersData = await usersResponse.json();
      if (usersData.users) {
        setUsers(usersData.users);
        setSelectedUserId(data.user.id);
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      console.error('Error creating user:', err);
    } finally {
      setSaving(false);
    }
  }, []);

  const onUpdateUserRole = useCallback(async (id: string, next: UserRole) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: next })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update role');
      }

      // Update local state
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: next } : u));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
      console.error('Error updating role:', err);
    }
  }, []);

  const save = useCallback(async () => {
    if (!selectedUserId) return;
    
    try {
      setSaving(true);
      
      // Convert matrix to permissions
      const permissions = matrixToPermissions(matrix[role] as Record<ModuleKey, Record<PermAction, boolean>>);
      
      const response = await fetch(`/api/admin/users/${selectedUserId}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save permissions');
      }

      // Update local permissions
      setUsers(prev => prev.map(u => 
        u.id === selectedUserId ? { ...u, permissions } : u
      ));
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save permissions');
      console.error('Error saving permissions:', err);
    } finally {
      setSaving(false);
    }
  }, [matrix, role, selectedUserId]);

  const resetRole = useCallback(() => {
    setMatrix(buildDefaultMatrix());
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-lg font-semibold">Permissions</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-zinc-500">Selected user:</span>
          <span className="font-medium">{selectedUser?.name ?? "—"}</span>
          <span className="text-zinc-400">•</span>
          <span className="text-zinc-500">Role:</span>
          <span className="font-medium">{selectedUser?.role ?? "—"} {selectedUser?.role === "Employee" ? "(Agent matrix)" : ""}</span>
          <span className="text-zinc-400">•</span>
          <span className="text-zinc-500">{summary.on}/{summary.total} enabled</span>
          <div className="ml-3 flex gap-2">
            <button className="rounded border px-3 py-2 disabled:opacity-50" disabled={saving || !selectedUser} onClick={resetRole}>Reset</button>
            <button className="rounded bg-zinc-900 px-3 py-2 text-white disabled:opacity-50" disabled={!selectedUser || saving} onClick={save}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded border border-red-300 bg-red-50/50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* User Creation Form at the top */}
      <UserCreationForm onCreate={onCreateUser} />

      {/* Two-column layout: Users | Matrix */}
      <div className="grid gap-6 lg:grid-cols-3">
        <UsersPanel
          users={users}
          selectedId={selectedUserId}
          onSelect={setSelectedUserId}
          onUpdateRole={onUpdateUserRole}
        />

        <section className="lg:col-span-2 space-y-3">
          <div className="rounded-xl border bg-secondary-gradient p-4">
            <label htmlFor="module-search" className="mb-1 block text-xs font-medium text-zinc-600">
              Filter Modules
            </label>
            <input
              id="module-search"
              className="w-full rounded border p-2 text-sm"
              placeholder="Search modules (e.g., bookings, finance)…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <PermissionsMatrix
            role={role}
            matrix={matrix}
            onToggle={handleToggle}
            onRowAll={handleRowAll}
            onColAll={handleColAll}
            readOnly={role === "Viewer"}
            filter={filter}
          />
        </section>
      </div>
    </div>
  );
}