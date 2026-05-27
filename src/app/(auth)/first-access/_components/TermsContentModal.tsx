"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ShieldCheckIcon, LockKeyholeIcon } from "lucide-react";
import {
  TERMS_MODAL_TEXT_CONTENT,
  type TTermsModalType,
} from "../data/TermsModalContentData";

interface ITermsContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TTermsModalType;
}

const MODAL_CONTENT: Record<TTermsModalType, { icon: React.ReactNode }> = {
  terms: {
    icon: (
      <ShieldCheckIcon
        className="w-13 h-13 text-primary-main"
        strokeWidth={1.5}
      />
    ),
  },
  privacy: {
    icon: (
      <LockKeyholeIcon
        className="w-13 h-13 text-primary-main"
        strokeWidth={1.5}
      />
    ),
  },
};

export function TermsContentModal({
  isOpen,
  onClose,
  type,
}: ITermsContentModalProps) {
  const content = TERMS_MODAL_TEXT_CONTENT[type];
  const modalVisual = MODAL_CONTENT[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      variant="sheet"
      size="lg"
      showCloseButton={false}
      contentClassName="flex flex-col h-8/11 md:max-h-[90vh] overflow-hidden"
      bodyClassName="flex flex-col flex-1 overflow-hidden p-0"
      footerClassName="border-t-0 md:bg-primary-light px-6 py-4"
      footer={
        <Button variant="default" className="w-full md:py-6" onClick={onClose}>
          Fechar
        </Button>
      }
    >
      <div className="flex h-full flex-col overflow-hidden">
  
        <div className="w-full px-6 py-8 flex flex-col items-center gap-6 md:bg-primary-light">
          {modalVisual.icon}
          <h3 className="text-2xl font-semibold text-center text-neutral-900">
            {content.title}
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 text-justify text-neutral-700 custom-scroll">
          {content.sectionText}
        </div>
      </div>
    </Modal>
  );
}
