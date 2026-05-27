import { Controller, type UseFormReturn } from "react-hook-form";
import StepCode from "@/components/ui/stepCode";
import { type ForgotPasswordCodeInput } from "@/app/(auth)/forgot-password/_schemas/forgot-password.schema";
import { Send, X } from "lucide-react";

interface IForgotPasswordCodeStepProps {
  form: UseFormReturn<ForgotPasswordCodeInput>;
  handleModalClose: () => void;
  onSubmit: (values: ForgotPasswordCodeInput) => Promise<void>;
  onResendCode: () => Promise<void>;
  isResendingCode: boolean;
}

export function ForgotPasswordCodeStep({
  form,
  handleModalClose,
  onSubmit,
  onResendCode,
  isResendingCode,
}: IForgotPasswordCodeStepProps) {
  const { errors } = form.formState;

  return (
    <>
      <div className="flex w-full items-center justify-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="hidden md:flex bg-feedback-purple-main text-neutral-white items-center justify-center rounded-lg w-10 h-10">
            <Send width={20} height={20} />
          </div>

          <h2 className="text-2xl md:text-base text-center font-semibold text-slate-900">
            Digite seu código
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


      <p className="text-neutral-600 text-base text-center w-full max-w-102.25 md:text-start md:text-neutral-950">
        Verifique seu e-mail e digite abaixo o código recebido.
      </p>

      <div className="hidden md:block w-full h-px bg-[#EBEDF0] rounded-full"></div>

      <form
        id="forgot-password-code-form"
        className="w-full max-w-102.25 space-y-5 flex flex-col items-center"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <Controller
          control={form.control}
          name="code"
          render={({ field, fieldState }) => (
            <StepCode
              value={field.value}
              onChange={(nextValue) => {
                field.onChange(nextValue);
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

        {errors.code?.message && (
          <p className="text-feedback-error-main text-sm leading-5 font-normal text-center">
            {errors.code.message}
          </p>
        )}

        <p className="text-neutral-700">
          Não recebeu o código?{" "}
          <button
            type="button"
            onClick={onResendCode}
            className="text-primary-main hover:underline cursor-pointer disabled:text-neutral-400 disabled:cursor-not-allowed transition"
            disabled={isResendingCode}
          >
            Reenviar
          </button>
        </p>
      </form>
    </>
  );
}
