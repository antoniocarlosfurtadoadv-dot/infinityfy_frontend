"use client";

import type { SelectHTMLAttributes } from "react";
import { forwardRef } from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export interface ISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  hint?: string;
  selectSize?: keyof typeof sizes;
  options?: Array<{ value: string | number; label: string }>;
  isRequired?: boolean;
  hasOptionalLabel?: boolean;
  tooltipDescription?: string;
  isPlaceholderDisabled?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, ISelectProps>(
  ({
    className,
    error,
    label,
    hint,
    id,
    selectSize = "md",
    options,
    children,
    isRequired,
    hasOptionalLabel,
    tooltipDescription,
    isPlaceholderDisabled,
    ...props
  }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="flex w-auto flex-col gap-2">
        {label && (
          <label
            htmlFor={selectId}
            className="flex items-center gap-1 text-sm font-semibold text-neutral-950"
          >
            {label}
            {(isRequired || props.required) && (
              <span className="text-red-500">*</span>
            )}
            {hasOptionalLabel && (
              <span className="ml-1 text-sm text-neutral-600">
                (opcional)
              </span>
            )}
            {tooltipDescription && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex cursor-pointer items-center text-neutral-400 hover:text-neutral-600"
                    >
                      <Info size={14} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">{label}</p>
                    <p>{tooltipDescription}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full appearance-none rounded-sm border bg-white text-neutral-950 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
            error
              ? "border-feedback-error-main focus:border-feedback-error-main focus:shadow-feedback-error-main/16 focus:shadow-[0px_0px_0px_3px]"
              : "border-neutral-300 hover:bg-neutral-100 focus:border-secondary-main focus:shadow-secondary-main/16 focus:shadow-[0px_0px_0px_3px]",
            sizes[selectSize],
            "bg-size-[16px_16px] bg-position-[right_12px_center] bg-no-repeat",
            "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzY0NzQ4QiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')]",
            "pr-10",
            className,
          )}
          {...props}
        >
          {!isPlaceholderDisabled && (
            <option value="" disabled hidden className="text-neutral-950">
              Selecione
            </option>
          )}
          {children || options?.map((option) => (
            <option key={option.value} value={option.value} className="text-neutral-950">
              {option.label}
            </option>
          ))}
        </select>
        {hint && !error && (
          <span className="text-xs text-slate-500">{hint}</span>
        )}
        {error && <span className="text-xs text-feedback-error-main">{error}</span>}
      </div>
    );
  },
);

Select.displayName = "Select";
