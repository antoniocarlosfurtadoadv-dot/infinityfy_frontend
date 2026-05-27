"use client";

import { useQuery } from "@tanstack/react-query";
import type { IMetricsFilters } from "../_services/metrics.service";
import { MetricsService } from "../_services/metrics.service";
import type { MetricsResponse } from "@/shared/types/metrics";

interface IUseMetricsOptions {
  enablePolling?: boolean;
}

export function useMetrics(
  filters: IMetricsFilters = {},
  userType?: string,
  options: IUseMetricsOptions = {},
) {
  const { enablePolling = true } = options;

  return useQuery<MetricsResponse>({
    queryKey: ["metrics", userType, filters],
    queryFn: () => MetricsService.getMetrics(filters, userType),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: enablePolling ? 1000 * 30 : undefined, // Poll every 30 seconds
    enabled: Boolean(userType),
  });
}
