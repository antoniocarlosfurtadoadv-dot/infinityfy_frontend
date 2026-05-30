"use client";

import Link from "next/link";
import { PermissionGuard } from "@/components/PermissionGuard";
import { PageHeader } from "@/components/PageHeader";
import { PageHeaderGroup } from "@/components/PageHeaderGroup";
import { RoleProfileFilter } from "./_components/RoleProfileFilter";
import { RoleProfileList } from "./_components/RoleProfileList";
import { Permission } from "@/shared/types/permission";
import { Button } from "@/components/ui/Button";

export default function RoleProfilesPage() {
  return (
    <PermissionGuard requiredPermissions={[Permission.GESTAO_GERENCIAR_PERFIS]}>
      <div className="space-y-8">
        <PageHeaderGroup>
          <PageHeader
            title="Perfis de Acesso"
            subtitle="Gerencie os perfis de permissão do sistema."
          />
          <Button asChild size="md">
            <Link href="/perfis/new">+ Novo perfil</Link>
          </Button>
        </PageHeaderGroup>
        <RoleProfileFilter />
        <RoleProfileList />
      </div>
    </PermissionGuard>
  );
}
