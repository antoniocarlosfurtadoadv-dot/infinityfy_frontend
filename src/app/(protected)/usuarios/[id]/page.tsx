import { PermissionGuard } from "@/components/PermissionGuard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageHeader } from "@/components/PageHeader";
import { PageHeaderGroup } from "@/components/PageHeaderGroup";
import { UserDetails } from "../_components/UserDetails";
import { Permission } from "@/shared/types/permission";
import { UserActionsDropdown } from "../_components/UserActionsDropdown";

interface IUserRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserDetailsRoute({ params }: IUserRouteProps) {
  const { id } = await params;
  return (
    <PermissionGuard requiredPermissions={[Permission.GESTAO_GERENCIAR_USUARIOS]}>
      <div className="space-y-6">
        <PageHeaderGroup>
          <PageHeader title="Detalhes do Usuário" />
          <UserActionsDropdown id={id} />
        </PageHeaderGroup>
        <Breadcrumb
          items={[
            { label: "Usuários", href: "/usuarios" },
            { label: "Detalhes" },
          ]}
        />

        <UserDetails id={id} />
      </div>
    </PermissionGuard>
  );
}
