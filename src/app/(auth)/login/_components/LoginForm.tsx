"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

// import Tip from "@/shared/design-system/ui/tips/tip";
import { useLogin } from "../_hooks/useLogin";
import type { LoginInput } from "../_schemas/login.schema";
import { LoginSchema } from "../_schemas/login.schema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Tip from "@/components/ui/Tip";

export function LoginForm() {
  const { execute, isLoading, error } = useLogin();

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    await execute(values);
  }

  const feedbackMessage = error ?? undefined;

  const isFormValid = form.formState.isValid;

  return (
    <form
      className="flex flex-1 flex-col items-center w-full"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      {feedbackMessage && (
        <Tip
          variant="error"
          content={feedbackMessage}
          className="px-4 w-full mb-12"
        />
      )}

      <div className="flex flex-col items-center w-full gap-6">
        <Input
          variant="default"
          label="E-mail"
          placeholder="E-mail"
          type="email"
          required
          error={form.formState.errors.email?.message}
          aria-invalid={Boolean(form.formState.errors.email)}
          {...form.register("email")}
        />
        <Input
          variant="default"
          label="Senha"
          placeholder="Senha"
          type="password"
          minLength={8}
          required
          error={form.formState.errors.password?.message}
          aria-invalid={Boolean(form.formState.errors.password)}
          {...form.register("password")}
        />
      </div>

      <div className="w-full mt-2 flex justify-end">
        <Link
          href="/forgot-password"
          className="text-neutral-950 hover:text-secondary-main transition text-sm font-semibold"
        >
          Esqueceu a senha?
        </Link>
      </div>

      <Button
        variant="primary"
        className="w-full mt-12"
        isLoading={isLoading}
        disabled={!isFormValid || isLoading}
        type="submit"
      >
        Entrar
      </Button>
    </form>
  );
}
