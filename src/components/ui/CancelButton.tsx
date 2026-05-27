"use client";

import { useRouter } from "next/navigation";
import { Button } from "./Button";

interface ICancelButtonProps {
  onClick?: () => void;
  text?: string;
  className?: string;
}

export function CancelButton({ onClick, text = "Cancelar", className = "" }: ICancelButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleClick}
      className={className}
    >
      {text}
    </Button>
  );
}
