"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { formatDateToYear } from "@/core/utils/formatters";
import { useProfile } from "../_hooks/useProfile";
import { ProfileAvatarModal } from "./ProfileAvatarModal";
import { Badge } from "@/components/ui/Badge";
import TextField from "@/components/ui/TextField";
import { formatPhone } from "@/core/utils/formatFields";

export function ProfileDetails() {
  const { data: profile, isLoading, error } = useProfile();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  if (isLoading) {
    return <LoadingState message="Carregando perfil..." />;
  }

  if (error || !profile) {
    return <ErrorState message="Não foi possível carregar o perfil." />;
  }

  const initials = profile.name
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <div className="bg-neutral-white w-full flex flex-col gap-6 md:bg-transparent">
        <div className="flex flex-col gap-6 md:py-6 md:px-5 md:border md:border-neutral-200 md:rounded-lg md:bg-neutral-white">
          {/* Dados pessoais */}
          <div className="flex items-center gap-4 ">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-14 w-14 rounded-full overflow-hidden bg-slate-100  shadow">
                {profile.profileImageUrl ? (
                  <Image
                    src={profile.profileImageUrl}
                    alt={profile.name}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary-main">
                    <span className="text-xl font-bold text-white">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute bottom-0 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-main text-white shadow transition hover:bg-primary-darker"
                aria-label="Editar foto"
              >
                <Pencil size={11} />
              </button>
            </div>

            {/* Badge active */}
            <div className=" w-full flex flex-col gap-1 b">
              <div className="flex gap-6">
                <h1 className="text-base font-semibold text-neutral-950">
                  {profile.name}
                </h1>
                {profile.status === "ACTIVE" && (
                  <Badge
                    showBadge={true}
                    badgeText="Ativo"
                    className="bg-badge-active-bg text-badge-active-text"
                  />
                )}
              </div>
              <p className="text-sm text-neutral-700">
                {profile.roleProfile?.name}
              </p>
            </div>
          </div>

          {/* Dados */}

        </div>

        <div className="flex flex-col w-full gap-4 md:gap-6 md:bg-neutral-white md:py-6 md:px-5 md:border md:border-neutral-200 md:rounded-lg ">
          <h2 className="text-base md:text-lg text-neutral-950 font-semibold">
            Informações Pessoais
          </h2>

          <div className="hidden md:block w-full h-px bg-[#EBEDF0] rounded-full"></div>

          <div className="flex flex-col gap-6 md:flex-row md:px-4 md:justify-between">
            {/* Personal info fields */}
            <TextField label="CPF" value={profile.cpf ?? "Não informado"} />
            <TextField label="Nome Completo" value={profile.name} />
            <TextField
              label="Telefone"
              value={formatPhone(profile.phone) ?? "Não informado"}
            />
          </div>
        </div>

        <div className="block md:hidden w-full h-px bg-[#EBEDF0] rounded-full"></div>

        <div className="flex flex-col w-full gap-4 md:gap-6 md:bg-neutral-white md:py-6 md:px-5 md:border md:border-neutral-200 md:rounded-lg ">
          <h2 className="text-base md:text-lg text-neutral-950 font-semibold">
            Informações Profissionais
          </h2>

          <div className="hidden md:block w-full h-px bg-[#EBEDF0] rounded-full"></div>


        </div>
      </div>

      <ProfileAvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        name={profile.name}
        imageUrl={profile.profileImageUrl}
      />
    </>
  );
}
