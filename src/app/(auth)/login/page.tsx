import { LoginForm } from "./_components/LoginForm";
import Tip from "@/components/ui/Tip";

type LoginPageProps = {
  searchParams?: Promise<{
    setup?: string;
  }>;
};

export default async function LoginPage(props: LoginPageProps) {
  const searchParams = await props.searchParams;
  const resolved = searchParams ? await searchParams : undefined;
  const showSetupSuccess = resolved?.setup === "true";

  return (
    <div className="flex flex-col items-center gap-12">
      {showSetupSuccess && (
        <Tip
          variant="success"
          content="Acesso configurado! Faça login com sua nova senha."
          className="px-4 w-full mt-12 md:mt-0"
        />
      )}

      <div className="flex flex-col items-start gap-2 lg:gap-4 w-full mt-12 md:mt-0">
        <h1 className="text-left text-2xl lg:text-3xl font-bold text-neutral-900 leading-8">
          Entrar na conta
        </h1>
        <p className="text-neutral-600 text-base lg:text-xl leading-6 text-left font-normal">
          Insira seu e-mail e senha para acessar seus exames.
        </p>
      </div>

      <LoginForm />
    </div>
  );
}
