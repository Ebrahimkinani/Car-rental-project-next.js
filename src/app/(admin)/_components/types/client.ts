export type ClientStatus = "Active" | "Inactive" | "Suspended";
export type ClientTier = "Regular" | "Silver" | "Gold" | "Platinum";
export type ClientBranch = "Doha" | "Al Wakrah" | "Al Khor";

export interface Client {
  readonly id: string;
  name: string;
  email: string;
  phone: string;
  branch: ClientBranch;
  joined: string; // ISO date string
  status: ClientStatus;
  tier: ClientTier;
  bookings: number;
  totalSpent: number;
  avatar?: string;
}