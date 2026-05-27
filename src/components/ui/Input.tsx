"use client";

import type { InputHTMLAttributes } from "react";
import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

const variants = {
  default:
    "border-neutral-300 hover:bg-neutral-100 focus:border-secondary-main focus:shadow-secondary-main/16 focus:shadow-[0px_0px_0px_3px]",
  error: "border-feedback-error-main focus:border-feedback-error-main focus:ring-feedback-error-main focus:shadow-feedback-error-main/16 focus:shadow-[0px_0px_0px_3px]",
  success: "border-green-400 focus:border-green-400 focus:ring-green-100",
};

const sizes = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  hasNoErrorHint?: boolean;
  label?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: keyof typeof variants;
  inputSize?: keyof typeof sizes;
  hasOptionalLabel?: boolean;
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(
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
      inputSize = "md",
      type,
      hasOptionalLabel,
      ...props
    },
    ref,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const inputId = id || props.name;
    const isPasswordField = type === "password";
    const inputVariant = error ? "error" : variant || "default";
    const resolvedType = isPasswordField
      ? isPasswordVisible
        ? "text"
        : "password"
      : type;

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-neutral-950"
          >
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
            {hasOptionalLabel && (
              <span className="ml-1 text-sm text-neutral-600">
                (opcional)
              </span>
            )}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-sm border bg-white text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400",
              variants[inputVariant],
              sizes[inputSize],
              leftIcon && "pl-10",
              (rightIcon || isPasswordField) && "pr-10",
              className,
            )}
            {...props}
            type={resolvedType}
          />
          {isPasswordField ? (
            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition "
              aria-label={isPasswordVisible ? "Hide Password" : "Show Password"}
              tabIndex={props.disabled ? -1 : 0}
              disabled={props.disabled}
            >
              {isPasswordVisible ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          ) : (
            rightIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 ">
                {rightIcon}
              </div>
            )
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

Input.displayName = "Input";
