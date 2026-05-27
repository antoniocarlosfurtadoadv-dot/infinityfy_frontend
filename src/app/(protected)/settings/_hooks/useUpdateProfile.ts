import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { useAuth } from "@/core/hooks/useAuth";
import { AuthService } from "@/core/services/auth.service";
import type { UpdateProfileInput } from "../_schemas/profile.schema";
import { ProfileService } from "../_services/profile.service";

export function useUpdateProfile() {
  const toast = useAppToast();
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  const mutation = useMutation({
    mutationFn: (data: UpdateProfileInput) => ProfileService.update(data),
    onSuccess: async () => {
      toast.success("Perfil atualizado com sucesso!");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      const freshUser = await AuthService.me();
      setUser(freshUser);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao atualizar perfil");
      }
    },
  });

  return { execute: mutation.mutateAsync, isLoading: mutation.isPending };
}
