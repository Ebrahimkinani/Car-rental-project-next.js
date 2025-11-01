"use client";

import React from 'react';
import Link from 'next/link';
import { useNotifications } from '@/contexts/NotificationProvider';
import { BellRing, CheckCircle2, Info, CalendarClock, Car, Mail } from 'lucide-react';

function formatRelativeTime(dateString: string) {
  const now = Date.now();
  const ts = new Date(dateString).getTime();
  const diff = Math.max(0, Math.floor((now - ts) / 1000));
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function NotificationDropdown() {
  const { notifications, markAsRead } = useNotifications();

  const unread = notifications.filter((n) => !n.read);

  function TypeIcon({ type }: { type: string }) {
    const common = 'h-4 w-4';
    switch ((type || '').toLowerCase()) {
      case 'success':
      case 'booking:confirmed':
        return <CheckCircle2 className={`${common} text-green-600`} />;
      case 'booking':
      case 'booking:pending':
        return <CalendarClock className={`${common} text-primary-600`} />;
      case 'car':
        return <Car className={`${common} text-amber-600`} />;
      case 'message':
      case 'email':
        return <Mail className={`${common} text-purple-600`} />;
      case 'info':
        return <Info className={`${common} text-zinc-600`} />;
      default:
        return <BellRing className={`${common} text-zinc-600`} />;
    }
  }

  const handleMarkAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unread.length === 0) return;
    await Promise.all(unread.map((n) => markAsRead(n._id)));
  };

  return (
    <div className="absolute right-0 mt-2 w-96 max-h-[460px] overflow-auto rounded-xl border bg-white shadow-xl">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="text-sm font-medium text-zinc-700">Notifications</div>
        <div className="flex items-center gap-2">
          {unread.length > 0 && (
            <button
              onClick={handleMarkAll}
              className="text-xs font-medium text-primary-600 hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>
      <ul className="divide-y">
        {notifications.length === 0 && (
          <li className="p-6 text-sm text-zinc-500">No notifications</li>
        )}
        {notifications.map((n) => (
          <li
            key={n._id}
            className={`p-3 text-sm hover:bg-zinc-50/70 cursor-pointer ${!n.read ? 'bg-zinc-50/80' : ''}`}
            onClick={() => markAsRead(n._id)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <div className={`mt-0.5 rounded-md p-1.5 ${!n.read ? 'bg-zinc-100' : 'bg-zinc-100/60'}`}>
                  <TypeIcon type={n.type} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-zinc-900 line-clamp-1">{n.title}</div>
                    {!n.read && <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-600" />}
                  </div>
                  <div className="mt-1 text-zinc-700 leading-snug line-clamp-2">{n.message}</div>
                </div>
              </div>
              <div className="text-xs text-zinc-500 whitespace-nowrap ml-2">{formatRelativeTime(n.createdAt)}</div>
            </div>
            <div className="mt-2 flex items-center gap-3">
              {n.actionUrl && (
                <Link
                  href={n.actionUrl}
                  className="inline-flex items-center text-xs font-medium text-primary-600 hover:underline"
                  onClick={(e) => { e.stopPropagation(); markAsRead(n._id); }}
                >
                  View
                </Link>
              )}
              {!n.read && (
                <button
                  className="text-xs text-zinc-600 hover:text-zinc-900"
                  onClick={(e) => { e.stopPropagation(); markAsRead(n._id); }}
                >
                  Mark as read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


