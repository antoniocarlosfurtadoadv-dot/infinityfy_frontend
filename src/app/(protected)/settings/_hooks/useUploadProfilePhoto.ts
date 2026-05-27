import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import { useAuth } from "@/core/hooks/useAuth";
import { AuthService } from "@/core/services/auth.service";
import { ProfileService } from "../_services/profile.service";

export function useUploadProfilePhoto() {
  const toast = useAppToast();
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  const mutation = useMutation({
    mutationFn: (file: File) => ProfileService.uploadPhoto(file),
    onSuccess: async () => {
      toast.success("Foto atualizada com sucesso!");
      const freshUser = await AuthService.me();
      setUser(freshUser);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao atualizar foto");
      }
    },
  });

  return { execute: mutation.mutateAsync, isLoading: mutation.isPending };
}
