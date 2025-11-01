"use client";

import { useCallback, useState } from "react";
import type { User, UserRole, Branch, UserStatus } from "../Users/Types/User";

type Props = {
  onCreate: (user: Omit<User, "id" | "joined" | "permissions">) => void;
};

const ROLES: UserRole[] = ["Admin", "Manager", "Employee", "Viewer"];
const BRANCHES: Branch[] = ["Doha", "Al Wakrah", "Al Khor"];

export default function UserCreationForm({ onCreate }: Props) {
  const [creating, setCreating] = useState(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [form, setForm] = useState<{
    name: string; email: string; password: string; role: UserRole; branch: Branch; status: UserStatus;
  }>({ name: "", email: "", password: "", role: "Employee", branch: "Doha", status: "Active" });

  const validatePassword = (password: string): string => {
    if (!password) return "";
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const submit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!form.name || !form.email || !form.password) {
      setPasswordError(form.password ? "" : "Password is required");
      return;
    }

    // Validate password length
    const error = validatePassword(form.password);
    if (error) {
      setPasswordError(error);
      return;
    }

    setPasswordError("");
    onCreate({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      branch: form.branch,
      status: form.status,
      phone: undefined,
    });
    setCreating(false);
    setForm({ name: "", email: "", password: "", role: "Employee", branch: "Doha", status: "Active" });
  }, [form, onCreate]);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Add New Employee/Manager</h2>
        {!creating && (
          <button
            type="button"
            className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
            onClick={() => setCreating(true)}
          >
            + Add New User
          </button>
        )}
      </div>

      {/* Form Section */}
      {creating && (
        <div className="rounded-xl border bg-secondary-gradient p-6">
          <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">Full Name</label>
                <input
                  required
                  className="w-full rounded border border-zinc-300 p-3 text-sm focus:border-zinc-500 focus:outline-none"
                  value={form.name}
                  onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">Email</label>
                <input
                  required
                  type="email"
                  className="w-full rounded border border-zinc-300 p-3 text-sm focus:border-zinc-500 focus:outline-none"
                  value={form.email}
                  onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Password</label>
              <input
                required
                type="password"
                className={`w-full rounded border p-3 text-sm focus:outline-none ${
                  passwordError 
                    ? "border-red-500 focus:border-red-500" 
                    : "border-zinc-300 focus:border-zinc-500"
                }`}
                value={form.password}
                onChange={(e) => {
                  const newPassword = e.target.value;
                  setForm(s => ({ ...s, password: newPassword }));
                  // Real-time validation
                  if (newPassword) {
                    setPasswordError(validatePassword(newPassword));
                  } else {
                    setPasswordError("");
                  }
                }}
                placeholder="Enter password"
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
              {!passwordError && form.password && (
                <p className="mt-1 text-xs text-zinc-500">Password must be at least 6 characters</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">Role</label>
                <select
                  className="w-full rounded border border-zinc-300 p-3 text-sm focus:border-zinc-500 focus:outline-none"
                  value={form.role}
                  onChange={(e) => setForm(s => ({ ...s, role: e.target.value as UserRole }))}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">Branch</label>
                <select
                  className="w-full rounded border border-zinc-300 p-3 text-sm focus:border-zinc-500 focus:outline-none"
                  value={form.branch}
                  onChange={(e) => setForm(s => ({ ...s, branch: e.target.value as Branch }))}
                >
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">Status</label>
                <select
                  className="w-full rounded border border-zinc-300 p-3 text-sm focus:border-zinc-500 focus:outline-none"
                  value={form.status}
                  onChange={(e) => setForm(s => ({ ...s, status: e.target.value as UserStatus }))}
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-zinc-200">
              <button 
                type="submit" 
                className="flex-1 rounded bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
              >
                Create User
              </button>
              <button 
                type="button" 
                className="flex-1 rounded border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors" 
                onClick={() => {
                  setCreating(false);
                  setPasswordError("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
