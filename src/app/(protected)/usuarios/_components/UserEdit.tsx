"use client";

import { useRouter } from "next/navigation";

import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Card } from "@/components/ui/Card";
import { UserUpdateForm } from "./UserUpdateForm";
import { useUserDetails } from "../_hooks/useUserDetails";
import { useRoleProfileList } from "../../perfis/_hooks/useRoleProfileList";
import type { IRoleProfile } from "@/shared/types/role-profile";

interface IUserEditProps {
  id: string;
}

export function UserEdit({ id }: IUserEditProps) {
  const router = useRouter();
  const { data: user, isLoading: isLoadingUser, error } = useUserDetails(id);
  const { data: roleProfilesData, isLoading: isLoadingRoleProfiles } = useRoleProfileList({ limit: 100 });

  const isLoading = isLoadingUser || isLoadingRoleProfiles;

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !user) {
    return <ErrorState message="Não foi possível carregar os dados do usuário." />;
  }

  const roleProfiles: IRoleProfile[] = roleProfilesData?.data ?? [];

  const roleProfileOptions = [
    { value: "", label: "Selecione..." },
    ...roleProfiles.map((rp) => ({ value: rp.id, label: rp.name })),
  ];

  return (
    <div className="space-y-6">
      <Card>
        <UserUpdateForm
          user={user}
          roleProfiles={roleProfiles}
          roleProfileOptions={roleProfileOptions}
          onSuccess={() => router.push(`/usuarios/${id}`)}
          onCancel={() => router.back()}
        />
      </Card>
    </div>
  );
}
