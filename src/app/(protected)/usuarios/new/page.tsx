"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { PermissionGuard } from "@/components/PermissionGuard";
import { UserForm } from "../_components/UserForm";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageHeader } from "@/components/PageHeader";
import { Permission } from "@/shared/types/permission";


export default function UsersNewPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/usuarios");
  };

  return (
    <PermissionGuard requiredPermissions={[Permission.GESTAO_GERENCIAR_USUARIOS]}>
      <div className="space-y-6">
        <PageHeader title="Novo Usuário" />
        <Breadcrumb
          items={[
            { label: "Usuários", href: "/usuarios" },
            { label: "Novo Usuário" },
          ]}
        />
        <Card>
          <UserForm onSuccess={handleSuccess} />
        </Card>
      </div>
    </PermissionGuard>
  );
}
