import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/core/services/auth.service";
import type { IUser } from "@/shared/types/user";

export function useMe() {
  return useQuery<IUser, Error>({
    queryKey: ["auth", "me"],
    queryFn: () => AuthService.me(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
