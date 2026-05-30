import { useQuery } from "@tanstack/react-query";
import type { IPagination } from "@/shared/types/pagination";
import type { IRoleProfile } from "@/shared/types/role-profile";
import { RoleProfileService, type IRoleProfileListParams } from "../_services/role-profile.service";

export function useRoleProfileList(params: IRoleProfileListParams = {}) {
  return useQuery<IPagination<IRoleProfile>, Error>({
    queryKey: ["role-profiles", params],
    queryFn: () => RoleProfileService.list(params),
    staleTime: 1000 * 60 * 10,
  });
}
