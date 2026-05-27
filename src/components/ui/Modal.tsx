"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "center" | "sheet";
  showCloseButton?: boolean;
  containerClassName?: string;
  contentClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  variant = "center",
  showCloseButton = true,
  containerClassName,
  contentClassName,
  bodyClassName,
  footerClassName,
}: IModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const sheetSizeClasses = {
    sm: "md:max-w-md",
    md: "md:max-w-[401px]",
    lg: "md:max-w-3xl",
    xl: "md:max-w-4xl",
  };

  const containerClasses =
    variant === "sheet"
      ? "fixed inset-0 z-50 flex items-end justify-center p-0 md:items-center md:p-4"
      : "fixed inset-0 z-50 flex items-center justify-center p-4";

  const contentClasses =
    variant === "sheet"
      ? "relative w-screen min-h-[341px] md:min-h-auto max-h-[90vh] max-w-none rounded-t-[40px] rounded-b-none bg-white flex flex-col shadow-xl md:rounded-3xl overflow-hidden"
      : "relative w-full max-h-[90vh] rounded-2xl bg-white shadow-xl flex flex-col overflow-hidden";

  return createPortal(
    <div className={cn(containerClasses, containerClassName)} onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#041332B2] " />

      {/* Modal */}
      <div
        className={cn(
          contentClasses,
          variant === "sheet" ? sheetSizeClasses[size] : sizeClasses[size],
          contentClassName,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {variant === "sheet" && (
          <div className="mx-auto mt-3 mb-2 h-1.5 w-12 rounded-full bg-neutral-300 md:hidden shrink-0" />
        )}

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="shrink-0 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div
          className={cn(
            "w-full flex-1 relative flex flex-col items-center",
            bodyClassName,
          )}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={cn(
              "shrink-0 flex items-center justify-end gap-3 px-6 py-4 md:py-0",
              footerClassName,
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
