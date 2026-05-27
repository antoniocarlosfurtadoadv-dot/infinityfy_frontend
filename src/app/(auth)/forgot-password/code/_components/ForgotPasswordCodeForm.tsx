"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import StepCode from "@/components/ui/stepCode";
import { useForgotPassword } from "../../_hooks/useForgotPassword";
import { useVerifyResetCode } from "../../_hooks/useVerifyResetCode";
import {
  forgotPasswordCodeSchema,
  type ForgotPasswordCodeInput,
} from "../../_schemas/forgot-password.schema";
import { toast } from "sonner";

const FORGOT_PASSWORD_SESSION_KEYS = {
  EMAIL: "forgot_password_email",
  RESET_TOKEN: "forgot_password_reset_token",
} as const;

export function ForgotPasswordCodeForm() {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPassword();
  const verifyResetCodeMutation = useVerifyResetCode();

  const codeForm = useForm<ForgotPasswordCodeInput>({
    resolver: zodResolver(forgotPasswordCodeSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

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

  async function onCodeSubmit(data: ForgotPasswordCodeInput) {
    if (typeof window === "undefined") return;

    const resetToken = sessionStorage.getItem(
      FORGOT_PASSWORD_SESSION_KEYS.RESET_TOKEN,
    );

    if (!resetToken) {
      router.replace("/forgot-password");
      return;
    }

    try {
      const response = await verifyResetCodeMutation.mutateAsync({
        resetToken,
        code: data.code,
      });

      if (response.payload.verified) {
        router.push("/forgot-password/new-password");
      } else {
        codeForm.setError("code", {
          message: "Código incorreto, tente novamente.",
        });
      }
    } catch {
      codeForm.setError("code", {
        message: "Código incorreto, tente novamente.",
      });
    }
  }

  async function handleResendCode() {
    if (typeof window === "undefined") return;

    const email = sessionStorage.getItem(FORGOT_PASSWORD_SESSION_KEYS.EMAIL);
    if (!email) {
      router.replace("/forgot-password");
      return;
    }

    try {
      const response = await forgotPasswordMutation.mutateAsync(email);
      if (response.payload.resetToken) {
        sessionStorage.setItem(
          FORGOT_PASSWORD_SESSION_KEYS.RESET_TOKEN,
          response.payload.resetToken,
        );
      }

      toast.success("Código reenviado! Verifique seu e-mail.")
    } catch {
      // Keep silent to preserve current UX.
    }
  }

  return (
    <form
      className="flex flex-1 flex-col items-center w-full xl:w-126 xl:p-6 mt-12 md:mt-12"
      onSubmit={codeForm.handleSubmit(onCodeSubmit)}
    >
      <div className="flex flex-col items-start gap-2 xl:gap-4 w-full">
        <h1 className="text-left text-2xl xl:text-3xl font-bold text-neutral-900 leading-8">
          Digite seu código
        </h1>
        <p className="text-neutral-600 text-base md:text-lg xl:text-xl leading-6 text-left font-normal">
          Verifique seu e-mail e digite abaixo o código recebido.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 my-12">
        <div className="flex flex-col gap-2 items-center">
          <Controller
            control={codeForm.control}
            name="code"
            render={({ field, fieldState }) => (
              <StepCode
                value={field.value}
                onChange={(nextValue) => {
                  field.onChange(nextValue);
                  if (codeForm.formState.errors.code) {
                    codeForm.clearErrors("code");
                  }
                }}
                onBlur={field.onBlur}
                isError={fieldState.invalid}
                aria-invalid={fieldState.invalid}
                name={field.name}
              />
            )}
          />
          {codeForm.formState.errors.code?.message ? (
            <p className="text-feedback-error-main text-sm leading-5 font-normal text-center">
              {codeForm.formState.errors.code.message}
            </p>
          ) : null}
        </div>

        <p className="text-neutral-700">
          Não recebeu o código?{" "}
          <button
            type="button"
            onClick={handleResendCode}
            className="text-primary-main hover:underline cursor-pointer disabled:text-neutral-400 disabled:cursor-not-allowed transition"
            disabled={forgotPasswordMutation.isPending}
          >
            Reenviar
          </button>
        </p>
      </div>

      <Button
        variant="primary"
        className="w-full mt-auto"
        isLoading={verifyResetCodeMutation.isPending}
        disabled={
          !codeForm.formState.isValid || verifyResetCodeMutation.isPending
        }
        type="submit"
      >
        Verificar código
      </Button>
    </form>
  );
}
