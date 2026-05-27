import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "border-slate-100 bg-white shadow-sm",
  bordered: "border-slate-200 bg-white",
  elevated: "border-slate-100 bg-white shadow-lg",
  outline: "border-2 border-slate-200 bg-transparent",
  ghost: "border-transparent bg-slate-50",
};

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

interface ICardProps {
  title?: string;
  description?: string;
  className?: string;
  children?: ReactNode;
  footer?: ReactNode;
  headerAction?: ReactNode;
  variant?: keyof typeof variants;
  padding?: keyof typeof paddings;
  hoverable?: boolean;
}

export function Card({
  title,
  description,
  className,
  children,
  footer,
  headerAction,
  variant = "default",
  padding = "md",
  hoverable,
}: ICardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-200",
        variants[variant],
        paddings[padding],
        hoverable && "cursor-pointer hover:shadow-md hover:scale-[1.02]",
        className,
      )}
    >
      {(title || description || headerAction) && (
        <div className="mb-4 space-y-1">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
              {description && (
                <p className="text-sm text-slate-500">{description}</p>
              )}
            </div>
            {headerAction && <div className="shrink-0">{headerAction}</div>}
          </div>
        </div>
      )}
      {children && <div className="space-y-4">{children}</div>}
      {footer && <div className="mt-6 border-t border-slate-100 pt-4">{footer}</div>}
    </div>
  );
}
