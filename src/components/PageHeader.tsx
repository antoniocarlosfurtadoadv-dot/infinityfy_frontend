interface IPageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: IPageHeaderProps) {
  return (
    <header className="flex flex-col gap-2">
      <h2 className="text-xl text-neutral-950 font-bold">{title}</h2>
      {subtitle && <p className="text-sm text-neutral-600 font-normal">{subtitle}</p>}
    </header>
  );
}
