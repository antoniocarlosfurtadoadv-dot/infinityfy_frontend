"use client";

import { Filter } from "@/components/Filter";
import { useRoleProfileList } from "@/app/(protected)/perfis/_hooks/useRoleProfileList";

export function UsersFilter() {
  const { data: profilesData } = useRoleProfileList({ limit: 100 });

  const profileOptions = [
    ...(profilesData?.data ?? []).map((p) => ({
      value: p.id,
      label: p.name,
    })),
  ];

  return (
    <Filter
      showNameFilter
      fields={[
        {
          name: "roleProfileId",
          label: "Perfil de Acesso",
          type: "select",
          options: profileOptions,
        },

        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "ACTIVE", label: "Ativo" },
            { value: "INACTIVE", label: "Inativo" },
            { value: "PENDING", label: "Pendente" },
          ],
        }
      ]}
    />
  );
}
