export type NotificationType =
  | 'BOOKING_APPROVED'
  | 'PAYMENT_FAILED'
  | 'VEHICLE_CHANGE'
  | 'BOOKING_CANCELLED'
  | 'BOOKING_REMINDER'
  | 'ADMIN_MESSAGE';

export interface CreateNotificationInput {
  userId?: string | null;
  role?: string | null;
  bookingId?: string | null;
  type: NotificationType | string; // allow free-form types
  title: string;
  message: string;
  actionUrl?: string | null;
}


