"use client";

import { useState } from "react";
import Link from "next/link";
import { EllipsisVertical, Pencil, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { UserService } from "../_services/user.service";
import { useUserDetails } from "../_hooks/useUserDetails";
import { useAppToast } from "@/core/hooks/useToast";
import { extractErrorMessage } from "@/core/api/error-extractor";

interface IUserActionsDropdownProps {
  id: string;
}

export function UserActionsDropdown({ id }: IUserActionsDropdownProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = useUserDetails(id);
  const toast = useAppToast();

  const handleResendFirstAccess = async () => {
    setIsLoading(true);
    try {
      await UserService.resendFirstAccess(id);
      toast.success("Link de primeiro acesso reenviado com sucesso.");
      setIsConfirmOpen(false);
    } catch (error) {
      const message =
        extractErrorMessage(error) ??
        "Erro ao reenviar o link de primeiro acesso.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" aria-label="Ações">
            <EllipsisVertical className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link
              href={`/usuarios/${id}/edit`}
              className="flex items-center gap-2"
            >
              <Pencil className="size-4" />
              Editar
            </Link>
          </DropdownMenuItem>
          {user?.status === "PENDING" && (
            <DropdownMenuItem
              onClick={() => setIsConfirmOpen(true)}
              className="flex items-center gap-2"
            >
              <Send className="size-4" />
              Reenviar link de primeiro acesso
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {user?.status === "PENDING" && (
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleResendFirstAccess}
          title="Reenviar link de primeiro acesso"
          message={
            <>
              O link de primeiro acesso será reenviado para o e-mail{" "}
              <strong>{user?.email}</strong>. Deseja continuar?
            </>
          }
          confirmText="Reenviar"
          cancelText="Cancelar"
          variant="info"
          isLoading={isLoading}
        />
      )}
    </>
  );
}
