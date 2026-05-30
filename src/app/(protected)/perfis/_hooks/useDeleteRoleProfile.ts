import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import type { IPagination } from "@/shared/types/pagination";
import type { IRoleProfile } from "@/shared/types/role-profile";
import { RoleProfileService } from "../_services/role-profile.service";

export function useDeleteRoleProfile() {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => RoleProfileService.delete(id),
    onSuccess: (_, deletedId) => {
      toast.success("Perfil removido com sucesso!");
      queryClient.setQueryData<IPagination<IRoleProfile>>(
        ["role-profiles", {}],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((p) => p.id !== deletedId),
            total: oldData.total - 1,
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["role-profiles"] });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível remover o perfil");
      }
    },
  });

  return { execute: mutation.mutateAsync, isLoading: mutation.isPending };
}
