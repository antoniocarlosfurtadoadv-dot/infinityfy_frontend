"use client";

import { SparklesIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface IAccountCreatedModalProps {
  isOpen: boolean;
}

export function AccountCreatedModal({ isOpen }: IAccountCreatedModalProps) {
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
      contentClassName="md:p-6 md:gap-12"
      footer={
        <Button variant="primary" className="w-full" onClick={handleEnter}>
          Entrar
        </Button>
      }
    >
      <div className="relative flex flex-col items-center">
        <div className="flex flex-col items-center gap-6 text-center mt-5">
          <div className="flex items-center justify-center w-14 h-14">
            <SparklesIcon className="w-12 h-12 text-yellow-400" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-semibold text-neutral-900">
              Conta criada!
            </h2>
            <p className="text-neutral-700 text-base leading-6">
              Conta criada com sucesso. Acesse e comece a usar.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
