"use client";

import { ChevronDown } from "lucide-react";

export type PeriodType = "this-week" | "this-month" | "last-30-days";

interface IPeriodFilterProps {
  value: PeriodType;
  onChange: (period: PeriodType) => void;
  compact?: boolean;
}

const PERIOD_OPTIONS: Array<{ value: PeriodType; label: string }> = [
  { value: "this-week", label: "Esta semana" },
  { value: "this-month", label: "Este mês" },
  { value: "last-30-days", label: "Últimos 30 dias" },
];

export function PeriodFilter({
  value,
  onChange,
  compact = false,
}: IPeriodFilterProps) {
  const sizeClasses = compact
    ? "px-2 py-1 text-xs "
    : "px-3 py-2 text-sm pr-8";
  const iconSize = compact ? "h-3 w-3" : "h-4 w-4";
  const iconRight = compact ? "right-1.5" : "right-2";

  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as PeriodType)}
        className={`appearance-none rounded-lg  ${sizeClasses} font-medium text-neutral-600 transition hover:border-slate-300 focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main`}
      >
        {PERIOD_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className={`pointer-events-none absolute top-1/2 ${iconRight} -translate-y-1/2 text-slate-400 ${iconSize}`}
      />
    </div>
  );
}
