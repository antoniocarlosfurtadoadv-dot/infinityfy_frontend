"use client";

import { forwardRef, useState, type ChangeEvent } from "react";
import { Check } from "lucide-react";
import type { ChangeHandler } from "react-hook-form";
import { TermsContentModal } from "./TermsContentModal";
import type { TTermsModalType } from "../data/TermsModalContentData";

interface ITermsAcceptanceProps {
  id?: string;
  error?: string;
  name?: string;
  onBlur?: ChangeHandler;
  onChange?: ChangeHandler;
}

export const TermsAcceptance = forwardRef<
  HTMLInputElement,
  ITermsAcceptanceProps
>(({ id = "termsAcceptance", error, name, onBlur, onChange }, ref) => {
  const [isChecked, setIsChecked] = useState(false);
  const [activeModal, setActiveModal] = useState<TTermsModalType | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    onChange?.(e);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="mt-1.5 relative">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            name={name}
            className="w-6 h-6 cursor-pointer appearance-none rounded bg-white border-2 border-neutral-600 checked:bg-primary-main checked:border-primary-main transition-colors"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={handleChange}
            onBlur={onBlur}
          />
          {isChecked && (
            <Check
              size={20}
              className="absolute top-0.5 left-0.5 text-white pointer-events-none"
              strokeWidth={3}
            />
          )}
        </div>
        <label
          htmlFor={id}
          className="text-left text-sm font-normal text-neutral-800 leading-relaxed cursor-pointer flex-1"
        >
          Aceito os{" "}
          <button
            type="button"
            className="text-primary-main hover:underline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveModal("terms");
            }}
          >
            Termos de Uso
          </button>
          {" e autorizo o uso de meus dados de acordo com a "}
          <button
            type="button"
            className="text-primary-main hover:underline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveModal("privacy");
            }}
          >
            Politica de Privacidade
          </button>
        </label>
      </div>
      <TermsContentModal
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        type={activeModal ?? "terms"}
      />
    </div>
  );
});

TermsAcceptance.displayName = "TermsAcceptance";
