import { PermissionGuard } from "@/components/PermissionGuard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageHeader } from "@/components/PageHeader";
import { UserEdit } from "../../_components/UserEdit";
import { Permission } from "@/shared/types/permission";

interface IUserEditRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserEditRoute({ params }: IUserEditRouteProps) {
  const { id } = await params;
  return (
    <PermissionGuard requiredPermissions={[Permission.GESTAO_GERENCIAR_USUARIOS]}>
      <div className="space-y-6">
        <PageHeader title="Editar Usuário" />
        <Breadcrumb
          items={[
            { label: "Usuários", href: "/usuarios" },
            { label: "Editar" },
          ]}
        />

        <UserEdit id={id} />
      </div>
    </PermissionGuard>
  );
}
