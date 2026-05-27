import type { ReactNode } from "react";

interface ILoadingStateProps {
  isLoading?: boolean;
  children?: ReactNode;
  fallback?: ReactNode;
  message?: string;
}

export function LoadingState({ isLoading, children, fallback, message }: ILoadingStateProps) {
  if (isLoading) {
    return (
      <>
        {fallback || (
          <div className="flex items-center justify-center py-12">
            <div className="space-y-3 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-primary-main" />
              <p className="text-lg text-slate-500">{message || "Carregando..."}</p>
            </div>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}

interface ILoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className = "" }: ILoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={`animate-spin rounded-full border-slate-200 border-t-primary-main ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Carregando"
    />
  );
}

interface ILoadingOverlayProps {
  isLoading: boolean;
  children: ReactNode;
  message?: string;
}

export function LoadingOverlay({ isLoading, children, message }: ILoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="space-y-3 text-center">
            <LoadingSpinner size="lg" />
            {message && <p className="text-sm font-medium text-slate-700">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-5 w-40 rounded bg-slate-200" />
            <div className="h-4 w-32 rounded bg-slate-100" />
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-200" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-3/4 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
