"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { useAppToast } from "@/core/hooks/useToast";
import { useForgotPassword } from "@/app/(auth)/forgot-password/_hooks/useForgotPassword";
import { useVerifyResetCode } from "@/app/(auth)/forgot-password/_hooks/useVerifyResetCode";
import { useResetPassword } from "@/app/(auth)/forgot-password/_hooks/useResetPassword";
import { useChangePassword } from "../_hooks/useChangePassword";
import {
  ChangePasswordSchema,
  type ChangePasswordInput,
} from "../_schemas/change-password.schema";
import {
  forgotPasswordCodeSchema,
  forgotPasswordEmailSchema,
  forgotPasswordNewPasswordSchema,
  type ForgotPasswordCodeInput,
  type ForgotPasswordEmailInput,
  type ForgotPasswordNewPasswordInput,
} from "@/app/(auth)/forgot-password/_schemas/forgot-password.schema";
import { ChangePasswordFormFooter } from "./change-password-form/ChangePasswordFormFooter";
import { ChangePasswordStep } from "./change-password-form/ChangePasswordStep";
import { ForgotPasswordCodeStep } from "./change-password-form/ForgotPasswordCodeStep";
import { ForgotPasswordEmailStep } from "./change-password-form/ForgotPasswordEmailStep";
import { ForgotPasswordNewPasswordStep } from "./change-password-form/ForgotPasswordNewPasswordStep";
import { SuccessStep } from "./change-password-form/SuccessStep";
import { usePasswordCrossValidation } from "./change-password-form/usePasswordCrossValidation";
import { type PasswordStep } from "./change-password-form/types";

