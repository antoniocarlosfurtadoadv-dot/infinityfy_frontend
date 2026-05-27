"use client";

import { useRouter } from "next/navigation";

interface IErrorStateProps {
  message?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  onBack?: () => void;
}

export function ErrorState({
  message = "Não foi possível carregar os dados.",
  showBackButton = true,
  backButtonText = "Voltar",
  onBack,
}: IErrorStateProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="space-y-4 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-8 w-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-sm text-red-600">{message}</p>
      {showBackButton && (
        <button
          onClick={handleBack}
          className="text-sm font-semibold text-slate-900 hover:text-indigo-600"
        >
          {backButtonText}
        </button>
      )}
    </div>
  );
}
