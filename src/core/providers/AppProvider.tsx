"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { AuthProvider } from "./AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const ClientToaster = dynamic(
  () => import("sonner").then((mod) => mod.Toaster),
  { ssr: false },
);

interface IAppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: IAppProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            throwOnError: false,
          },
          mutations: {
            // Prevent React Query from throwing errors that would trigger Next.js error overlay
            throwOnError: false,
          },
        },
      }),
  );

  // Suppress unhandled promise rejections in development
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Only suppress AppError instances
      if (event.reason?.name === "AppError") {
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ClientToaster position="top-right" richColors />
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
