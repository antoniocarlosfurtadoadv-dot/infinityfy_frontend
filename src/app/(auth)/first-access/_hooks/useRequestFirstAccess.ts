import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/core/services/auth.service";
import type { FirstAccessRequestDTO } from "@/shared/types/auth";

export function useRequestFirstAccess() {
  return useMutation({
    mutationFn: (data: FirstAccessRequestDTO) =>
      AuthService.requestFirstAccess(data),
  });
}
