import { api } from "@/core/api/http";
import type { MetricsResponse } from "@/shared/types/metrics";
import { getMockMetricsByUserType } from "./metrics.mocks";

export interface IMetricsFilters {
  startDate?: string;
  endDate?: string;
  tenantId?: string;
  clinicId?: string;
  userId?: string;
  requestStatus?: string;
  requestPriority?: string;

  // Legacy aliases maintained for backward compatibility while callers migrate.
  teamId?: string;
  taskStatus?: string;
  priority?: string;
}

export const MetricsService = {
  getMetrics: async (
    filters: IMetricsFilters = {},
    userType?: string,
  ): Promise<MetricsResponse> => {
    if (userType === "VETERINARIAN") {
      return getMockMetricsByUserType(userType);
    }

    const normalizedFilters: Record<
      string,
      string | number | boolean | undefined
    > = {
      startDate: filters.startDate,
      endDate: filters.endDate,
      tenantId: filters.tenantId ?? filters.teamId,
      clinicId: filters.clinicId,
      userId: filters.userId,
      requestStatus: filters.requestStatus ?? filters.taskStatus,
      requestPriority: filters.requestPriority ?? filters.priority,
    };

    return await api.get<MetricsResponse>("/metrics", {
      params: normalizedFilters,
    });
  },
};
