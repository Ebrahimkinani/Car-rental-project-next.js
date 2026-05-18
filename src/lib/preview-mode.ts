import { USE_MOCK_DATA } from "@/lib/data-source";

/** UI preview mode — no database required */
export const IS_PREVIEW_MODE = USE_MOCK_DATA;

/** Default staff user shown in admin topbar during preview */
export const PREVIEW_STAFF_USER = {
  id: "mock-admin",
  email: "admin@demo.com",
  firstName: "Demo",
  lastName: "Admin",
  fullName: "Demo Admin",
  username: "admin",
  role: "admin",
  status: "active",
  permissions: [] as string[],
  authProvider: "email" as const,
  createdAt: new Date("2023-01-10"),
  updatedAt: new Date(),
};
