import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/core/services/auth.service";
import type { VerifyLoginCodeRequestDTO } from "@/shared/types/auth";

export function useVerifyCode() {
  return useMutation({
    mutationFn: (data: VerifyLoginCodeRequestDTO) =>
      AuthService.verifyCode(data),
  });
}
