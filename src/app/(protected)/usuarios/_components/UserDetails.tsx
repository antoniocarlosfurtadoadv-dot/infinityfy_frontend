"use client";

import Image from "next/image";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Card } from "@/components/ui/Card";
import { InputsGrid } from "@/components/ui/InputsGrid";
import { InfoField } from "@/components/ui/InfoField";
import { formatDate, formateCPF, } from "@/core/utils/formatters";
import { useUserDetails } from "../_hooks/useUserDetails";
import { StatusBadge } from "../_utils/user-utils";
import { formatPhone } from "@/core/utils/formatFields";

interface IUserDetailsProps {
  id: string;
}

export function UserDetails({ id }: IUserDetailsProps) {
  const { data: user, isLoading, error } = useUserDetails(id);

  if (isLoading) {
    return <LoadingState message="Carregando usuário..." />;
  }

  if (error || !user) {
    return <ErrorState message="Não foi possível carregar o usuário." />;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ext = user as any;

  return (
    <Card>
      <div className="mb-6 flex items-center gap-4">
        {user.profileImageUrl ? (
          <Image
            src={user.profileImageUrl}
            alt="User"
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-xl font-semibold text-slate-600">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-xl font-semibold text-slate-900">{user.name}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      <InputsGrid>
        <InfoField label="CPF" value={ext.cpf ? formateCPF(ext.cpf) : undefined} />
        <InfoField label="Telefone / WhatsApp" value={formatPhone(ext.phone)} />
        <div>
          <dt className="text-sm font-medium text-slate-500">Status</dt>
          <dd className="mt-1"><StatusBadge status={user.status} /></dd>
        </div>
        <InfoField label="Perfil de Acesso" value={user.roleProfile?.name} />
        <InfoField label="Cadastrado em" value={formatDate(user.createdAt)} />
        {user.termsAcceptedAt && (
          <InfoField label="Termo aceito em" value={formatDate(user.termsAcceptedAt)} />
        )}
      </InputsGrid>
    </Card>
  );
}
