import { cn } from "@/lib/utils";

interface IBadgeProps {
  label?: string;
  showBadge?: boolean;
  badgeText?: string;
  className?: string;
}

export function Badge({
  label,
  showBadge = false,
  badgeText = "NOVO",
  className
}: IBadgeProps) {
  return (
    <>
      <span className=" truncate">{label}</span>
      {showBadge && (
        <span className={cn(" flex items-center rounded-full  px-2.5 py-1 text-xs font-medium leading-none ", className)}>
          {badgeText}
        </span>
      )}
    </>
  );
}
