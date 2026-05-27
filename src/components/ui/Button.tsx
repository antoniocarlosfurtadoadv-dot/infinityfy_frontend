"use client";

import type { ButtonHTMLAttributes } from "react";
import { forwardRef, cloneElement, Children } from "react";
import clsx from "clsx";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary-main hover:bg-primary-darker active:bg-primary-darker text-neutral-white font-semibold disabled:bg-neutral-200 disabled:cursor-not-allowed disabled:text-neutral-500",
  secondary:
    "bg-neutral-white hover:bg-neutral-200 active:bg-neutral-300 text-neutral-950 font-bold",
  ghost:
    "bg-transparent text-neutral-950 hover:bg-neutral-100 active:bg-neutral-200 font-medium",
  danger:
    "bg-feedback-error-main hover:bg-feedback-error-dark active:bg-feedback-error-dark text-neutral-white font-semibold disabled:bg-neutral-200 disabled:cursor-not-allowed",
  success:
    "bg-feedback-success-main hover:bg-feedback-success-dark active:bg-feedback-success-dark text-neutral-white font-semibold disabled:bg-neutral-200 disabled:cursor-not-allowed",
  default:
    "text-neutral-950 font-bold text-base hover:text-secondary-main active:text-secondary-dark transition destructive:text-feedback-error-main destructive:hover:text-feedback-error-dark destructive:active:text-feedback-error-dark destructive:p-0",
};

const sizes = {
  sm: "min-h-[36px] py-2 px-5 text-xs leading-4 md:min-h-0",
  md: "min-h-[44px] py-2.5 px-5 text-sm leading-5 md:min-h-0 md:py-3 md:px-6 md:text-base",
  lg: "min-h-[48px] py-3 px-6 text-base leading-6 md:min-h-0 md:py-4 md:px-8 md:text-lg",
};

const spacingSizes = {
  sm: "min-h-[36px] py-2 px-5 leading-4 md:min-h-0",
  md: "min-h-[44px] py-2.5 px-5 leading-5 md:min-h-0 md:py-3 md:px-6",
  lg: "min-h-[48px] py-3 px-6 leading-6 md:min-h-0 md:py-4 md:px-8",
};

const loaderSizes = {
  sm: "size-3",
  md: "size-4 md:size-5",
  lg: "size-5 md:size-6",
};

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      disabled,
      isLoading,
      leftIcon,
      rightIcon,
      fullWidth,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const isPrimaryVariant =
      variant === "primary" || variant === "danger" || variant === "success";
    const showInlineLoader = isLoading && isPrimaryVariant;
    const showIconsLoader = isLoading && !isPrimaryVariant;

    const buttonClasses = cn(
      "inline-flex items-center justify-center gap-2 rounded-full transition select-none cursor-pointer",
      "tap-highlight-transparent touch-manipulation",
      variants[variant],
      variant === "default" ? spacingSizes[size] : sizes[size],
      fullWidth && "w-full",
      className,
    );

    const buttonContent = (
      <>
        {showInlineLoader && (
          <>
            {!isLoading && leftIcon && (
              <span className="inline-flex shrink-0 items-center justify-center leading-none">
                {leftIcon}
              </span>
            )}
            <span>{children}</span>
            <LoaderCircle
              className={clsx("animate-spin shrink-0", loaderSizes[size])}
            />
            {!isLoading && rightIcon && (
              <span className="inline-flex shrink-0 items-center justify-center leading-none">
                {rightIcon}
              </span>
            )}
          </>
        )}

        {showIconsLoader && (
          <LoaderCircle
            className={clsx("mx-auto animate-spin", loaderSizes[size])}
          />
        )}

        {!isLoading && (
          <>
            {leftIcon && (
              <span className="inline-flex shrink-0 items-center justify-center leading-none">
                {leftIcon}
              </span>
            )}
            <span>{children}</span>
            {rightIcon && (
              <span className="inline-flex shrink-0 items-center justify-center leading-none">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </>
    );

    if (asChild && Children.only(children)) {
      const child = Children.only(children) as React.ReactElement<{
        className?: string;
        children?: React.ReactNode;
      }>;

      // Combinar leftIcon, children do elemento filho, e rightIcon
      const combinedChildren = (
        <>
          {showInlineLoader && (
            <>
              {!isLoading && leftIcon && (
                <span className="inline-flex shrink-0 items-center justify-center leading-none">
                  {leftIcon}
                </span>
              )}
              {child.props.children}
              <LoaderCircle
                className={clsx("animate-spin shrink-0", loaderSizes[size])}
              />
              {!isLoading && rightIcon && (
                <span className="inline-flex shrink-0 items-center justify-center leading-none">
                  {rightIcon}
                </span>
              )}
            </>
          )}

          {showIconsLoader && (
            <LoaderCircle
              className={clsx("mx-auto animate-spin", loaderSizes[size])}
            />
          )}

          {!isLoading && (
            <>
              {leftIcon && (
                <span className="inline-flex shrink-0 items-center justify-center leading-none">
                  {leftIcon}
                </span>
              )}
              {child.props.children}
              {rightIcon && (
                <span className="inline-flex shrink-0 items-center justify-center leading-none">
                  {rightIcon}
                </span>
              )}
            </>
          )}
        </>
      );

      return cloneElement(child, {
        ...props,
        className: clsx(buttonClasses, child.props.className),
        disabled: disabled || isLoading,
        "aria-busy": isLoading,
        children: combinedChildren,
      } as React.Attributes);
    }

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {buttonContent}
      </button>
    );
  },
);

Button.displayName = "Button";
