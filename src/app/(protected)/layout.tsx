"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/hooks/useAuth";
import { DashboardShell } from "./_components/DashboardShell";
import { LoadingState } from "@/components/LoadingState";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingState isLoading>{children}</LoadingState>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
