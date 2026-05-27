import { z } from "zod";

export const metricsFiltersSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  teamId: z.string().optional(),
  userId: z.string().optional(),
  taskStatus: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

export type MetricsFiltersSchema = z.infer<typeof metricsFiltersSchema>;
