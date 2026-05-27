import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/core/services/auth.service";
import type { FirstAccessCompleteRequestDTO } from "@/shared/types/auth";

/** Step 2: sends token + newPassword to finalize the account. */
export function useCompleteFirstAccess() {
  return useMutation({
    mutationFn: (data: FirstAccessCompleteRequestDTO) =>
      AuthService.completeFirstAccess(data),
  });
}
