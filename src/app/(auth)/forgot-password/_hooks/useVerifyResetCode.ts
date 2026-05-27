import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/core/services/auth.service";
import type { VerifyResetCodeRequestDTO } from "@/shared/types/auth";

export function useVerifyResetCode() {
  return useMutation({
    mutationFn: (data: VerifyResetCodeRequestDTO) =>
      AuthService.verifyResetCode(data),
  });
}
