import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import type { IPagination } from "@/shared/types/pagination";
import type { IUser } from "@/shared/types/user";
import { UserService } from "../_services/user.service";


export function useDeleteUser() {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => UserService.delete(id),
    onSuccess: (_, deletedId) => {
      toast.success("Usuário removido com sucesso!");

      // Remove the user from cache instead of invalidating
      queryClient.setQueryData<IPagination<IUser>>(
        ["users", {}],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter((user) => user.id !== deletedId),
            total: oldData.total - 1,
          };
        }
      );
    },
    onError: (error: unknown) => {
      console.error("Error deleting user:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível remover o usuário");
      }
    },
  });

  const execute = async (id: string) => {
    try {
      return await mutation.mutateAsync(id);
    } catch {
      // error already handled by onError
    }
  };

  return { execute, isLoading: mutation.isPending };
}
