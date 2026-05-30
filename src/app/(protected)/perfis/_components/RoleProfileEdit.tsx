"use client";

import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Card } from "@/components/ui/Card";
import { useRoleProfileDetails } from "../_hooks/useRoleProfileDetails";
import { RoleProfileUpdateForm } from "./RoleProfileUpdateForm";

interface IRoleProfileEditProps {
  id: string;
}

export function RoleProfileEdit({ id }: IRoleProfileEditProps) {
  const router = useRouter();
  const { data: profile, isLoading, error } = useRoleProfileDetails(id);

  if (isLoading) {
    return <LoadingState message="Carregando perfil..." />;
  }

  if (error || !profile) {
    return <ErrorState message="Não foi possível carregar o perfil." />;
  }

  return (
    <Card>
      <RoleProfileUpdateForm
        profile={profile}
        onSuccess={() => router.push(`/perfis/${id}`)}
        onCancel={() => router.back()}
      />
    </Card>
  );
}
