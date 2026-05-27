"use client";

import type { TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variants = {
  default:
    "border border-neutral-300 hover:bg-neutral-100 focus:border-secondary-main focus:shadow-secondary-main/16 focus:shadow-[0px_0px_0px_3px]",
  error:
    "border-feedback-error-main focus:border-feedback-error-main focus:ring-feedback-error-main focus:shadow-feedback-error-main/16 focus:shadow-[0px_0px_0px_3px]",
  success: "border-green-400 focus:border-green-400 focus:ring-green-100",
};

const sizes = {
  sm: "min-h-24 px-3 py-2 text-sm",
  md: "min-h-32 px-4 py-3 text-sm",
  lg: "min-h-40 px-5 py-4 text-base",
};

export interface ITextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  hasNoErrorHint?: boolean;
  label?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: keyof typeof variants;
  textareaSize?: keyof typeof sizes;
  hasOptionalLabel?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, ITextareaProps>(
  (
    {
      className,
      error,
      hasNoErrorHint,
      label,
      hint,
      id,
      leftIcon,
      rightIcon,
      variant,
      textareaSize = "md",
      hasOptionalLabel,
      ...props
    },
    ref,
  ) => {
    const textareaId = id || props.name;
    const inputVariant = error ? "error" : variant || "default";

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-semibold text-neutral-950"
          >
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
            {hasOptionalLabel && (
              <span className="ml-1 text-sm font-normal text-neutral-600">(opcional)</span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-3 text-slate-400">
              {leftIcon}
            </div>
          )}
          <textarea
            ref={ref}
            id={textareaId}
            className={cn(
              "w-full rounded-sm bg-white text-neutral-950 outline-none transition placeholder:text-neutral-600 placeholder:text-sm disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400",
              variants[inputVariant],
              sizes[textareaSize],
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-3">{rightIcon}</div>
          )}
        </div>

        {hint && !error && (
          <span className="text-xs text-slate-500">{hint}</span>
        )}
        {hasNoErrorHint !== true && error && (
          <span className="text-xs text-feedback-error-main">{error}</span>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
