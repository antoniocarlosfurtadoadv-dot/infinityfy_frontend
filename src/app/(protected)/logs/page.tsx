"use client";

import { LogsList } from "./_components/LogsList";
import { LogsFilter } from "./_components/LogsFilter";
import { PermissionGuard } from "@/components/PermissionGuard";
import { PageHeader } from "@/components/PageHeader";
import { Permission } from "@/shared/types/permission";

export default function LogsPage() {
  return (
    <PermissionGuard requiredPermissions={[Permission.GESTAO_VISUALIZAR_LOGS]}>
      <div className="space-y-8">

        <PageHeader
          title="Registro de Atividades"
          subtitle="Visualize todas as ações realizadas no sistema."
        />

        <LogsFilter />

        <LogsList />
      </div>
    </PermissionGuard>
  );
}
