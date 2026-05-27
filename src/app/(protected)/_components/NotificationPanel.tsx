"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, X } from "lucide-react";
import clsx from "clsx";
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useUnreadCount } from "../_hooks/useNotifications";
import type { INotification } from "@/shared/types/notification";
import { formatDayDateToHour } from "@/core/utils/formatters";


export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: notificationsData, isLoading } = useNotifications({ limit: 20 });
  const { data: unreadCount = 0 } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const notifications = notificationsData?.data ?? [];

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    markAsRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const getRedirectPath = (entityType: string | null, entityId: string | null): string | null => {
    if (!entityType || !entityId) return null;

    const entityTypeMap: Record<string, string> = {
      'EMPLOYEE': 'employees',
      'TASK': 'tasks',
      'TEAM': 'teams',
    };

    const route = entityTypeMap[entityType.toUpperCase()];
    return route ? `/dashboard/${route}/${entityId}` : null;
  };

  const handleNotificationClick = (notification: INotification) => {
    // Mark as read if unread
    if (!notification.read) {
      markAsRead.mutate(notification.id);
    }

    // Redirect if has entity
    const path = getRedirectPath(notification.entityType, notification.entityId);
    if (path) {
      router.push(path);
      setIsOpen(false);
    }
  };

  const getNotificationIcon = (type: INotification["type"]) => {
    switch (type) {
      case "SUCCESS":
        return "✅";
      case "WARNING":
        return "⚠️";
      case "ERROR":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (type: INotification["type"]) => {
    switch (type) {
      case "SUCCESS":
        return "text-green-600 bg-green-50";
      case "WARNING":
        return "text-yellow-600 bg-yellow-50";
      case "ERROR":
        return "text-red-600 bg-red-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Notification Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "relative flex h-10 w-10 items-center cursor-pointer justify-center rounded-full border transition-all",
          isOpen
            ? "border-indigo-300 bg-indigo-50 text-primary-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            : "border-slate-200 bg-neutral-100 text-slate-700 hover:bg-primary-light hover:text-primary-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        )}
        aria-label="Notificações"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Notificações</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-slate-500">{unreadCount} não lida{unreadCount > 1 ? 's' : ''}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
                  title="Marcar todas como lidas"
                >
                  <Check className="h-4 w-4" />
                  Todas
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-128 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-900">
                  Nenhuma notificação
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Você está em dia com tudo!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={clsx(
                      "group relative cursor-pointer p-4 transition-colors hover:bg-slate-50",
                      !notification.read && "bg-gray-200"
                    )}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div
                        className={clsx(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg",
                          getNotificationColor(notification.type)
                        )}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-slate-900">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <button
                              type="button"
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 opacity-0 transition-all hover:bg-indigo-100 hover:text-indigo-600 group-hover:opacity-100"
                              title="Marcar como lida"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-slate-400">

                          {notification.createdAt && formatDayDateToHour(notification.createdAt)}
                        </p>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-indigo-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
