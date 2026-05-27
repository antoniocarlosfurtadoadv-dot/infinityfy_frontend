import type { IUser } from "@/shared/types/user";
import { useQuery } from "@tanstack/react-query";
import { ProfileService } from "../_services/profile.service";

export function useProfile() {
  const query = useQuery<IUser, Error>({
    queryKey: ["auth", "me"],
    queryFn: () => ProfileService.getMe(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return query;
}
