import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/core/services/auth.service";
import type { FirstTimeChangePasswordRequestDTO } from "@/shared/types/auth";

export function useFirstTimeChangePassword() {
  return useMutation({
    mutationFn: (data: FirstTimeChangePasswordRequestDTO) =>
      AuthService.firstTimeChangePassword(data),
  });
}
