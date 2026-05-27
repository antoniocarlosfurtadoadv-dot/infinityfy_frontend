"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface IPasswordResetSuccessModalProps {
  isOpen: boolean;
}

export function PasswordResetSuccessModal({
  isOpen,
}: IPasswordResetSuccessModalProps) {
  const router = useRouter();

  const handleEnter = () => router.push("/login");

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleEnter}
      title=""
      showCloseButton={false}
      size="sm"
      variant="sheet"
      footer={
        <Button
          variant="primary"
          className="w-full max-w-100 mx-auto mb-6"
          onClick={handleEnter}
        >
          Entrar
        </Button>
      }
    >
      <div className="relative flex flex-col items-center p-6 md:pb-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center w-14 h-14">
            <Sparkles className="w-12 h-12 text-yellow-400" />
          </div>
          <h2 className="text-xl xl:text-2xl font-bold text-neutral-900">
            Senha alterada!
          </h2>
          <p className="text-neutral-700 text-base leading-6">
            Senha alterada com sucesso. Acesse e comece a usar.
          </p>
        </div>
      </div>
    </Modal>
  );
}
