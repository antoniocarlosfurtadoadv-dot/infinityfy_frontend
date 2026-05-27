import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { INotification } from "@/shared/types/notification";
import type { IPagination } from "@/shared/types/pagination";
import type { INotificationListParams } from "../_services/notification.service";
import { NotificationService } from "../_services/notification.service";
import { getSocket } from "@/core/services/io.service";


export function useNotifications(params: INotificationListParams = {}) {
  const query = useQuery<IPagination<INotification>, Error>({
    queryKey: ["notifications", params],
    queryFn: () => NotificationService.list(params),
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnMount: true,
  });

  return query;
}



export function useMarkAsRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => NotificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });

  return mutation;
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });

  return mutation;
}

export function useUnreadCount() {
  const queryClient = useQueryClient();

  const query = useQuery<number, Error>({
    queryKey: ["notifications-unread-count"],
    queryFn: () => NotificationService.getUnreadCount(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Listen to socket events for real-time updates (both count and list)
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewNotification = (notification: INotification) => {
      console.log("🔔 New notification received, refreshing count and list...", notification);
      // Inject the notification directly into all cached notification list queries
      // so broadcast notifications (userId: 'broadcast') that the API may not return
      // are still visible immediately.
      queryClient.setQueriesData<IPagination<INotification>>(
        { queryKey: ["notifications"] },
        (oldData) => {
          if (!oldData) return oldData;
          const alreadyExists = oldData.data.some((n) => n.id === notification.id);
          if (alreadyExists) return oldData;
          return {
            ...oldData,
            data: [notification, ...oldData.data],
            total: oldData.total + 1,
          };
        },
      );
      // Increment unread count directly
      queryClient.setQueryData<number>(
        ["notifications-unread-count"],
        (old) => (old ?? 0) + 1,
      );
    };

    const handleUpdateNotification = (notification: INotification) => {
      console.log("🔄 Notification updated, refreshing count and list...", notification);
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    socket.on("notification", handleNewNotification);
    socket.on("update-notification", handleUpdateNotification);

    return () => {
      socket.off("notification", handleNewNotification);
      socket.off("update-notification", handleUpdateNotification);
    };
  }, [queryClient]);

  return query;
}
