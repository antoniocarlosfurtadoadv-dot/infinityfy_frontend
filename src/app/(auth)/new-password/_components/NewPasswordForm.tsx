"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useNewPassword } from "../_hooks/useNewPassword";
import type { NewPasswordInput } from "../_schemas/new-password.schema";
import { newPasswordSchema } from "../_schemas/new-password.schema";
import { Sparkles } from "lucide-react";

export function NewPasswordForm() {
  const { execute, isLoading, isSuccess, handleNavigateToLogin } =
    useNewPassword();

  const form = useForm<NewPasswordInput>({
    resolver: zodResolver(newPasswordSchema),
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: NewPasswordInput) {
    await execute(values);
  }

  const newPasswordValue = useWatch({
    control: form.control,
    name: "newPassword",
  });
  const passwordValue = newPasswordValue ?? "";
  const passwordLength = passwordValue.length;
  const hasLettersAndNumbers = /^(?=.*[A-Za-z])(?=.*\d).+$/.test(passwordValue);
  const isPasswordRuleSatisfied = passwordLength >= 8 && hasLettersAndNumbers;
  const isFormValid = form.formState.isValid;

  return (
    <>
      <Modal
        isOpen={isSuccess}
        onClose={() => {}}
        title=""
        variant="sheet"
        showCloseButton={false}
        bodyClassName="px-6 pb-6 pt-8 md:p-6 sm:min-h-85 md:min-h-auto"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 h-1.5 w-12 rounded-full bg-neutral-300 md:hidden" />

          <div className="flex flex-col items-center gap-6">
            <Sparkles size={52} className="text-secondary-main" />

            <div className="flex flex-col items-center gap-2">
              <h2 className="text-2xl font-bold text-neutral-900">
                Conta criada!
              </h2>
              <p className="text-base text-neutral-700">
                Sua conta foi criada com sucesso, você já pode entrar e acessar
                seus exames.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full mt-12"
            onClick={handleNavigateToLogin}
          >
            Entrar
          </Button>
        </div>
      </Modal>
      <form
        className="flex flex-1 flex-col items-center w-full mt-12"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="flex flex-col items-center w-full gap-6">
          <Input
            variant="default"
            label="Senha"
            placeholder="Senha"
            type="password"
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
          className="w-full mt-12"
          isLoading={isLoading}
          disabled={!isFormValid || isLoading}
          type="submit"
        >
          Alterar senha
        </Button>
      </form>
    </>
  );
}
