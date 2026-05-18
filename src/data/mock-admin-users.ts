import type { User } from "@/app/(admin)/_components/Users/Types/User";

export const MOCK_ADMIN_USERS: User[] = [
  {
    id: "admin-user-1",
    name: "Fatima Al-Thani",
    email: "admin@demo.com",
    role: "Admin",
    branch: "Doha",
    status: "Active",
    joined: "2023-01-10",
    permissions: [
      { module: "dashboard", view: true, manage: true },
      { module: "bookings", view: true, create: true, edit: true, delete: true, export: true },
      { module: "units", view: true, create: true, edit: true, delete: true },
      { module: "clients", view: true, export: true },
      { module: "permissions", view: true, manage: true },
    ],
  },
  {
    id: "admin-user-2",
    name: "Khalid Al-Mansouri",
    email: "manager@demo.com",
    role: "Manager",
    branch: "Doha",
    status: "Active",
    joined: "2023-03-15",
    permissions: [
      { module: "dashboard", view: true },
      { module: "bookings", view: true, create: true, edit: true, export: true },
      { module: "units", view: true, edit: true },
      { module: "clients", view: true },
    ],
  },
  {
    id: "admin-user-3",
    name: "Ahmed Al-Suwaidi",
    email: "employee@demo.com",
    role: "Employee",
    branch: "Al Wakrah",
    status: "Active",
    joined: "2024-04-01",
    permissions: [
      { module: "dashboard", view: true },
      { module: "bookings", view: true, create: true },
      { module: "units", view: true },
    ],
  },
];
