import { VerifyCodeForm } from "./_components/VerifyCodeForm";

export default function VerifyCodePage() {
  return (
    <>
      <div className="flex flex-col items-start gap-2 lg:gap-4 w-full mt-12 md:mt-0">
        <h1 className="text-left text-2xl lg:text-3xl font-bold text-neutral-900 leading-8">
          Validação de conta
        </h1>
        <p className="text-neutral-600 text-base lg:text-xl leading-6 text-left font-normal">
          Verifique seu e-mail e digite abaixo o código recebido.
        </p>
      </div>

      <VerifyCodeForm />
    </>
  );
}
