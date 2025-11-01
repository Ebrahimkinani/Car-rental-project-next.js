export type Currency = "USD" | "QAR" | "EUR" | "GBP";
export type Timezone = "Asia/Qatar" | "UTC" | "Asia/Dubai" | "Europe/London";
export type DateFormat = "yyyy-MM-dd" | "dd/MM/yyyy" | "MM/dd/yyyy";

export type Branch = {
  id: string;
  name: string;
  address: string;
};

export type NotificationPrefs = {
  bookingCreated: boolean;
  bookingCancelled: boolean;
  lowInventory: boolean;
  monthlySummary: boolean;
};

export type Branding = {
  logoUrl?: string;
  primaryColor: string;   // hex
};

export type OrgSettings = {
  orgName: string;
  orgEmail: string;
  phone?: string;
  currency: Currency;
  timezone: Timezone;
  dateFormat: DateFormat;
  branches: Branch[];
  notifications: NotificationPrefs;
  branding: Branding;
  security: {
    require2FA: boolean;
    passwordMinLen: number;
    sessionTimeoutMins: number;
  };
};