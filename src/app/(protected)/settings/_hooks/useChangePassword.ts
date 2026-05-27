import { useMutation } from "@tanstack/react-query";
import { useAppToast } from "@/core/hooks/useToast";
import type { ChangePasswordInput } from "../_schemas/change-password.schema";
import { ProfileService } from "../_services/profile.service";

export function useChangePassword() {
  const toast = useAppToast();

  const mutation = useMutation({
    mutationFn: (data: ChangePasswordInput) =>
      ProfileService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        const message = error.message;
        // Don't show toast for password reuse error - it will be shown in form field
        if (
          !message.includes("não pode ser igual") &&
          !message.includes("deve ser diferente")
        ) {
          toast.error(message);
        }
      } else {
        toast.error("Erro ao alterar senha");
      }
    },
  });

  return { execute: mutation.mutateAsync, isLoading: mutation.isPending };
}
