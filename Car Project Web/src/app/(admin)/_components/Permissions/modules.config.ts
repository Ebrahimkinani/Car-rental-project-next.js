import type { ModuleDef, PermAction } from "../types/permission";

const CRUD: PermAction[] = ["view", "create", "edit", "delete"];
const READ_EXPORT: PermAction[] = ["view", "export"];
const ADMIN: PermAction[] = ["view", "manage"];

export const MODULES: ModuleDef[] = [
  { key: "dashboard",           label: "Dashboard",          actions: ["view"] },
  { key: "bookings",            label: "Bookings",           actions: CRUD.concat("export") },
  { key: "units",               label: "Units (Cars)",       actions: CRUD.concat("export") },
  { key: "clients",             label: "Clients",            actions: CRUD.concat("export") },
  { key: "financials_income",   label: "Financials • Income",actions: READ_EXPORT },
  { key: "financials_expenses", label: "Financials • Expenses",actions: READ_EXPORT },
  { key: "calendar",            label: "Calendar",           actions: ["view","create","edit","delete"] },
  { key: "messages",            label: "Messages",           actions: ["view","create","delete"] },
  { key: "settings",            label: "Settings",           actions: ["view","edit"] },
  { key: "permissions",         label: "Permissions",        actions: ADMIN },
];