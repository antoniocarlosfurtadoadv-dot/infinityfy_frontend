import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { ApiError } from "@/core/api/interceptors/error.interceptor";
import { RoleProfileService } from "../_services/role-profile.service";
import type { UpdateRoleProfileInput } from "../_schemas/role-profile.schema";

export function useUpdateRoleProfile(id: string) {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateRoleProfileInput) =>
      RoleProfileService.update({ id, ...data }),
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["role-profiles"] });
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError || error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao atualizar perfil");
      }
    },
  });

  return { execute: mutation.mutateAsync, isLoading: mutation.isPending };
}
