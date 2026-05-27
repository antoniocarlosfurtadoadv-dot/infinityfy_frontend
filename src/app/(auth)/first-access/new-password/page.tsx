import { FirstAccessNewPasswordForm } from "./_components/FirstAccessNewPasswordForm";

type FirstAccessNewPasswordPageProps = {
  searchParams?: Promise<{ token?: string }>;
};

export default async function FirstAccessNewPasswordPage(props: FirstAccessNewPasswordPageProps) {
  const searchParams = await props.searchParams;
  const resolved = searchParams ? await searchParams : undefined;
  const token = resolved?.token ?? null;

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col items-center">
      <FirstAccessNewPasswordForm token={token} />
    </div>
  );
}
