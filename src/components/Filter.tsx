"use client";

import type { ReactNode } from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ChevronDown, Check, SlidersHorizontal, Search } from "lucide-react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

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
        <ChevronDown
          className={`ml-2 h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
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
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    isSelected
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
  desktopFields?: IFilterField[];
  mobileFields?: IFilterField[];
  desktopSearchPlaceholder?: string;
  onSubmit?: (values: Record<string, string>) => void;
}

export function Filter({
  fields,
  desktopFields: desktopFieldsProp,
  mobileFields: mobileFieldsProp,
  desktopSearchPlaceholder,
  onSubmit,
}: IFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const desktopFields = desktopFieldsProp ?? fields;
  const mobileFields = mobileFieldsProp ?? fields;

  const allFieldNames = Array.from(
    new Set(
      [
        ...fields,
        ...desktopFields,
        ...(mobileFieldsProp ? mobileFieldsProp : []),
      ].map((field) => field.name),
    ),
  );

  // Initialize state from URL params
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initialValues: Record<string, string> = {};
    allFieldNames.forEach((fieldName) => {
      initialValues[fieldName] = searchParams.get(fieldName) ?? "";
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
    allFieldNames.forEach((fieldName) => {
      clearedValues[fieldName] = "";
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

  const searchField = fields.find((f) => f.name === "search");
  const searchPlaceholder =
    searchField?.placeholder ?? "Requisições, pacientes...";

  const desktopSearchLabel =
    desktopSearchPlaceholder ?? "Buscar por requisição, paciente...";

  const renderFieldControl = (field: IFilterField) => {
    if (field.type === "select") {
      return (
        <select
          value={values[field.name]}
          onChange={(e) => handleChange(field.name, e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
      );
    }

    if (field.type === "multiselect") {
      return (
        <MultiSelect
          value={values[field.name] ?? ""}
          options={field.options?.filter((o) => o.value !== "") ?? []}
          placeholder={field.placeholder}
          onChange={(value) => handleChange(field.name, value)}
        />
      );
    }

    if (field.type === "custom" && field.renderCustom) {
      return field.renderCustom({
        value: values[field.name] ?? "",
        onChange: (value) => handleChange(field.name, value),
      });
    }

    return (
      <input
        type={field.type ?? "text"}
        placeholder={field.placeholder}
        value={values[field.name]}
        onChange={(e) => handleChange(field.name, e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
    );
  };

  return (
    <div className=" bg-white overflow-hidden border-b border-neutral-300 md:border-none lg:bg-transparent">
      {/* Mobile: compact search input with filter button (mobile only) */}
      <div className="px-4 py-4 lg:hidden">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <Input
            type="text"
            aria-label="Buscar requisições"
            placeholder={searchPlaceholder}
            value={values["search"]}
            onChange={(e) => handleChange("search", e.target.value)}
            leftIcon={<Search size={22} />}
            inputSize="sm"
            className="h-auto border-0 bg-transparent text-sm shadow-none focus:border-0 focus:shadow-none focus:ring-0"
          />
          <button
            type="button"
            onClick={() => setMobileModalOpen(true)}
            aria-label="Abrir filtros"
            className="relative flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-5 w-5" />
            {hasActiveFilters && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                {Object.values(values).filter((v) => v !== "").length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="hidden lg:block rounded-lg border border-neutral-200 bg-white p-6 ">
        <div className="flex gap-4 items-end justify-between w-full">
          <div className="lg:w-100  xl:w-102 ">
            <Input
              type="text"
              aria-label="Buscar por requisição, paciente"
              placeholder={desktopSearchLabel}
              value={values.search}
              onChange={(e) => handleChange("search", e.target.value)}
              leftIcon={<Search size={22} />}
              inputSize="md"
              className="h-11 w-full xl:w-[415px] border-slate-300 bg-white text-sm shadow-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex flex-row items-end gap-4 xl:flex-wrap">
            {desktopFields.map((field) => (
              <div key={field.name} className=" w-full xl:w-52">
                {field.label && (
                  <label className="mb-2 block text-sm font-semibold text-slate-900">
                    {field.label}
                  </label>
                )}
                {renderFieldControl(field)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: filters in bottom sheet modal */}
      <Modal
        isOpen={mobileModalOpen}
        onClose={() => setMobileModalOpen(false)}
        title=""
        variant="sheet"
        size="md"
        showCloseButton={false}
        contentClassName="p-4"
        bodyClassName="w-full"
      >
        <div className="w-full mt-2">
          <div className="mb-4">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-feedback-purple-main text-white">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>

                <h3 className="text-base font-semibold text-slate-950">
                  Filtros
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setMobileModalOpen(false)}
                aria-label="Fechar filtros"
                className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-950 hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {mobileFieldsProp ? (
            <div className="flex flex-col gap-4">
              {mobileFields.map((field) => (
                <div key={field.name} className="w-full">
                  {field.label && (
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      {field.label}
                    </label>
                  )}

                  {renderFieldControl(field)}
                </div>
              ))}

              <Button
                type="button"
                className="w-full mt-4"
                onClick={() => setMobileModalOpen(false)}
              >
                Filtrar
              </Button>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setMobileModalOpen(false)}
                  className="mt-3 text-sm font-semibold text-slate-900"
                >
                  Voltar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {fields.map((field) => (
                <div key={field.name}>
                  {field.label && (
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      {field.label}
                    </label>
                  )}

                  {renderFieldControl(field)}
                </div>
              ))}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Limpar filtros"
                  className="flex p-1 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
