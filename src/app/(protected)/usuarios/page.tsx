"use client";

import Link from "next/link";
import { PermissionGuard } from "@/components/PermissionGuard";
import { PageHeader } from "@/components/PageHeader";
import { PageHeaderGroup } from "@/components/PageHeaderGroup";
import { UsersFilter } from "./_components/UsersFilter";
import { UsersList } from "./_components/UsersList";
import { Permission } from "@/shared/types/permission";
import { Button } from "@/components/ui/Button";

export default function UsersPage() {

  return (
    <PermissionGuard requiredPermissions={[Permission.GESTAO_GERENCIAR_USUARIOS]}>
      <div className="space-y-8">
        <PageHeaderGroup>
          <PageHeader
            title="Gerenciamento de Usuários"
            subtitle="Gerencie os usuários do sistema, atribua funções e controle o acesso."
          />
          <Button asChild size="md">
            <Link href="/usuarios/new">Novo usuário</Link>
          </Button>
        </PageHeaderGroup>

        <UsersFilter />

        <UsersList />
      </div>
    </PermissionGuard>
  );
}
