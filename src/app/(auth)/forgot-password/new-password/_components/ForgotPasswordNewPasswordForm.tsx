"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useResetPassword } from "../../_hooks/useResetPassword";
import { PasswordResetSuccessModal } from "./PasswordResetSuccessModal";
import {
  forgotPasswordNewPasswordSchema,
  type ForgotPasswordNewPasswordInput,
} from "../../_schemas/forgot-password.schema";
import Tip from "@/components/ui/Tip";

const FORGOT_PASSWORD_SESSION_KEYS = {
  EMAIL: "forgot_password_email",
  RESET_TOKEN: "forgot_password_reset_token",
} as const;

export function ForgotPasswordNewPasswordForm() {
  const router = useRouter();
  const resetPasswordMutation = useResetPassword();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const passwordForm = useForm<ForgotPasswordNewPasswordInput>({
    resolver: zodResolver(forgotPasswordNewPasswordSchema),
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = useWatch({
    control: passwordForm.control,
    name: "newPassword",
  });

  const confirmPasswordValue = useWatch({
    control: passwordForm.control,
    name: "confirmPassword",
  });

  const isChangePasswordMismatch = confirmPasswordValue.length > 0 && newPasswordValue.length > 0 && newPasswordValue !== confirmPasswordValue;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const email = sessionStorage.getItem(FORGOT_PASSWORD_SESSION_KEYS.EMAIL);
    const resetToken = sessionStorage.getItem(
      FORGOT_PASSWORD_SESSION_KEYS.RESET_TOKEN,
    );

    if (!email || !resetToken) {
      router.replace("/forgot-password");
    }
  }, [router]);

  async function onPasswordSubmit(data: ForgotPasswordNewPasswordInput) {
    if (typeof window === "undefined") return;

    const resetToken = sessionStorage.getItem(
      FORGOT_PASSWORD_SESSION_KEYS.RESET_TOKEN,
    );

    if (!resetToken) {
      router.replace("/forgot-password");
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        resetToken,
        newPassword: data.newPassword,
      });

      sessionStorage.removeItem(FORGOT_PASSWORD_SESSION_KEYS.EMAIL);
      sessionStorage.removeItem(FORGOT_PASSWORD_SESSION_KEYS.RESET_TOKEN);

      setShowSuccessModal(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao alterar senha";

      // Clear errors first to ensure clean state
      passwordForm.clearErrors();

      // Surface submit errors in the form-level Tip
      passwordForm.setError("root", {
        message,
        type: "custom",
      });
    }
  }

  const passwordLength = newPasswordValue?.length ?? 0;

  return (
    <>
      <PasswordResetSuccessModal isOpen={showSuccessModal} />

      <form
        className="flex flex-1 flex-col items-center w-full mt-12 md:mt-12"
        onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
        noValidate
      >
        <div className="flex flex-col items-start gap-2 xl:gap-4 w-full">
          <h1 className="text-left text-2xl xl:text-3xl font-bold text-neutral-900 leading-8">
            Criar nova senha
          </h1>
          <p className="text-neutral-600 text-base xl:text-xl leading-6 text-left font-normal">
            Sua nova senha deve ser diferente das senhas anteriores.
          </p>
        </div>

        {passwordForm.formState.errors.root?.message && (
          <Tip
            variant="error"
            content={passwordForm.formState.errors.root.message}
            className="px-4 w-full mt-6"
          />
        )}

        <div className="flex flex-col items-center w-full gap-6 mt-12">
          <Input
            variant="default"
            label="Nova senha"
            placeholder="Nova senha"
            hasNoErrorHint={true}
            type="password"
            required
            minLength={8}
            error={passwordForm.formState.errors.newPassword?.message}
            aria-invalid={Boolean(passwordForm.formState.errors.newPassword)}
            {...passwordForm.register("newPassword")}
          />
          <Input
            variant="default"
            label="Confirmar nova senha"
            placeholder="Repetir nova senha"
            type="password"
            hasNoErrorHint={true}
            required
            minLength={8}
            error={passwordForm.formState.errors.confirmPassword?.message}
            aria-invalid={Boolean(
              passwordForm.formState.errors.confirmPassword,
            )}
            {...passwordForm.register("confirmPassword")}
          />
        </div>

        <span
          className={`text-sm font-normal text-left mt-2 self-start ${
            passwordForm.formState.errors.newPassword
              ? "text-feedback-error-main"
              : passwordLength === 0
                ? "text-neutral-600"
                : passwordLength < 8
                  ? "text-feedback-error-main"
                  : "text-success-main"
          }`}
        >
          Mínimo de 8 caracteres, com letra e números.
        </span>

        <Button
          variant="primary"
          className="w-full mt-12"
          isLoading={resetPasswordMutation.isPending}
          disabled={
            !passwordForm.formState.isValid ||
            resetPasswordMutation.isPending || isChangePasswordMismatch
          }
          type="submit"
        >
          Alterar senha
        </Button>
      </form>
    </>
  );
}
