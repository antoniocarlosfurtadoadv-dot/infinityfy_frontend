"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/core/hooks/useAuth";
import { useRouter } from "next/navigation";
import type { Permission } from "@/shared/types/permission";
import { UnauthorizedState } from "./UnauthorizedState";

interface IPermissionGuardProps {
  children: ReactNode;
  requiredPermissions: Permission[];
  requireAll?: boolean;
  redirectTo?: string;
}

export function PermissionGuard({
  children,
  requiredPermissions,
  requireAll = false,
  redirectTo = "/dashboard",
}: IPermissionGuardProps) {
  const { user } = useAuth();
  const router = useRouter();

  const userPermissions = user?.roleProfile?.defaultPermissions ?? [];

  const hasPermission = requireAll
    ? requiredPermissions.every((p) => userPermissions.includes(p))
    : requiredPermissions.some((p) => userPermissions.includes(p));

  if (!user) {
    return null;
  }

  if (!hasPermission) {
    return (
      <UnauthorizedState redirectTo={redirectTo} onBack={() => router.back()} />
    );
  }

  return <>{children}</>;
}
