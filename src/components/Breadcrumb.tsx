import Link from "next/link";

export interface IBreadcrumbItem {
  label: string;
  href?: string;
}

interface IBreadcrumbProps {
  items: IBreadcrumbItem[];
}

export function Breadcrumb({ items }: IBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <span className="text-slate-400 text-base">/</span>
              )}
              {isLast || !item.href ? (
                <span className={isLast ? " font-semibold text-primary-darker" : ""}>{item.label}</span>
              ) : (
                <Link href={item.href} className="transition hover:text-slate-900">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
