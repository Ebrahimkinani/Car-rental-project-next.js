export type UserRole = "Admin" | "Manager" | "Employee" | "Viewer";
export type UserStatus = "Active" | "Suspended" | "Inactive";
export type Branch = "Doha" | "Al Wakrah" | "Al Khor";

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

export type PermissionSet = {
  module: ModuleKey;
  view?: boolean;
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
  export?: boolean;
  manage?: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  branch: Branch;
  status: UserStatus;
  joined: string; // ISO date
  permissions?: PermissionSet[];
  // TODO: link dashboard users with Firebase userId for cross-auth sync
  // firebaseUid?: string;
};