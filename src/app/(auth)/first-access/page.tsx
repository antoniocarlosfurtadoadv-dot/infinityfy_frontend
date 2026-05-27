import { FirstAccessForm } from "./_components/FirstAccessForm";

type FirstAccessPageProps = {
  searchParams?: Promise<{ token?: string }>;
};

export default async function FirstAccessPage(props: FirstAccessPageProps) {
  const searchParams = await props.searchParams;
  const resolved = searchParams ? await searchParams : undefined;
  const token = resolved?.token ?? null;

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col items-center">
      <FirstAccessForm token={token} />
    </div>
  );
}
