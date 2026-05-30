"use client";

import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Card } from "@/components/ui/Card";
import { InfoField } from "@/components/ui/InfoField";
import { InputsGrid } from "@/components/ui/InputsGrid";
import { useRoleProfileDetails } from "../_hooks/useRoleProfileDetails";

interface IRoleProfileDetailsProps {
  id: string;
}

export function RoleProfileDetails({ id }: IRoleProfileDetailsProps) {
  const { data: profile, isLoading, error } = useRoleProfileDetails(id);

  if (isLoading) {
    return <LoadingState message="Carregando perfil..." />;
  }

  if (error || !profile) {
    return <ErrorState message="Não foi possível carregar o perfil." />;
  }

  return (
    <Card>
      <InputsGrid>
        <InfoField label="Nome" value={profile.name} />
        <InfoField
          label="Total de permissões"
          value={String(profile.defaultPermissions.length)}
        />
        {profile.description && (
          <InfoField label="Descrição" value={profile.description} />
        )}
      </InputsGrid>
    </Card>
  );
}
