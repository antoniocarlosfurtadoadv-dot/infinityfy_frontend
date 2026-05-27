"use client";

import { useRouter } from "next/navigation";

interface IBackButtonProps {
  onClick?: () => void;
  text?: string;
  className?: string;
}

export function BackButton({ onClick, text = "Voltar", className = "" }: IBackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 ${className}`}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {text}
    </button>
  );
}
