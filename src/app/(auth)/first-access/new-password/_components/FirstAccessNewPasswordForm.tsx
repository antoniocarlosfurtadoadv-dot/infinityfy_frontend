"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Tip from "@/components/ui/Tip";
import { AccountCreatedModal } from "./AccountCreatedModal";
import { useCompleteFirstAccess } from "../../_hooks/useCompleteFirstAccess";
import {
  firstAccessNewPasswordSchema,
  type FirstAccessNewPasswordInput,
} from "../../_schemas/first-access.schema";

interface IFirstAccessNewPasswordFormProps {
  token: string | null;
}

export function FirstAccessNewPasswordForm({
  token,
}: IFirstAccessNewPasswordFormProps) {
  const completeMutation = useCompleteFirstAccess();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const form = useForm<FirstAccessNewPasswordInput>({
    resolver: zodResolver(firstAccessNewPasswordSchema),
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = useWatch({
    control: form.control,
    name: "newPassword",
  });

  const passwordLength = newPasswordValue?.length ?? 0;
  const hasLettersAndNumbers = /^(?=.*[A-Za-z])(?=.*\d).+$/.test(
    newPasswordValue ?? "",
  );
  const isPasswordRuleSatisfied = passwordLength >= 8 && hasLettersAndNumbers;

  // Guard: no token present
  if (!token) {
    return (
      <div className="flex flex-col items-start gap-4 w-full mt-12 md:mt-0">
        <h1 className="text-left text-2xl lg:text-3xl font-bold text-neutral-900 leading-8">
          Criar senha
        </h1>
        <Tip
          variant="error"
          content="Link inválido. Volte ao início e tente novamente."
          className="px-4 w-full"
        />
        <Link
          href="/login"
          className="text-neutral-950 hover:underline text-base font-bold"
        >
          Voltar ao login
        </Link>
      </div>
    );
  }

  async function onSubmit(data: FirstAccessNewPasswordInput) {
    try {
      await completeMutation.mutateAsync({
        token: token!,
        newPassword: data.newPassword,
      });

      setShowSuccessModal(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível continuar.";
      form.setError("root", { message });
    }
  }

  return (
    <>
      <AccountCreatedModal isOpen={showSuccessModal} />

      <form
        className="flex h-full min-h-0 flex-1 flex-col items-center w-full md:mt-12"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="flex flex-col items-start gap-2 lg:gap-4 w-full mt-12 md:mt-0">
          <h1 className="text-left text-2xl lg:text-3xl font-bold text-neutral-900 leading-8">
            Criar senha
          </h1>
          <p className="text-neutral-600 text-base lg:text-xl leading-6 text-left font-normal">
            Crie uma senha forte.
          </p>
        </div>

        {form.formState.errors.root?.message && (
          <Tip
            variant="error"
            content={form.formState.errors.root.message}
            className="px-4 w-full mt-6"
          />
        )}

        <div className="flex flex-col items-center w-full gap-6 mt-12">
          <Input
            variant="default"
            label="Senha"
            placeholder="Senha"
            type="password"
            hasNoErrorHint={true}
            required
            minLength={8}
            error={form.formState.errors.newPassword?.message}
            aria-invalid={Boolean(form.formState.errors.newPassword)}
            {...form.register("newPassword")}
          />

          <Input
            variant="default"
            label="Confirmar senha"
            placeholder="Confirmar senha"
            type="password"
            hasNoErrorHint={true}
            required
            minLength={8}
            error={form.formState.errors.confirmPassword?.message}
            aria-invalid={Boolean(form.formState.errors.confirmPassword)}
            {...form.register("confirmPassword")}
          />
        </div>

        <span
          className={`text-sm font-normal text-left self-start mt-2 ${
            passwordLength === 0
              ? "text-neutral-600"
              : !isPasswordRuleSatisfied
                ? "text-feedback-error-main"
                : "text-success-main"
          }`}
        >
          Mínimo de 8 caracteres, com letras e números.
        </span>

        <Button
          variant="primary"
          className="w-full mt-6"
          isLoading={completeMutation.isPending}
          disabled={!form.formState.isValid || completeMutation.isPending}
          type="submit"
        >
          Criar conta
        </Button>
      </form>
    </>
  );
}
