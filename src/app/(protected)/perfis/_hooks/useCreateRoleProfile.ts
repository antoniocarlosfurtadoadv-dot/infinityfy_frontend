import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { ApiError } from "@/core/api/interceptors/error.interceptor";
import { RoleProfileService } from "../_services/role-profile.service";
import type { CreateRoleProfileInput } from "../_schemas/role-profile.schema";

export function useCreateRoleProfile() {
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateRoleProfileInput) => RoleProfileService.create(data),
    onSuccess: () => {
      toast.success("Perfil criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["role-profiles"] });
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError || error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao criar perfil");
      }
    },
  });

  return { execute: mutation.mutateAsync, isLoading: mutation.isPending };
}
