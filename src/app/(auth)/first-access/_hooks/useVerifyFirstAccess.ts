import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/core/services/auth.service";
import type { FirstAccessVerifyRequestDTO } from "@/shared/types/auth";

export function useVerifyFirstAccess() {
  return useMutation({
    mutationFn: (data: FirstAccessVerifyRequestDTO) =>
      AuthService.verifyFirstAccess(data),
  });
}
