import { useQuery } from "@tanstack/react-query";
import type { IPagination } from "@/shared/types/pagination";
import type { INotification } from "@/shared/types/notification";
import type { INotificationListParams } from "../_services/notification.service";
import { NotificationService } from "../_services/notification.service";

export function useNotificationList(params: INotificationListParams = {}) {
  return useQuery<IPagination<INotification>, Error>({
    queryKey: ["notifications", params],
    queryFn: () => NotificationService.list(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
