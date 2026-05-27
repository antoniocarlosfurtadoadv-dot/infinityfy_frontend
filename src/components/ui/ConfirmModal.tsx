"use client";

import type { ReactNode } from "react";
import { AlertTriangle, Info, Zap } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export interface IConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  isLoading = false,
}: IConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
    if (!isLoading) {
      onClose();
    }
  };

  const variantStyles = {
    danger: {
      icon: AlertTriangle,
      iconBg: "bg-feedback-error-main",
      buttonVariant: "danger" as const,
    },
    warning: {
      icon: Zap,
      iconBg: "bg-amber-500",
      buttonVariant: "primary" as const,
    },
    info: {
      icon: Info,
      iconBg: "bg-primary-main",
      buttonVariant: "primary" as const,
    },
  };

  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      showCloseButton={false}
      variant="sheet"
      size="sm"
      contentClassName="md:p-6 md:gap-12"
      footer={
        <>
          <Button
            variant="secondary"
            className="w-full"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={style.buttonVariant}
            className="w-full"
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="relative flex flex-col items-center">
        <div className="flex flex-col items-center gap-6 text-center mt-5">
          <div
            className={cn(
              "flex items-center justify-center w-14 h-14 rounded-2xl",
              style.iconBg,
            )}
          >
            <Icon size={28} className="text-white" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-semibold text-neutral-900">{title}</h2>
            <p className="text-neutral-700 text-base leading-6">{message}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
