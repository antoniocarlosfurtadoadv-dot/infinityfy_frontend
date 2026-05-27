"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/core/hooks/useAuth";
import { useRouter } from "next/navigation";
import type { Permission } from "@/shared/types/permission";
import type { IRoleProfile } from "@/shared/types/role-profile";
import { UnauthorizedState } from "./UnauthorizedState";

interface IPermissionGuardProps {
  children: ReactNode;
  requiredPermissions: Permission[];
  requireAll?: boolean;
  redirectTo?: string;
  allowedRoleTypes?: IRoleProfile["type"][] | null;
}

export function PermissionGuard({
  children,
  requiredPermissions,
  requireAll = false,
  redirectTo = "/dashboard",
  allowedRoleTypes = null,
}: IPermissionGuardProps) {
  const { user } = useAuth();
  const router = useRouter();

  const userPermissions = user?.roleProfile?.defaultPermissions ?? [];

  const hasPermission = requireAll
    ? requiredPermissions.every((p) => userPermissions.includes(p))
    : requiredPermissions.some((p) => userPermissions.includes(p));

  const userRoleType = user?.roleProfile?.type ?? null;
  const hasAllowedRoleType =
    allowedRoleTypes === null ||
    (userRoleType !== null && allowedRoleTypes.includes(userRoleType));

  if (!user) {
    return null;
  }

  if (!hasPermission || !hasAllowedRoleType) {
    return (
      <UnauthorizedState redirectTo={redirectTo} onBack={() => router.back()} />
    );
  }

  return <>{children}</>;
}
