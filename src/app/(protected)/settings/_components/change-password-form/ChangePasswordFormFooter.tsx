import { type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { type PasswordStep } from "./types";

interface IChangePasswordFormFooterProps {
  step: PasswordStep;
  onStartForgotPasswordFlow: () => void;
  onBackToChangePassword: () => void;
  onBackToForgotPasswordEmail: () => void;
  onBackToForgotPasswordCode: () => void;
  onClose: () => void;
  isLoading: boolean;
  isChangeFormValid: boolean;
  isForgotEmailFormValid: boolean;
  isForgotCodeFormValid: boolean;
  isForgotNewPasswordFormValid: boolean;
  isForgotPasswordPending: boolean;
  isVerifyCodePending: boolean;
  isResetPasswordPending: boolean;
  isChangePasswordMismatch: boolean;
  isForgotPasswordMismatch: boolean;
}

export function ChangePasswordFormFooter({
  step,
  onStartForgotPasswordFlow,
  onClose,
  isLoading,
  isChangeFormValid,
  isForgotEmailFormValid,
  isForgotCodeFormValid,
  isForgotNewPasswordFormValid,
  isForgotPasswordPending,
  isVerifyCodePending,
  isResetPasswordPending,
  isChangePasswordMismatch,
  isForgotPasswordMismatch,
}: IChangePasswordFormFooterProps): ReactNode {
  switch (step) {
    case "change-password":
      return (
        <div className="flex flex-col-reverse gap-2 md:flex-row md:w-full md:mt-4">
          <Button
            type="button"
            variant="default"
            className="w-full max-w-102.25 mx-auto "
            onClick={onStartForgotPasswordFlow}
          >
            Esqueci a senha
          </Button>
          <Button
            type="submit"
            form="change-password-form"
            className="w-full max-w-102.25 mx-auto"
            isLoading={isLoading}
            disabled={
              !isChangeFormValid || isLoading || isChangePasswordMismatch
            }
          >
            Alterar senha
          </Button>
        </div>
      );

    case "forgot-password-email":
      return (
        <>
          <Button
            type="submit"
            form="forgot-password-email-form"
            className="w-full max-w-102.25 mx-auto md:mt-6"
            isLoading={isForgotPasswordPending}
            disabled={!isForgotEmailFormValid || isForgotPasswordPending}
          >
            Enviar codigo
          </Button>
        </>
      );

    case "forgot-password-code":
      return (
        <>
          <Button
            type="submit"
            form="forgot-password-code-form"
            className="w-full max-w-102.25 mx-auto md:mt-6"
            isLoading={isVerifyCodePending}
            disabled={!isForgotCodeFormValid || isVerifyCodePending}
          >
            Verificar codigo
          </Button>
        </>
      );

    case "forgot-password-new-password":
      return (
        <>
          <Button
            type="submit"
            form="forgot-password-new-password-form"
            className="w-full max-w-102.25 mx-auto md:mt-6"
            isLoading={isResetPasswordPending}
            disabled={
              !isForgotNewPasswordFormValid ||
              isResetPasswordPending ||
              isForgotPasswordMismatch
            }
          >
            Alterar senha
          </Button>
        </>
      );

    case "success":
      return (
        <Button
          type="button"
          className="w-full max-w-102.25 mx-auto"
          onClick={onClose}
        >
          Voltar
        </Button>
      );

    default:
      return null;
  }
}
