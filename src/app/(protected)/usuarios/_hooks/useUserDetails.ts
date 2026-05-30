import type { IUser } from "@/shared/types/user";
import { useQuery } from "@tanstack/react-query";
import { UserService } from "../_services/user.service";


export function useUserDetails(id: string) {
  const query = useQuery<IUser, Error>({
    queryKey: ["users", id],
    queryFn: () => UserService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return query;
}
