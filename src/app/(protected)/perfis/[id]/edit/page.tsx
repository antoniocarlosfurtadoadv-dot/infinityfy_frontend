import { PermissionGuard } from "@/components/PermissionGuard";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { RoleProfileEdit } from "../../_components/RoleProfileEdit";
import { Permission } from "@/shared/types/permission";

interface IRoleProfileEditRouteProps {
  params: Promise<{ id: string }>;
}

export default async function RoleProfileEditRoute({
  params,
}: IRoleProfileEditRouteProps) {
  const { id } = await params;

  return (
    <PermissionGuard requiredPermissions={[Permission.GESTAO_GERENCIAR_PERFIS]}>
      <div className="space-y-6">
        <PageHeader title="Editar Perfil de Acesso" />
        <Breadcrumb
          items={[
            { label: "Perfis", href: "/perfis" },
            { label: "Editar" },
          ]}
        />
        <RoleProfileEdit id={id} />
      </div>
    </PermissionGuard>
  );
}
