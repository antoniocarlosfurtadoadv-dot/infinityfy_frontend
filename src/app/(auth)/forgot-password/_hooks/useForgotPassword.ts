import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/core/services/auth.service";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => AuthService.forgotPassword(email),
  });
}
