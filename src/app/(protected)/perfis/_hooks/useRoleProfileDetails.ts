import { useQuery } from "@tanstack/react-query";
import type { IRoleProfile } from "@/shared/types/role-profile";
import { RoleProfileService } from "../_services/role-profile.service";

export function useRoleProfileDetails(id: string) {
  return useQuery<IRoleProfile, Error>({
    queryKey: ["role-profiles", id],
    queryFn: () => RoleProfileService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
