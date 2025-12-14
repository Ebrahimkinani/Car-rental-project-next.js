"use client";

import { useEffect, useMemo, useState } from "react";
import type { OrgSettings, Currency, Timezone, DateFormat, Branch } from "../../_components/types/Settings";
import Section from "../../_components/forms/Section";
import TextField from "../../_components/forms/TextField";
import SelectField from "../../_components/forms/SelectField";
import ColorField from "../../_components/forms/ColorField";
import FileDrop from "../../_components/forms/fileDrop";
import ToggleField from "../../_components/forms/ToggleField";  

const DEFAULTS: OrgSettings = {
  orgName: "Wheelzie Rentals",
  orgEmail: "admin@wheelzie.co",
  phone: "+974 5555 5555",
  currency: "QAR",
  timezone: "Asia/Qatar",
  dateFormat: "yyyy-MM-dd",
  branches: [
    { id: "b1", name: "Doha", address: "C-Ring Road, Doha" },
    { id: "b2", name: "Al Wakrah", address: "Main St, Al Wakrah" },
  ],
  notifications: {
    bookingCreated: true,
    bookingCancelled: true,
    lowInventory: true,
    monthlySummary: false,
  },
  branding: {
    logoUrl: "",
    primaryColor: "#0a0a0a",
  },
  security: {
    require2FA: true,
    passwordMinLen: 8,
    sessionTimeoutMins: 30,
  },
};

