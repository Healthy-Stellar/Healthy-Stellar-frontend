'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

export type NotificationEventType = 'access_request' | 'appointment_confirmed' | 'record_shared';

export interface NotificationEvent {
  id: string;
  type: NotificationEventType;
  message: string;
  timestamp: number;
}

const EVENT_LABELS: Record<NotificationEventType, string> = {
  access_request:       'New access request received',
  appointment_confirmed: 'Appointment confirmed',
  record_shared:        'A medical record was shared with you',
};

interface UseNotificationsOptions {
  address: string | null;
  onNotification?: (event: NotificationEvent) => void;
}

export function useNotifications({ address, onNotification }: UseNotificationsOptions) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const esRef = useRef<EventSource | null>(null);

  const clearUnread = useCallback(() => setUnreadCount(0), []);

  useEffect(() => {
    if (!address || !process.env.NEXT_PUBLIC_API_URL) return;

    const url = `${process.env.NEXT_PUBLIC_API_URL}/notifications/stream?address=${encodeURIComponent(address)}`;
    const es = new EventSource(url);
    esRef.current = es;

    const handleEvent = (raw: MessageEvent) => {
      try {
        const data = JSON.parse(raw.data) as { type: NotificationEventType; id?: string };
        const event: NotificationEvent = {
          id: data.id ?? crypto.randomUUID(),
          type: data.type,
          message: EVENT_LABELS[data.type] ?? 'New notification',
          timestamp: Date.now(),
        };
        setNotifications((prev) => [event, ...prev]);
        setUnreadCount((n) => n + 1);
        onNotification?.(event);
      } catch {
        // malformed event — ignore
      }
    };

    (['access_request', 'appointment_confirmed', 'record_shared'] as const).forEach((type) => {
      es.addEventListener(type, handleEvent);
    });

    es.onerror = () => {
      es.close();
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

  return { notifications, unreadCount, clearUnread };
}
