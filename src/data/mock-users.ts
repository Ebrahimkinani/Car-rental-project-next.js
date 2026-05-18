// Demo accounts for mock-data / UI preview mode (no database required).

import type { ClientBranch, ClientTier } from "@/app/(admin)/_components/types/client";

export type MockUserRole = "customer" | "employee" | "manager" | "admin";
export type MockUserStatus = "active" | "suspended";

export interface MockUserRecord {
  id: string;
  email: string;
  password: string;
  role: MockUserRole;
  status: MockUserStatus;
  firstName: string;
  lastName: string;
  phone?: string;
  branch?: ClientBranch;
  tier?: ClientTier;
  joined?: string;
}

export const MOCK_DEMO_PASSWORD = "demo12345";

export const MOCK_USERS: MockUserRecord[] = [
  {
    id: "mock-admin",
    email: "admin@demo.com",
    password: MOCK_DEMO_PASSWORD,
    role: "admin",
    status: "active",
    firstName: "Fatima",
    lastName: "Al-Thani",
    phone: "+974 4400 1001",
    branch: "Doha",
    joined: "2023-01-10",
  },
  {
    id: "mock-manager",
    email: "manager@demo.com",
    password: MOCK_DEMO_PASSWORD,
    role: "manager",
    status: "active",
    firstName: "Khalid",
    lastName: "Al-Mansouri",
    phone: "+974 4400 1002",
    branch: "Doha",
    joined: "2023-03-15",
  },
  {
    id: "mock-customer",
    email: "customer@demo.com",
    password: MOCK_DEMO_PASSWORD,
    role: "customer",
    status: "active",
    firstName: "Omar",
    lastName: "Al-Khalid",
    phone: "+974 3344 5566",
    branch: "Doha",
    tier: "Gold",
    joined: "2024-06-12",
  },
  {
    id: "mock-customer-sara",
    email: "sara.ahmed@example.com",
    password: MOCK_DEMO_PASSWORD,
    role: "customer",
    status: "active",
    firstName: "Sara",
    lastName: "Ahmed",
    phone: "+974 5512 8890",
    branch: "Al Wakrah",
    tier: "Silver",
    joined: "2024-08-20",
  },
  {
    id: "mock-customer-noor",
    email: "noor.althani@example.com",
    password: MOCK_DEMO_PASSWORD,
    role: "customer",
    status: "active",
    firstName: "Noor",
    lastName: "Al-Thani",
    phone: "+974 6677 3344",
    branch: "Doha",
    tier: "Platinum",
    joined: "2023-11-05",
  },
  {
    id: "mock-customer-yousef",
    email: "yousef.hassan@example.com",
    password: MOCK_DEMO_PASSWORD,
    role: "customer",
    status: "active",
    firstName: "Yousef",
    lastName: "Hassan",
    phone: "+971 50 123 4567",
    branch: "Doha",
    tier: "Regular",
    joined: "2025-01-08",
  },
  {
    id: "mock-customer-layla",
    email: "layla.mazroui@example.com",
    password: MOCK_DEMO_PASSWORD,
    role: "customer",
    status: "suspended",
    firstName: "Layla",
    lastName: "Al-Mazroui",
    phone: "+971 55 987 6543",
    branch: "Al Khor",
    tier: "Regular",
    joined: "2024-02-14",
  },
  {
    id: "mock-employee",
    email: "employee@demo.com",
    password: MOCK_DEMO_PASSWORD,
    role: "employee",
    status: "active",
    firstName: "Ahmed",
    lastName: "Al-Suwaidi",
    phone: "+974 4400 1003",
    branch: "Al Wakrah",
    joined: "2024-04-01",
  },
];
