import { api } from "@/core/api/http";
import type { IPagination } from "@/shared/types/pagination";
import type { INotification } from "@/shared/types/notification";

export interface INotificationListParams {
  page?: number;
  limit?: number;
  read?: boolean;
  type?: INotification["type"];
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
};
