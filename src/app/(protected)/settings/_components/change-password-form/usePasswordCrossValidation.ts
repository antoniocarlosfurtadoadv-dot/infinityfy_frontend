import { useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type ForgotPasswordNewPasswordInput } from "@/app/(auth)/forgot-password/_schemas/forgot-password.schema";
import { type ChangePasswordInput } from "../../_schemas/change-password.schema";
import {
  NEW_PASSWORD_MUST_DIFFER_MESSAGE,
  PASSWORDS_MUST_MATCH_MESSAGE,
} from "./constants";

interface IUsePasswordCrossValidationParams {
  form: UseFormReturn<ChangePasswordInput>;
  forgotPasswordNewPasswordForm: UseFormReturn<ForgotPasswordNewPasswordInput>;
  currentPasswordValue: string;
  currentNewPasswordValue: string;
  confirmPasswordValue: string;
  forgotNewPasswordValue: string;
  forgotConfirmPasswordValue: string;
  newPasswordErrorMessage?: string;
  confirmPasswordErrorMessage?: string;
  forgotConfirmPasswordErrorMessage?: string;
}

interface IUsePasswordCrossValidationResult {
  isChangePasswordMismatch: boolean;
  isForgotPasswordMismatch: boolean;
}

export function usePasswordCrossValidation({
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
}: IUsePasswordCrossValidationParams): IUsePasswordCrossValidationResult {
  const isChangePasswordMismatch =
    confirmPasswordValue.length > 0 &&
    currentNewPasswordValue.length > 0 &&
    confirmPasswordValue !== currentNewPasswordValue;

  const isForgotPasswordMismatch =
    forgotConfirmPasswordValue.length > 0 &&
    forgotNewPasswordValue.length > 0 &&
    forgotConfirmPasswordValue !== forgotNewPasswordValue;

  useEffect(() => {
    const hasBothPasswords =
      currentPasswordValue.length > 0 && currentNewPasswordValue.length > 0;
    const isSameAsCurrent =
      hasBothPasswords && currentPasswordValue === currentNewPasswordValue;

    if (isSameAsCurrent) {
      // Prevent unnecessary state writes to avoid noisy re-renders.
      if (newPasswordErrorMessage !== NEW_PASSWORD_MUST_DIFFER_MESSAGE) {
        form.setError("newPassword", {
          message: NEW_PASSWORD_MUST_DIFFER_MESSAGE,
          type: "validate",
        });
      }
      return;
    }

    if (newPasswordErrorMessage === NEW_PASSWORD_MUST_DIFFER_MESSAGE) {
      form.clearErrors("newPassword");
    }
  }, [
    currentPasswordValue,
    currentNewPasswordValue,
    form,
    newPasswordErrorMessage,
  ]);

  useEffect(() => {
    const shouldValidateMatch =
      confirmPasswordValue.length > 0 && currentNewPasswordValue.length > 0;
    const isMismatch =
      shouldValidateMatch && confirmPasswordValue !== currentNewPasswordValue;

    if (isMismatch) {
      if (confirmPasswordErrorMessage !== PASSWORDS_MUST_MATCH_MESSAGE) {
        form.setError("confirmPassword", {
          message: PASSWORDS_MUST_MATCH_MESSAGE,
          type: "validate",
        });
      }
      return;
    }

    if (confirmPasswordErrorMessage === PASSWORDS_MUST_MATCH_MESSAGE) {
      form.clearErrors("confirmPassword");
    }
  }, [
    confirmPasswordValue,
    currentNewPasswordValue,
    form,
    confirmPasswordErrorMessage,
  ]);

  useEffect(() => {
    const shouldValidateMatch =
      forgotConfirmPasswordValue.length > 0 &&
      forgotNewPasswordValue.length > 0;
    const isMismatch =
      shouldValidateMatch &&
      forgotConfirmPasswordValue !== forgotNewPasswordValue;

    if (isMismatch) {
      if (forgotConfirmPasswordErrorMessage !== PASSWORDS_MUST_MATCH_MESSAGE) {
        forgotPasswordNewPasswordForm.setError("confirmPassword", {
          message: PASSWORDS_MUST_MATCH_MESSAGE,
          type: "validate",
        });
      }
      return;
    }

    if (forgotConfirmPasswordErrorMessage === PASSWORDS_MUST_MATCH_MESSAGE) {
      forgotPasswordNewPasswordForm.clearErrors("confirmPassword");
    }
  }, [
    forgotConfirmPasswordValue,
    forgotNewPasswordValue,
    forgotPasswordNewPasswordForm,
    forgotConfirmPasswordErrorMessage,
  ]);

  return {
    isChangePasswordMismatch,
    isForgotPasswordMismatch,
  };
}
