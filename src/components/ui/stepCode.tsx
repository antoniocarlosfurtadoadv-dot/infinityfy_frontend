"use client";

import { cn } from "@/lib/utils";
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import { useRef, useState } from "react";

type StepCodeProps = {
  variant?: "default";
  isError?: boolean;
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type" | "inputMode" | "maxLength"
>;

const variantClasses = {
  default: {
    base: "w-12.5 h-12.5 rounded-lg border border-neutral-300 bg-neutral-white text-center text-lg font-semibold text-neutral-900 placeholder:text-neutral-300 transition-colors",
    interaction:
      "hover:bg-neutral-100 focus:border-[#F3B61F] focus:shadow-[0_0_0_3px_rgba(243,182,31,0.16)] focus:outline-none",
    disabled:
      "disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:border-neutral-300",
    invalid:
      "invalid:border-feedback-error-main! invalid:text-feedback-error-main invalid:focus:border-feedback-error-main! invalid:focus:shadow-[0_0_0_3px_rgba(204,31,31,0.16)]!",
    ariaInvalid:
      "aria-[invalid='true']:border-feedback-error-main! aria-[invalid='true']:text-feedback-error-main aria-[invalid='true']:focus:border-feedback-error-main! aria-[invalid='true']:focus:shadow-[0_0_0_3px_rgba(204,31,31,0.16)]!",
  },
} as const;

const variants = {
  default: `${variantClasses.default.base} ${variantClasses.default.interaction} ${variantClasses.default.disabled} ${variantClasses.default.invalid} ${variantClasses.default.ariaInvalid}`,
} as const;

function normalizeCode(value: string, length: number) {
  return value.replace(/\D/g, "").slice(0, length);
}

function replaceCodeSegment(
  digits: string[],
  startIndex: number,
  nextValue: string,
  length: number,
) {
  const nextDigits = [...digits];

  normalizeCode(nextValue, length)
    .split("")
    .forEach((digit, offset) => {
      const digitIndex = startIndex + offset;

      if (digitIndex < length) {
        nextDigits[digitIndex] = digit;
      }
    });

  return nextDigits;
}

const StepCode = ({
  variant = "default",
  isError = false,
  length = 4,
  value,
  className,
  onChange,
  onKeyDown,
  onBlur,
  name,
  required,
  disabled,
  autoComplete,
  id,
  ...props
}: StepCodeProps) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [internalValue, setInternalValue] = useState("");

  // Support both controlled usage (React Hook Form Controller) and local fallback state.
  const code = normalizeCode(value ?? internalValue, length);
  const digits = Array.from({ length }, (_, index) => code[index] ?? "");

  const focusInput = (index: number) => {
    inputs.current[Math.min(Math.max(index, 0), length - 1)]?.focus();
  };

  const updateCode = (nextValue: string) => {
    const normalizedValue = normalizeCode(nextValue, length);

    if (value === undefined) {
      setInternalValue(normalizedValue);
    }

    onChange?.(normalizedValue);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const typedValue = normalizeCode(e.target.value, length);

    if (!typedValue) {
      const nextDigits = [...digits];
      nextDigits[index] = "";
      updateCode(nextDigits.join(""));
      return;
    }

    const nextDigits = replaceCodeSegment(digits, index, typedValue, length);
    updateCode(nextDigits.join(""));
    focusInput(index + typedValue.length);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();

    const pastedValue = normalizeCode(e.clipboardData.getData("text"), length);
    if (!pastedValue) {
      return;
    }

    const nextDigits = replaceCodeSegment(digits, index, pastedValue, length);
    updateCode(nextDigits.join(""));
    focusInput(index + pastedValue.length);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key !== "Backspace") {
      onKeyDown?.(e);
      return;
    }

    const nextDigits = [...digits];

    if (digits[index]) {
      nextDigits[index] = "";
      updateCode(nextDigits.join(""));
      return;
    }

    if (index > 0) {
      nextDigits[index - 1] = "";
      updateCode(nextDigits.join(""));
      focusInput(index - 1);
    }
  };

  return (
    <div className="flex justify-center gap-4">
      <input
        type="hidden"
        name={name}
        value={code}
        required={required}
        readOnly
      />

      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          {...props}
          type="text"
          aria-invalid={props["aria-invalid"] ?? isError}
          inputMode="numeric"
          maxLength={1}
          className={cn(variants[variant], className)}
          placeholder="-"
          value={digits[index]}
          disabled={disabled}
          autoComplete={autoComplete}
          id={index === 0 ? id : undefined}
          ref={(el) => {
            inputs.current[index] = el;
          }}
          onChange={(e) => handleChange(e, index)}
          onPaste={(e) => handlePaste(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onBlur={onBlur}
        />
      ))}
    </div>
  );
};

export default StepCode;
