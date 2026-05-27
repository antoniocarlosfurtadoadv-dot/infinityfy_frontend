import { NewPasswordForm } from "./_components/NewPasswordForm";

export default function NewPasswordPage() {
  return (
    <>
      <div className="flex flex-col items-start gap-2 xl:gap-4 w-full mt-12 md:mt-0">
        <h1 className="text-left text-2xl xl:text-3xl font-bold  text-neutral-900 leading-8">
          Criar senha
        </h1>
        <p className="text-neutral-600 text-base xl:text-xl leading-6 text-left font-normal">
          Crie uma senha forte.
        </p>
      </div>

      <NewPasswordForm />
    </>
  );
}
