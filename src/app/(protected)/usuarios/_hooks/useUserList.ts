import { useQuery } from "@tanstack/react-query";
import type { IPagination } from "@/shared/types/pagination";
import type { IUserListParams} from "../_services/user.service";
import { UserService } from "../_services/user.service";
import type { IUser } from "@/shared/types/user";


export function useUserList(params: IUserListParams = {}) {
  const query = useQuery<IPagination<IUser>, Error>({
    queryKey: ["users", params],
    queryFn: () => UserService.list(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return query;
}
