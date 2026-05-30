"use client";

import type { ReactNode } from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ChevronDown, Check, SlidersHorizontal, Search } from "lucide-react";

interface IFilterOption {
  value: string;
  label: string;
}

interface IFilterField {
  name: string;
  label?: string;
  placeholder?: string;
  type?: "text" | "select" | "multiselect" | "date" | "custom";
  options?: IFilterOption[];
  renderCustom?: (props: {
    value: string;
    onChange: (value: string) => void;
  }) => ReactNode;
}

function MultiSelect({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string;
  options: IFilterOption[];
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);
  const selected = value ? value.split(",") : [];

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (val: string) => {
    const current = valueRef.current ? valueRef.current.split(",") : [];
    const next = current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val];
    onChange(next.join(","));
  };

  const selectedLabels = options
    .filter((o) => selected.includes(o.value))
    .map((o) => o.label);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <span className={selectedLabels.length === 0 ? "text-slate-400" : ""}>
          {selectedLabels.length === 0
            ? (placeholder ?? "Selecione...")
            : selectedLabels.length <= 2
              ? selectedLabels.join(", ")
              : `${selectedLabels.length} selecionados`}
        </span>
        <ChevronDown className={`ml-2 h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggle(option.value)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${isSelected
                    ? "border-indigo-500 bg-indigo-500 text-white"
                    : "border-slate-300"
                    }`}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface IFilterProps {
  fields: IFilterField[];
  showNameFilter?: boolean;
  namePlaceholder?: string;
  onSubmit?: (values: Record<string, string>) => void;
}

export function Filter({ fields, showNameFilter, namePlaceholder, onSubmit }: IFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);

  // Initialize state from URL params
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initialValues: Record<string, string> = {};
    if (showNameFilter) {
      initialValues["name"] = searchParams.get("name") ?? "";
    }
    fields.forEach((field) => {
      initialValues[field.name] = searchParams.get(field.name) ?? "";
    });
    return initialValues;
  });

  const updateFilters = (filterValues: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const handleClear = () => {
    const clearedValues: Record<string, string> = {};
    if (showNameFilter) {
      clearedValues["name"] = "";
    }
    fields.forEach((field) => {
      clearedValues[field.name] = "";
    });
    setValues(clearedValues);
    if (onSubmit) {
      onSubmit(clearedValues);
    } else {
      updateFilters(clearedValues);
    }
  };

  const handleChange = (name: string, value: string) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (onSubmit) {
      onSubmit(next);
    } else {
      updateFilters(next);
    }
  };

  const hasActiveFilters = Object.values(values).some((value) => value !== "");

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-6 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          Filtros
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
              {Object.values(values).filter((v) => v !== "").length}
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 px-6 pb-6 lg:flex-row lg:items-end lg:justify-between">
            {showNameFilter && (
              <div className="w-full lg:w-64 xl:w-80 shrink-0">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Nome
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder={namePlaceholder ?? "Buscar por nome..."}
                    value={values["name"] ?? ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
              {fields.map((field) => (
                <div key={field.name} className="flex-1 min-w-50 lg:min-w-62.5">
                  {field.label && (
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      {field.label}
                    </label>
                  )}

                  {field.type === "select" ? (
                    <select
                      value={values[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                    >
                      <option value="" className="text-slate-500">
                        {field.placeholder ?? "Selecione..."}
                      </option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "multiselect" ? (
                    <MultiSelect
                      value={values[field.name] ?? ""}
                      options={field.options?.filter((o) => o.value !== "") ?? []}
                      placeholder={field.placeholder}
                      onChange={(value) => handleChange(field.name, value)}
                    />
                  ) : field.type === "custom" && field.renderCustom ? (
                    field.renderCustom({
                      value: values[field.name] ?? "",
                      onChange: (value) => handleChange(field.name, value),
                    })
                  ) : (
                    <input
                      type={field.type ?? "text"}
                      placeholder={field.placeholder}
                      value={values[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                    />
                  )}
                </div>
              ))}

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Limpar filtros"
                  className="self-end flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}