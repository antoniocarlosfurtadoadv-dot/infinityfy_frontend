"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Tip from "@/components/ui/Tip";
import { useValidateFirstAccess } from "../_hooks/useValidateFirstAccess";
import { useVerifyFirstAccess } from "../_hooks/useVerifyFirstAccess";
import { useRequestFirstAccess } from "../_hooks/useRequestFirstAccess";
import {
  firstAccessVerifySchema,
  type FirstAccessVerifyInput,
  firstAccessRequestSchema,
  type FirstAccessRequestInput,
} from "../_schemas/first-access.schema";
import { TermsAcceptance } from "./TermsAcceptance";

interface IFirstAccessFormProps {
  token: string | null;
}

type ValidateState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; email: string; name: string };

export function FirstAccessForm({ token }: IFirstAccessFormProps) {
  const router = useRouter();
  const validateMutation = useValidateFirstAccess();
  const verifyMutation = useVerifyFirstAccess();
  const requestMutation = useRequestFirstAccess();

  const [validateState, setValidateState] = useState<ValidateState>(
    token ? { status: "loading" } : { status: "idle" },
  );
  const [showResendForm, setShowResendForm] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    validateMutation.mutateAsync({ token }).then(
      (res) => {
        if (!cancelled) {
          setValidateState({
            status: "success",
            email: res.payload.email,
            name: res.payload.name,
          });
        }
      },
      () => {
        if (!cancelled) {
          setValidateState({
            status: "error",
            message:
              "Este link expirou ou já foi utilizado. Entre em contato com o administrador.",
          });
        }
      },
    );

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const form = useForm<FirstAccessVerifyInput>({
    resolver: zodResolver(firstAccessVerifySchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      termsAccepted: false,
    },
  });

  const termsAcceptedValue = useWatch({
    control: form.control,
    name: "termsAccepted",
  });

  const resendForm = useForm<FirstAccessRequestInput>({
    resolver: zodResolver(firstAccessRequestSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  async function onResendSubmit(data: FirstAccessRequestInput) {
    try {
      await requestMutation.mutateAsync({ email: data.email });
      setResendSuccess(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível solicitar um novo link.";
      resendForm.setError("root", { message });
    }
  }

  async function onSubmit(data: FirstAccessVerifyInput) {
    if (!token) return;

    try {
      await verifyMutation.mutateAsync({
        token,
        currentPassword: data.currentPassword,
        termsAccepted: data.termsAccepted,
      });

      router.push(
        `/first-access/new-password?token=${encodeURIComponent(token)}`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível continuar.";

      if (/senha.*temp|temporar|incorrect|inv[aá]lid|401/i.test(message)) {
        form.setError("currentPassword", {
          message: "Senha temporária incorreta",
        });
        return;
      }

      if (/termos|terms/i.test(message)) {
        form.setError("termsAccepted", {
          message: "Você precisa aceitar os termos",
        });
        return;
      }

      form.setError("root", { message });
    }
  }

  // ── No token: user came from login with mustChangePassword ──
  if (!token) {
    return (
      <div className="flex flex-col items-start gap-4 w-full mt-12 md:mt-0">
        <h1 className="text-left text-2xl lg:text-3xl font-bold text-neutral-900 leading-8">
          Primeiro acesso
        </h1>
        <Tip
          variant="info"
          content="Verifique seu e-mail para acessar o link de configuração da conta, ou entre em contato com o administrador."
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

  // ── Token present: loading ──
  if (validateState.status === "loading") {
    return (
      <div className="flex flex-col w-full gap-4 mt-12 animate-pulse">
        <div className="h-8 w-48 bg-neutral-200 rounded" />
        <div className="h-5 w-64 bg-neutral-200 rounded" />
        <div className="h-12 w-full bg-neutral-200 rounded mt-6" />
        <div className="h-12 w-full bg-neutral-200 rounded" />
        <div className="h-12 w-full bg-neutral-200 rounded" />
      </div>
    );
  }

  // ── Token invalid / expired ──
  if (validateState.status === "error") {
    // After successfully requesting a new link
    if (resendSuccess) {
      return (
        <div className="flex flex-col items-start gap-4 w-full mt-12 md:mt-0">
          <h1 className="text-left text-2xl lg:text-3xl font-bold text-neutral-900 leading-8">
            Primeiro acesso
          </h1>
          <Tip
            variant="success"
            content="Um novo link foi enviado para o seu e-mail. Verifique sua caixa de entrada."
            duration={0}
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

    // Resend link email form
    if (showResendForm) {
      return (
        <form
          className="flex flex-col items-start gap-12 w-full mt-12 md:mt-0"
          onSubmit={resendForm.handleSubmit(onResendSubmit)}
          noValidate
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-left text-2xl lg:text-3xl font-bold text-neutral-900 leading-8">
              Solicitar novo link
            </h1>
            <p className="text-neutral-600 text-base lg:text-xl leading-6 text-left font-normal">
              Insira seu e-mail de cadastro e receba um novo link.
            </p>
          </div>

          {resendForm.formState.errors.root?.message && (
            <Tip
              variant="error"
              content={resendForm.formState.errors.root.message}
              className="px-4 w-full"
            />
          )}

          <div className="w-full">
            <Input
              variant="default"
              label="E-mail"
              placeholder="E-mail"
              type="email"
              required
              error={resendForm.formState.errors.email?.message}
              aria-invalid={Boolean(resendForm.formState.errors.email)}
              {...resendForm.register("email")}
            />
          </div>

          <div className="flex flex-col gap-6 w-full">
            <Button
              variant="primary"
              className="w-full"
              type="submit"
              isLoading={requestMutation.isPending}
              disabled={
                !resendForm.formState.isValid || requestMutation.isPending
              }
            >
              Enviar novo link
            </Button>
            <button
              type="button"
              onClick={() => setShowResendForm(false)}
              className="text-neutral-950 hover:underline text-base font-bold"
            >
              Voltar
            </button>
          </div>
        </form>
      );
    }

    // Default error state with resend option
    return (
      <div className="flex flex-col items-center gap-8 w-full mt-12 md:mt-0">
        <h1 className="text-left text-2xl lg:text-3xl font-bold text-neutral-900 leading-8">
          Primeiro acesso
        </h1>
        <Tip
          variant="error"
          content="Seu link de primeiro acesso expirou ou já foi utilizado."
          duration={0}
          className="px-4 w-full"
        />
        <div className="flex flex-col w-full items-center gap-4">
          <Button
            variant="primary"
            className="w-full"
            type="button"
            onClick={() => setShowResendForm(true)}
          >
            Solicitar novo link
          </Button>
          <Link
            href="/login"
            className="text-neutral-950 hover:underline text-base font-bold self-center"
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    );
  }

  // ── Token valid: step-1 form ──
  return (
    <form
      className="flex h-full min-h-0 flex-1 flex-col items-center w-full md:mt-12"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex flex-col items-start gap-2 lg:gap-4 w-full mt-12 md:mt-0">
        <h1 className="text-left text-2xl lg:text-3xl font-bold text-neutral-900 leading-8">
          Criar conta
        </h1>
        <p className="text-neutral-600 text-base lg:text-xl leading-6 text-left font-normal">
          Insira seu e-mail e senha temporária para continuar.
        </p>
      </div>

      {form.formState.errors.root?.message && (
        <Tip
          variant="error"
          content={form.formState.errors.root.message}
          className="px-4 w-full mt-6"
        />
      )}

      <div className="flex flex-col items-center w-full gap-6 mt-6">
        <Input
          variant="default"
          label="E-mail"
          required
          placeholder="E-mail"
          type="email"
          defaultValue={
            validateState.status === "success" ? validateState.email : ""
          }
        />

        <Input
          variant="default"
          label="Senha temporária"
          placeholder="Senha temporária recebida por e-mail"
          type="password"
          required
          error={form.formState.errors.currentPassword?.message}
          aria-invalid={Boolean(form.formState.errors.currentPassword)}
          {...form.register("currentPassword")}
        />
      </div>

      <div className="mt-6 w-full">
        <TermsAcceptance
          {...form.register("termsAccepted")}
          error={form.formState.errors.termsAccepted?.message}
        />
      </div>

      <Button
        variant="primary"
        className="w-full mt-6"
        isLoading={verifyMutation.isPending}
        disabled={
          !form.formState.isValid ||
          termsAcceptedValue !== true ||
          verifyMutation.isPending
        }
        type="submit"
      >
        Continuar
      </Button>
    </form>
  );
}
