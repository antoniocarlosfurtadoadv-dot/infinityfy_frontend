"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useForgotPassword } from "../_hooks/useForgotPassword";
import {
  forgotPasswordEmailSchema,
  type ForgotPasswordEmailInput,
} from "../_schemas/forgot-password.schema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const FORGOT_PASSWORD_SESSION_KEYS = {
  EMAIL: "forgot_password_email",
  RESET_TOKEN: "forgot_password_reset_token",
  CODE: "forgot_password_code",
} as const;

export function ForgotPasswordForm() {
  const router = useRouter();

  const forgotPasswordMutation = useForgotPassword();

  const emailForm = useForm<ForgotPasswordEmailInput>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  async function onEmailSubmit(data: ForgotPasswordEmailInput) {
    try {
      const response = await forgotPasswordMutation.mutateAsync(data.email);

      if (typeof window !== "undefined") {
        sessionStorage.setItem(FORGOT_PASSWORD_SESSION_KEYS.EMAIL, data.email);
        if (response.payload.resetToken) {
          sessionStorage.setItem(
            FORGOT_PASSWORD_SESSION_KEYS.RESET_TOKEN,
            response.payload.resetToken,
          );
        }
        sessionStorage.removeItem(FORGOT_PASSWORD_SESSION_KEYS.CODE);
      }
      router.push("/forgot-password/code");
    } catch (error) {
      emailForm.setError("email", {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível enviar o código. Tente novamente.",
      });
    }
  }

  return (
    <form
      className="flex h-full min-h-0 flex-1 flex-col items-center w-full md:mt-12"
      onSubmit={emailForm.handleSubmit(onEmailSubmit)}
      noValidate
    >
      <div className="flex flex-col items-start gap-2 xl:gap-4 w-full mt-12 md:mt-0">
        <h1 className="text-left text-2xl xl:text-3xl font-bold text-neutral-900 leading-8">
          Esqueceu a senha?
        </h1>
        <p className="text-neutral-600 text-base xl:text-xl leading-6 text-left font-normal">
          Informe seu e-mail de cadastro e receba um código de redefinição.
        </p>
      </div>

      <div className="flex flex-col items-center w-full gap-6 mt-12">
        <Input
          variant="default"
          label="E-mail"
          placeholder="E-mail"
          type="email"
          required
          error={emailForm.formState.errors.email?.message}
          aria-invalid={Boolean(emailForm.formState.errors.email)}
          {...emailForm.register("email")}
        />
      </div>

      <div className="flex flex-col gap-6 w-full mt-auto">
        <Button
          variant="primary"
          className="w-full md:mt-12"
          isLoading={forgotPasswordMutation.isPending}
          disabled={
            !emailForm.formState.isValid || forgotPasswordMutation.isPending
          }
          type="submit"
        >
          Enviar código
        </Button>

        <Link
          href="/login"
          className="text-neutral-950 text-center hover:underline text-base font-bold"
        >
          Voltar
        </Link>
      </div>
    </form>
  );
}
