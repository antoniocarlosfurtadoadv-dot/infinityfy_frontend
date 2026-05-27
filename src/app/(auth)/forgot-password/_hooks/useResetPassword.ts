import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/core/services/auth.service";
import type { ResetPasswordRequestDTO } from "@/shared/types/auth";

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequestDTO) => AuthService.resetPassword(data),
  });
}
