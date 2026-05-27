import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/core/services/auth.service";
import type { FirstAccessValidateRequestDTO } from "@/shared/types/auth";

export function useValidateFirstAccess() {
  return useMutation({
    mutationFn: (data: FirstAccessValidateRequestDTO) =>
      AuthService.validateFirstAccess(data),
  });
}
