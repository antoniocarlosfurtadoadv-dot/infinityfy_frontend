"use client";

import type { Permission } from "@/shared/types/permission";

interface IPermissionsCheckboxGroupProps {
  value: Permission[];
  onChange: (value: Permission[]) => void;
  disabled?: boolean;
  error?: string;
}

export function PermissionsCheckboxGroup({
  error,
}: IPermissionsCheckboxGroupProps) {
  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
