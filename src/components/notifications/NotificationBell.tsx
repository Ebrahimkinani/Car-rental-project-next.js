"use client";


import { useNotifications } from '@/contexts/NotificationProvider';
import { Bell } from 'lucide-react';

export function NotificationBell({ onClick }: { onClick?: () => void }) {
  const { unreadCount } = useNotifications();

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-primary-500 bg-transparent !text-black hover:!text-primary-500 hover:border-primary-600 hover:bg-white transition-colors"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
}


