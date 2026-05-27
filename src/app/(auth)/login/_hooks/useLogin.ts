"use client";

import { useState } from "react";
import { AuthService } from "@/core/services/auth.service";
import { useRouter } from "next/navigation";
import type { LoginInput } from "../_schemas/login.schema";
import { useAuth } from "@/core/hooks/useAuth";
import { useAppToast } from "@/core/hooks/useToast";


export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useAppToast();
  const { setUser } = useAuth();
  const router = useRouter();

  async function execute(data: LoginInput) {
    try {
      setIsLoading(true);
      setError(null);
      const response = await AuthService.login({
        email: data.email,
        password: data.password,
      });

      // User hasn't completed first access via the email link yet.
      if ("user" in response && response.user?.mustChangePassword) {
        router.push("/first-access");
        return response;
      }

      // Normal login flow.
      if ("user" in response) {
        const me = await AuthService.me();
        setUser(me);
        toast.success("Bem-vindo de volta!");
        router.push("/dashboard");
      }

      return response;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Credenciais inválidas");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return { execute, isLoading, error };
}
