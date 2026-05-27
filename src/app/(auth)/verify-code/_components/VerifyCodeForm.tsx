"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import StepCode from "@/components/ui/stepCode";
import { useVerifyCode } from "../_hooks/useVerifyCode";
import {
  verifyCodeSchema,
  type VerifyCodeFormData,
} from "../_schemas/verify-code.schema";
import { useAuth } from "@/core/hooks/useAuth";
import {
  saveToken,
  saveRefreshToken,
  saveUser,
} from "@/core/services/storage.service";

export function VerifyCodeForm() {
  const router = useRouter();
  const verifyCodeMutation = useVerifyCode();
  const { setUser } = useAuth();

  const form = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(data: VerifyCodeFormData) {
    try {
      const response = await verifyCodeMutation.mutateAsync({
        code: data.code,
      });

      const payload = response.payload;

      // First login continues to the password creation step after a valid code.
      if (payload.requiresPasswordChange) {
        router.push("/new-password");
        return;
      }

      // Returning users finish authentication immediately after code verification.
      if (!payload.requiresPasswordChange) {
        saveToken(payload.access_token);
        if (payload.refresh_token) {
          saveRefreshToken(payload.refresh_token);
        }
        saveUser(payload.user);
        // Type assertion needed: AuthUserDTO has subset of IUser properties
        setUser(payload.user as unknown as Parameters<typeof setUser>[0]);
        router.push("/dashboard");
      }
    } catch (error) {
      form.setError("code", {
        message:
          error instanceof Error
            ? "Código incorreto, tente novamente."
            : "Não foi possível validar o código.",
      });
    }
  }

  const isFormValid = form.formState.isValid;

  return (
    <form
      className="flex flex-1 flex-col items-center w-full mt-12 md:mt-12"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center justify-center gap-6 mt-6">
        <div className="flex flex-col gap-2 items-center">
          <Controller
            control={form.control}
            name="code"
            render={({ field, fieldState }) => (
              <StepCode
                value={field.value}
                onChange={(nextValue) => {
                  field.onChange(nextValue);
                  // Clear previous API error feedback as soon as the user edits the code.
                  if (form.formState.errors.code) {
                    form.clearErrors("code");
                  }
                }}
                onBlur={field.onBlur}
                isError={fieldState.invalid}
                aria-invalid={fieldState.invalid}
                name={field.name}
              />
            )}
          />
          {form.formState.errors.code?.message ? (
            <p className="text-feedback-error-main text-sm leading-5 font-normal text-center">
              {form.formState.errors.code.message}
            </p>
          ) : null}
        </div>

        <p className="text-neutral-700">
          Não recebeu o código?{" "}
          <Link href="/" className="text-primary-main hover:underline">
            Reenviar
          </Link>
        </p>
      </div>

      <Button
        variant="primary"
        className="w-full mt-12"
        isLoading={verifyCodeMutation.isPending}
        disabled={!isFormValid || verifyCodeMutation.isPending}
        type="submit"
      >
        Verificar código
      </Button>
    </form>
  );
}
