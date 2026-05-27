import { type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import Tip from "@/components/ui/Tip";
import { type ForgotPasswordEmailInput } from "@/app/(auth)/forgot-password/_schemas/forgot-password.schema";
import { Send, X } from "lucide-react";

interface IForgotPasswordEmailStepProps {
  form: UseFormReturn<ForgotPasswordEmailInput>;
  handleModalClose: () => void;
  onSubmit: (values: ForgotPasswordEmailInput) => Promise<void>;
}

export function ForgotPasswordEmailStep({
  form,
  handleModalClose,
  onSubmit,
}: IForgotPasswordEmailStepProps) {
  const { errors } = form.formState;

  return (
    <>
      <div className="flex w-full items-center justify-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="hidden md:flex bg-feedback-purple-main text-neutral-white items-center justify-center rounded-lg w-10 h-10">
            <Send width={20} height={20} />
          </div>

          <h2 className="text-2xl md:text-base text-center font-semibold text-slate-900">
            Esqueceu a senha?
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
        Insira seu e-mail para receber o código de redefinição de senha.
      </p>

      <div className="hidden md:block w-full h-px bg-[#EBEDF0] rounded-full"></div>

      {errors.root?.message && (
        <Tip
          variant="error"
          content={errors.root.message}
          className="w-full max-w-102.25"
        />
      )}

      <form
        id="forgot-password-email-form"
        className="w-full max-w-102.25 space-y-5 flex flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <Input
          label="E-mail"
          type="email"
          required
          {...form.register("email")}
          error={errors.email?.message}
        />
      </form>
    </>
  );
}
