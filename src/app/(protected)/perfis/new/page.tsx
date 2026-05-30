"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { PermissionGuard } from "@/components/PermissionGuard";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { RoleProfileForm } from "../_components/RoleProfileForm";
import { Permission } from "@/shared/types/permission";

export default function NewRoleProfilePage() {
  const router = useRouter();

  return (
    <PermissionGuard requiredPermissions={[Permission.GESTAO_GERENCIAR_PERFIS]}>
      <div className="space-y-6">
        <PageHeader title="Novo Perfil de Acesso" />
        <Breadcrumb
          items={[
            { label: "Perfis", href: "/perfis" },
            { label: "Novo Perfil" },
          ]}
        />
        <Card>
          <RoleProfileForm
            onSuccess={() => router.push("/perfis")}
            onCancel={() => router.back()}
          />
        </Card>
      </div>
    </PermissionGuard>
  );
}
