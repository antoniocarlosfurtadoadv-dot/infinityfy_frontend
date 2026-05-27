"use client";

import { useState } from "react";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { useMe } from "../_hooks/useMe";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { LockKeyholeIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AccountTab() {
  const { data: user, isLoading, error } = useMe();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  if (isLoading) {
    return <LoadingState message="Carregando conta..." />;
  }

  if (error || !user) {
    return <ErrorState message="Não foi possível carregar os dados da conta." />;
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Conta</h2>
          <LockKeyholeIcon
            width={20}
            height={20}
            className="text-neutral-500"
          />
        </div>

        <div className="flex flex-col items-start">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-slate-500 tracking-wide">
              E-mail
            </p>
            <p className="text-sm text-slate-900">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="text-sm font-normal text-primary-main underline underline-offset-4 hover:text-slate-900 transition-colors mt-2"
          >
            Alterar a senha
          </button>
        </div>
      </div>

      <div className="block md:hidden w-full h-px bg-[#EBEDF0] rounded-full"></div>

      <Button variant="default" className="destructive w-fit p-0">Excluir conta</Button>

      <ChangePasswordForm
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        email={user.email}
      />
    </div>
  );
}
