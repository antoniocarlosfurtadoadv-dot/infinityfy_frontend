"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFirstTimeChangePassword } from "./useFirstTimeChangePassword";
import type { NewPasswordInput } from "../_schemas/new-password.schema";

export function useNewPassword() {
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const firstTimeChangePasswordMutation = useFirstTimeChangePassword();

  async function execute(data: NewPasswordInput) {
    try {
      setError(null);
      await firstTimeChangePasswordMutation.mutateAsync({
        newPassword: data.newPassword,
      });

      setIsSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Não foi possível alterar a senha. Tente novamente.");
      }
    }
  }

  const handleNavigateToLogin = () => {
    setIsSuccess(false);
    router.push("/login");
  };

  return {
    execute,
    isLoading: firstTimeChangePasswordMutation.isPending,
    error,
    isSuccess,
    handleNavigateToLogin,
  };
}