interface IChangePasswordFormProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export function ChangePasswordForm({
  isOpen,
  onClose,
  email,
}: IChangePasswordFormProps) {
  const toast = useAppToast();
  const { execute, isLoading } = useChangePassword();
  const forgotPasswordMutation = useForgotPassword();
  const verifyResetCodeMutation = useVerifyResetCode();
  const resetPasswordMutation = useResetPassword();

  const [step, setStep] = useState<PasswordStep>("change-password");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState(email ?? "");
  const [resetToken, setResetToken] = useState("");

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const forgotPasswordEmailForm = useForm<ForgotPasswordEmailInput>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    mode: "onChange",
    defaultValues: {
      email: email ?? "",
    },
  });

  const forgotPasswordCodeForm = useForm<ForgotPasswordCodeInput>({
    resolver: zodResolver(forgotPasswordCodeSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  const forgotPasswordNewPasswordForm = useForm<ForgotPasswordNewPasswordInput>(
    {
      resolver: zodResolver(forgotPasswordNewPasswordSchema),
      mode: "onChange",
      defaultValues: {
        newPassword: "",
        confirmPassword: "",
      },
    },
  );

  const currentNewPasswordValue = useWatch({
    control: form.control,
    name: "newPassword",
  });

  const currentPasswordValue = useWatch({
    control: form.control,
    name: "currentPassword",
  });

  const confirmPasswordValue = useWatch({
    control: form.control,
    name: "confirmPassword",
  });

  const forgotNewPasswordValue = useWatch({
    control: forgotPasswordNewPasswordForm.control,
    name: "newPassword",
  });

  const forgotConfirmPasswordValue = useWatch({
    control: forgotPasswordNewPasswordForm.control,
    name: "confirmPassword",
  });

  const { errors } = form.formState;

  const forgotNewPasswordErrors =
    forgotPasswordNewPasswordForm.formState.errors;

  const forgotPasswordLength = forgotNewPasswordValue?.length ?? 0;
  const newPasswordErrorMessage = errors.newPassword?.message;
  const confirmPasswordErrorMessage = errors.confirmPassword?.message;
  const forgotConfirmPasswordErrorMessage =
    forgotNewPasswordErrors.confirmPassword?.message;

  // Keep cross-field rules in a dedicated hook to keep this component focused on flow orchestration.
  const { isChangePasswordMismatch, isForgotPasswordMismatch } =
    usePasswordCrossValidation({
      form,
      forgotPasswordNewPasswordForm,
      currentPasswordValue,
      currentNewPasswordValue,
      confirmPasswordValue,
      forgotNewPasswordValue,
      forgotConfirmPasswordValue,
      newPasswordErrorMessage,
      confirmPasswordErrorMessage,
      forgotConfirmPasswordErrorMessage,
    });

  function resetModalState() {
    setStep("change-password");
    setResetToken("");
    setForgotPasswordEmail(email ?? "");

    form.reset();
    forgotPasswordEmailForm.reset({ email: email ?? "" });
    forgotPasswordCodeForm.reset();
    forgotPasswordNewPasswordForm.reset();
  }

  function handleModalClose() {
    resetModalState();
    onClose();
  }

  function startForgotPasswordFlow() {
    form.clearErrors();
    setForgotPasswordEmail(email ?? "");
    forgotPasswordEmailForm.reset({ email: email ?? "" });
    setStep("forgot-password-email");
    forgotPasswordCodeForm.reset();
    forgotPasswordNewPasswordForm.reset();
  }

  async function onSubmit(values: ChangePasswordInput) {
    try {
      await execute(values);
      setStep("success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao alterar senha";

      // Clear errors first to ensure clean state
      form.clearErrors();

      // Handle backend validation error for password reuse
      if (
        message.toLowerCase().includes("não pode ser igual") ||
        message.toLowerCase().includes("deve ser diferente")
      ) {
        form.setError("newPassword", {
          message: "A nova senha não pode ser igual à senha atual",
          type: "validate",
        });
      } else {
        form.setError("root", { message });
      }
    }
  }

  async function onForgotPasswordEmailSubmit(values: ForgotPasswordEmailInput) {
    try {
      forgotPasswordEmailForm.clearErrors();

      const response = await forgotPasswordMutation.mutateAsync(values.email);

      if (!response.payload.resetToken) {
        forgotPasswordEmailForm.setError("root", {
          message: "Não foi possível iniciar a redefinição de senha.",
        });
        return;
      }

      setForgotPasswordEmail(values.email);
      setResetToken(response.payload.resetToken);
      forgotPasswordCodeForm.reset({ code: "" });
      setStep("forgot-password-code");
    } catch (error) {
      forgotPasswordEmailForm.setError("email", {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível enviar o código. Tente novamente.",
      });
    }
  }

  async function onForgotPasswordCodeSubmit(values: ForgotPasswordCodeInput) {
    if (!resetToken) {
      setStep("forgot-password-email");
      return;
    }

    try {
      const response = await verifyResetCodeMutation.mutateAsync({
        resetToken,
        code: values.code,
      });

      if (response.payload.verified) {
        forgotPasswordNewPasswordForm.reset();
        setStep("forgot-password-new-password");
        return;
      }

      forgotPasswordCodeForm.setError("code", {
        message: "Código incorreto, tente novamente.",
      });
    } catch {
      forgotPasswordCodeForm.setError("code", {
        message: "Código incorreto, tente novamente.",
      });
    }
  }

  async function handleResendCode() {
    if (!forgotPasswordEmail) {
      setStep("forgot-password-email");
      return;
    }

    try {
      const response =
        await forgotPasswordMutation.mutateAsync(forgotPasswordEmail);

      if (response.payload.resetToken) {
        setResetToken(response.payload.resetToken);
      }

      toast.success("Código reenviado! Verifique seu e-mail.");
    } catch {
      toast.error("Não foi possível reenviar o código. Tente novamente.");
    }
  }

  async function onForgotPasswordNewPasswordSubmit(
    values: ForgotPasswordNewPasswordInput,
  ) {
    if (!resetToken) {
      setStep("forgot-password-email");
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        resetToken,
        newPassword: values.newPassword,
      });

      setStep("success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao alterar senha";

      forgotPasswordNewPasswordForm.clearErrors();

      if (
        message.toLowerCase().includes("não pode ser igual") ||
        message.toLowerCase().includes("deve ser diferente")
      ) {
        forgotPasswordNewPasswordForm.setError("newPassword", {
          message,
          type: "validate",
        });
      } else {
        forgotPasswordNewPasswordForm.setError("root", {
          message,
          type: "custom",
        });
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title=""
      showCloseButton={false}
      variant="sheet"
      size="sm"
      bodyClassName="px-5 pt-4 pb-2 md:px-6 md:pt-5 flex flex-col gap-6 min-h-[430px] md:min-h-auto"
      footerClassName="flex-col-reverse items-stretch gap-3 px-5 py-4 md:flex-row md:items-center md:px-6 md:pb-6"
      footer={
        <ChangePasswordFormFooter
          step={step}
          onStartForgotPasswordFlow={startForgotPasswordFlow}
          onBackToChangePassword={() => setStep("change-password")}
          onBackToForgotPasswordEmail={() => setStep("forgot-password-email")}
          onBackToForgotPasswordCode={() => setStep("forgot-password-code")}
          onClose={handleModalClose}
          isLoading={isLoading}
          isChangeFormValid={form.formState.isValid}
          isForgotEmailFormValid={forgotPasswordEmailForm.formState.isValid}
          isForgotCodeFormValid={forgotPasswordCodeForm.formState.isValid}
          isForgotNewPasswordFormValid={
            forgotPasswordNewPasswordForm.formState.isValid
          }
          isForgotPasswordPending={forgotPasswordMutation.isPending}
          isVerifyCodePending={verifyResetCodeMutation.isPending}
          isResetPasswordPending={resetPasswordMutation.isPending}
          isChangePasswordMismatch={isChangePasswordMismatch}
          isForgotPasswordMismatch={isForgotPasswordMismatch}
        />
      }
    >
      {step === "change-password" && (
        <ChangePasswordStep
          form={form}
          newPasswordLength={currentNewPasswordValue.length}
          hasNewPasswordError={Boolean(errors.newPassword)}
          onSubmit={onSubmit}
          handleModalClose={handleModalClose}
        />
      )}

      {step === "forgot-password-email" && (
        <ForgotPasswordEmailStep
          form={forgotPasswordEmailForm}
          handleModalClose={handleModalClose}
          onSubmit={onForgotPasswordEmailSubmit}
        />
      )}

      {step === "forgot-password-code" && (
        <ForgotPasswordCodeStep
          form={forgotPasswordCodeForm}
          handleModalClose={handleModalClose}
          onSubmit={onForgotPasswordCodeSubmit}
          onResendCode={handleResendCode}
          isResendingCode={forgotPasswordMutation.isPending}
        />
      )}

      {step === "forgot-password-new-password" && (
        <ForgotPasswordNewPasswordStep
          form={forgotPasswordNewPasswordForm}
          onSubmit={onForgotPasswordNewPasswordSubmit}
          forgotPasswordLength={forgotPasswordLength}
          handleModalClose={handleModalClose}
        />
      )}

      {step === "success" && <SuccessStep />}
    </Modal>
  );
}
