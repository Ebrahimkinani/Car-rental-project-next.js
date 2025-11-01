"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type NotificationItem = {
  _id: string;
  userId: string | null;
  role: string | null;
  bookingId: string | null;
  type: string;
  title: string;
  message: string;
  actionUrl: string | null;
  read: boolean;
  readAt: string | null;
  createdAt: string;
};

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<NotificationItem[]>([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications', { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Realtime via SSE (fallback when WebSocket is not configured)
  useEffect(() => {
    const controller = new AbortController();
    const connect = async () => {
      try {
        const resp = await fetch('/api/notifications/stream', {
          credentials: 'include',
          signal: controller.signal,
          headers: { 'Accept': 'text/event-stream' },
        });
        if (!resp.ok || !resp.body) return;
        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let idx;
          while ((idx = buffer.indexOf('\n\n')) !== -1) {
            const chunk = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);
            if (!chunk.startsWith('data:')) continue;
            const data = chunk.replace(/^data:\s*/, '');
            try {
              const msg = JSON.parse(data);
              if (msg?.type === 'notification:new' && msg.notification) {
                setItems((prev) => [msg.notification, ...prev].slice(0, 100));
              }
            } catch {
              // ignore
            }
          }
        }
      } catch {
        // ignore
      }
    };
    connect();
    return () => controller.abort();
  }, []);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const markAsRead = useCallback(async (id: string) => {
    setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n)));
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH', credentials: 'include' });
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<NotificationContextValue>(() => ({
    notifications: items,
    unreadCount,
    markAsRead,
    refresh: fetchNotifications,
  }), [items, unreadCount, markAsRead, fetchNotifications]);

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}


