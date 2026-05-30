import Link from "next/link";
import { PermissionGuard } from "@/components/PermissionGuard";
import { PageHeader } from "@/components/PageHeader";
import { PageHeaderGroup } from "@/components/PageHeaderGroup";
import { Breadcrumb } from "@/components/Breadcrumb";
import { RoleProfileDetails } from "../_components/RoleProfileDetails";
import { Permission } from "@/shared/types/permission";
import { Button } from "@/components/ui/Button";

interface IRoleProfileRouteProps {
  params: Promise<{ id: string }>;
}

export default async function RoleProfileDetailsRoute({
  params,
}: IRoleProfileRouteProps) {
  const { id } = await params;

  return (
    <PermissionGuard requiredPermissions={[Permission.GESTAO_GERENCIAR_PERFIS]}>
      <div className="space-y-6">
        <PageHeaderGroup>
          <PageHeader title="Detalhes do Perfil" />
          <Button asChild size="md">
            <Link href={`/perfis/${id}/edit`}>Editar</Link>
          </Button>
        </PageHeaderGroup>
        <Breadcrumb
          items={[
            { label: "Perfis", href: "/perfis" },
            { label: "Detalhes" },
          ]}
        />
        <RoleProfileDetails id={id} />
      </div>
    </PermissionGuard>
  );
}
