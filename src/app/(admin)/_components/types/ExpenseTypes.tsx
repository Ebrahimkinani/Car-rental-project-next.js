export type ExpenseMethod = "Card" | "Cash" | "Money Transfer" | "Wallet";
export type ExpenseStatus = "Pending" | "Posted" | "Refunded";

export type Expense = {
  id: string;
  date: string;          // ISO date YYYY-MM-DD
  category: "Fuel" | "Maintenance" | "Salaries" | "Rent" | "Utilities" | "Insurance" | "Other";
  vendor: string;        // e.g., Woqod, Service Center
  description: string;
  method: ExpenseMethod;
  status: ExpenseStatus;
  amount: number;        // in USD for mock
};

export interface DailyPoint {
  date: string;
  total: number;
}

export interface ExpensesKPIs {
  totalAllTime: number;
  totalThisMonth: number;
  avgPerDay: number;
  topCategory: string | null;
}

export interface ExpensesResponse {
  data: Expense[];
  total: number;
  page: number;
  pageCount: number;
  filteredTotal: number;
  trend: DailyPoint[];
  kpis: ExpensesKPIs;
}