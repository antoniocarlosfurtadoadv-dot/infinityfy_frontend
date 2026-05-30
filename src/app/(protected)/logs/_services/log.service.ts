import { api } from "@/core/api/http";
import type { ILogEntry } from "@/shared/types/log-entry";
import type { IPagination } from "@/shared/types/pagination";

export interface ILogListParams {
  page?: number;
  limit?: number;
  entity?: string;
}

export const LogService = {
  list: async (params: ILogListParams = {}): Promise<IPagination<ILogEntry>> => {
    return await api.get<IPagination<ILogEntry>>("/logs", {
      params: { ...params },
    });
  },

  getById: async (id: string): Promise<ILogEntry> => {
    return await api.get<ILogEntry>(`/logs/${id}`);
  },
};
