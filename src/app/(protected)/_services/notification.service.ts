import { api } from "@/core/api/http";
import type { INotification } from "@/shared/types/notification";
import type { IPagination } from "@/shared/types/pagination";

export interface INotificationListParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
}

export const NotificationService = {
  list: async (params: INotificationListParams = {}): Promise<IPagination<INotification>> => {
    return await api.get<IPagination<INotification>>("/notifications", {
      params: { ...params },
    });
  },

  markAsRead: async (id: string): Promise<INotification> => {
    return await api.patch<INotification>(`/notifications/${id}/read`, {});
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch<void>("/notifications/read-all", {});
  },

  getUnreadCount: async (): Promise<number> => {
    const result = await api.get<{ count: number }>("/notifications/unread-count");
    return result.count;
  },
};
