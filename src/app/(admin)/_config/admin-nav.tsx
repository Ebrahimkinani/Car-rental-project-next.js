
import {
  LayoutDashboard, CalendarCheck2, Car, Users, Wallet,
  ShieldCheck, Settings, MessageSquare, CircleDollarSign, ReceiptText, Tags
} from "lucide-react";

export type NavItem = {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
};

export const adminNav: NavItem[] = [
  { label: "Dashboard",  href: "/admin/dashboard",  icon: LayoutDashboard },
  { label: "Bookings",   href: "/admin/bookings",   icon: CalendarCheck2 },
  { label: "Units",      href: "/admin/units",      icon: Car },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Clients",    href: "/admin/clients",    icon: Users },
  {
    label: "Financials", icon: Wallet,
    children: [
      { label: "Income",   href: "/admin/financials/income",   icon: CircleDollarSign },
      { label: "Expenses", href: "/admin/financials/expenses", icon: ReceiptText }
    ]
  },
  { label: "Permissions", href: "/admin/permissions", icon: ShieldCheck },
  { label: "Settings",    href: "/admin/settings",    icon: Settings },
  { label: "Messages",    href: "/admin/messages",    icon: MessageSquare }
];