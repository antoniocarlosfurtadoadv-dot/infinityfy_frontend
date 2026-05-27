import { type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import Tip from "@/components/ui/Tip";
import { type ForgotPasswordNewPasswordInput } from "@/app/(auth)/forgot-password/_schemas/forgot-password.schema";
import { LockKeyholeIcon, X } from "lucide-react";

interface IForgotPasswordNewPasswordStepProps {
  form: UseFormReturn<ForgotPasswordNewPasswordInput>;
  onSubmit: (values: ForgotPasswordNewPasswordInput) => Promise<void>;
  forgotPasswordLength: number;
  handleModalClose: () => void;
}

export function ForgotPasswordNewPasswordStep({
  form,
  onSubmit,
  forgotPasswordLength,
  handleModalClose,
}: IForgotPasswordNewPasswordStepProps) {
  const { errors } = form.formState;

  return (
    <>
      <div className="flex w-full items-center justify-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="hidden md:flex bg-feedback-purple-main text-neutral-white items-center justify-center rounded-lg w-10 h-10">
            <LockKeyholeIcon width={20} height={20} />
          </div>

          <h2 className="text-2xl md:text-base text-center font-semibold text-slate-900">
            Alterar senha
          </h2>
        </div>

        <button
          type="button"
          className="hidden md:block absolute right-4 top-7 cursor-pointer"
          onClick={handleModalClose}
        >
          <X width={20} height={20} className="text-neutral-950" />
        </button>
      </div>

      <div className="hidden md:block w-full h-px bg-[#EBEDF0] rounded-full"></div>

      {errors.root?.message && (
        <Tip
          variant="error"
          content={errors.root.message}
          className="w-full max-w-102.25"
        />
      )}

      <form
        id="forgot-password-new-password-form"
        className="w-full max-w-102.25 space-y-5 flex flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <Input
          label="Nova senha"
          type="password"
          required
          hasNoErrorHint={true}
          {...form.register("newPassword")}
          error={errors.newPassword?.message}
        />
        <Input
          label="Confirmar nova senha"
          required
          type="password"
          hasNoErrorHint={true}
          {...form.register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <p
          className={`text-sm mx-auto md:mx-0 md:self-start md:text-neutral-600 ${
            errors.newPassword ||
            (forgotPasswordLength > 0 && forgotPasswordLength < 8)
              ? "text-feedback-error-main"
              : forgotPasswordLength >= 8
                ? "text-success-main"
                : "text-neutral-600"
          }`}
        >
          Mínimo de 8 caracteres, com letras e números.
        </p>
      </form>
    </>
  );
}
