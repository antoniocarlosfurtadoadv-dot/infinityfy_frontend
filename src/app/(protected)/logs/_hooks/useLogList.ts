import { useQuery } from "@tanstack/react-query";
import type { IPagination } from "@/shared/types/pagination";
import type { ILogListParams } from "../_services/log.service";
import { LogService } from "../_services/log.service";
import type { ILogEntry } from "@/shared/types/log-entry";

export function useLogList(params: ILogListParams = {}) {
  const query = useQuery<IPagination<ILogEntry>, Error>({
    queryKey: ["logs", params],
    queryFn: () => LogService.list(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return query;
}
