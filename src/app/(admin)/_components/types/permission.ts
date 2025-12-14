export type Role = "Admin" | "Manager" | "Agent" | "Viewer";

export type PermAction = "view" | "create" | "edit" | "delete" | "export" | "manage";

export type ModuleKey =
  | "dashboard"
  | "bookings"
  | "units"
  | "clients"
  | "financials_income"
  | "financials_expenses"
  | "calendar"
  | "messages"
  | "settings"
  | "permissions";

export type ModuleDef = { key: ModuleKey; label: string; actions: PermAction[] };

export type RoleMatrix = Record<Role, Record<ModuleKey, Record<PermAction, boolean>>>;