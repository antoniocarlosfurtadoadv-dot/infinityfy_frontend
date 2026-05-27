import { cn } from "@/lib/utils";

interface IInfoFieldProps {
  label: string;
  value: string | number | null | undefined;
  classNameDt?: string;
  classNameDd?: string;
}


export function InfoField({ label, value, classNameDt, classNameDd }: IInfoFieldProps) {
  if (value === null || value === undefined || value === "") return null;

  return (
    <div>
      <dt className={cn("text-xs font-medium text-neutral-700", classNameDt)}>
        {label}
      </dt>
      <dd className={cn("mt-2 text-sm text-neutral-950", classNameDd)}>
        {value}
      </dd>
    </div>
  );
}