export default function SettingsPage() {
  const [model, setModel] = useState<OrgSettings>(DEFAULTS);
  const [initial, setInitial] = useState<OrgSettings>(DEFAULTS);
  const dirty = useMemo(() => JSON.stringify(model) !== JSON.stringify(initial), [model, initial]);
  const validEmail = useMemo(() => /^\S+@\S+\.\S+$/.test(model.orgEmail), [model.orgEmail]);
  const canSave = dirty && model.orgName.trim().length > 1 && validEmail;

  useEffect(() => {
    // Example: load settings from API here, then setInitial + setModel
    // For now we use DEFAULTS.
  }, []);

  function update<K extends keyof OrgSettings>(key: K, value: OrgSettings[K]) {
    setModel(prev => ({ ...prev, [key]: value }));
  }

  function updateBranch(id: string, patch: Partial<Branch>) {
    update("branches", model.branches.map(b => b.id === id ? { ...b, ...patch } : b));
  }

  function addBranch() {
    const next: Branch = { id: `b${Date.now()}`, name: "New Branch", address: "" };
    update("branches", [...model.branches, next]);
  }

  function removeBranch(id: string) {
    update("branches", model.branches.filter(b => b.id !== id));
  }

  function save() {
    // Replace with real API call
    // eslint-disable-next-line no-console
    console.warn("[SettingsPage] Saving settings", model);
    setInitial(model);
    alert("Settings saved.");
  }

  function reset() {
    setModel(initial);
  }

  const currencyOpts = useMemo(() => ([
    { value: "QAR" as Currency, label: "QAR – Qatari Riyal" },
    { value: "USD" as Currency, label: "USD – US Dollar" },
    { value: "EUR" as Currency, label: "EUR – Euro" },
    { value: "GBP" as Currency, label: "GBP – British Pound" },
  ]), []);

  const tzOpts = useMemo(() => ([
    { value: "Asia/Qatar" as Timezone, label: "Asia/Qatar (UTC+03:00)" },
    { value: "Asia/Dubai" as Timezone, label: "Asia/Dubai (UTC+04:00)" },
    { value: "UTC" as Timezone, label: "UTC" },
    { value: "Europe/London" as Timezone, label: "Europe/London (UTC±00:00)" },
  ]), []);

  const dateOpts = useMemo(() => ([
    { value: "yyyy-MM-dd" as DateFormat, label: "2025-10-22 (yyyy-MM-dd)" },
    { value: "dd/MM/yyyy" as DateFormat, label: "22/10/2025 (dd/MM/yyyy)" },
    { value: "MM/dd/yyyy" as DateFormat, label: "10/22/2025 (MM/dd/yyyy)" },
  ]), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-lg font-semibold">Settings</h1>
        <div className="flex gap-2">
          <button className="rounded border px-3 py-2 text-sm" onClick={reset} disabled={!dirty}>Discard</button>
          <button
            className="rounded bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-50"
            onClick={save}
            disabled={!canSave}
            aria-disabled={!canSave}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Organization */}
      <Section title="Organization" description="Basic organization profile and contact details.">
        <TextField id="orgName" label="Organization Name" value={model.orgName} onChange={(v: string)=>update("orgName", v)} required />
        <TextField id="orgEmail" label="Organization Email" type="email" value={model.orgEmail} onChange={(v: string)=>update("orgEmail", v)} required description={validEmail ? "" : "Please enter a valid email."} />
        <TextField id="phone" label="Phone" type="tel" value={model.phone ?? ""} onChange={(v: string)=>update("phone", v)} placeholder="+974 ..." />
      </Section>

      {/* Regional */}
      <Section title="Regional" description="Currency, timezone, and date formatting used across the app.">
        <SelectField id="currency" label="Currency" value={model.currency} onChange={(v: string)=>update("currency", v as Currency)} options={currencyOpts} />
        <SelectField id="timezone" label="Timezone" value={model.timezone} onChange={(v: string)=>update("timezone", v as Timezone)} options={tzOpts} />
        <SelectField id="dateFormat" label="Date Format" value={model.dateFormat} onChange={(v: string)=>update("dateFormat", v as DateFormat)} options={dateOpts} />
      </Section>

      {/* Branding */}
      <Section title="Branding" description="Logo and primary theme color.">
        <FileDrop id="logo" label="Logo" hint="PNG or SVG. This is a mock upload for now." onFile={(f: File)=>update("branding", { ...model.branding, logoUrl: URL.createObjectURL(f) })} />
        <ColorField id="primaryColor" label="Primary Color" value={model.branding.primaryColor} onChange={(v)=>update("branding", { ...model.branding, primaryColor: v })} />
        {model.branding.logoUrl ? (
          <div className="sm:col-span-2">
            <div className="rounded border p-3">
              <div className="text-xs text-zinc-500 mb-2">Logo Preview</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={model.branding.logoUrl} alt="Logo preview" className="h-12" width={48} height={48} />
            </div>
          </div>
        ) : null}
      </Section>

      {/* Branches */}
      <section className="rounded-xl border bg-secondary-gradient p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Branches</h2>
            <p className="mt-1 text-xs text-zinc-500">Manage rental locations shown in bookings and units.</p>
          </div>
          <button className="rounded border px-3 py-2 text-sm" onClick={addBranch}>Add Branch</button>
        </div>
        <div className="grid gap-3">
          {model.branches.map((b)=>(
            <div key={b.id} className="grid gap-3 rounded border p-3 sm:grid-cols-3">
              <TextField id={`bname-${b.id}`} label="Name" value={b.name} onChange={(v: string)=>updateBranch(b.id, { name: v })} />
              <TextField id={`baddr-${b.id}`} label="Address" value={b.address} onChange={(v: string)=>updateBranch(b.id, { address: v })} />
              <div className="flex items-end justify-end">
                <button className="rounded border px-3 py-2 text-sm" onClick={()=>removeBranch(b.id)}>Remove</button>
              </div>
            </div>
          ))}
          {!model.branches.length && <p className="text-sm text-zinc-500">No branches. Add one to get started.</p>}
        </div>
      </section>

      {/* Notifications */}
      <Section title="Notifications" description="Control which events send email notifications.">
        <ToggleField id="n1" label="Booking Created" checked={model.notifications.bookingCreated} onChange={(v: boolean)=>update("notifications", { ...model.notifications, bookingCreated: v })} />
        <ToggleField id="n2" label="Booking Cancelled" checked={model.notifications.bookingCancelled} onChange={(v: boolean)=>update("notifications", { ...model.notifications, bookingCancelled: v })} />
        <ToggleField id="n3" label="Low Inventory Alerts" checked={model.notifications.lowInventory} onChange={(v: boolean)=>update("notifications", { ...model.notifications, lowInventory: v })} />
        <ToggleField id="n4" label="Monthly Summary" checked={model.notifications.monthlySummary} onChange={(v: boolean)=>update("notifications", { ...model.notifications, monthlySummary: v })} />
      </Section>

      {/* Security */}
      <Section title="Security" description="Authentication and session controls.">
        <ToggleField id="s1" label="Require 2FA for all users" checked={model.security.require2FA} onChange={(v: boolean)=>update("security", { ...model.security, require2FA: v })} />
        <TextField id="s2" label="Password Minimum Length" type="number" min={6} step={1} value={String(model.security.passwordMinLen)} onChange={(v: string)=>update("security", { ...model.security, passwordMinLen: Math.max(6, Number(v||0)) })} description="Minimum 6 characters." />
        <TextField id="s3" label="Session Timeout (minutes)" type="number" min={5} step={5} value={String(model.security.sessionTimeoutMins)} onChange={(v: string)=>update("security", { ...model.security, sessionTimeoutMins: Math.max(5, Number(v||0)) })} />
      </Section>
    </div>
  );
}