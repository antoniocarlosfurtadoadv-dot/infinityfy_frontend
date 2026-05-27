"use client";

import { useState, useRef, useEffect, useId } from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";
import clsx from "clsx";

export interface IAutocompleteOption {
  value: string;
  label: string;
}

export interface IAutocompleteMultipleSelectProps {
  label?: string;
  placeholder?: string;
  options: IAutocompleteOption[];
  value: string[];
  onChange: (values: string[]) => void;
  error?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export function AutocompleteMultipleSelect({
  label,
  placeholder = "Buscar...",
  options,
  value,
  onChange,
  error,
  isLoading = false,
  disabled = false,
}: IAutocompleteMultipleSelectProps) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = query.trim()
    ? options.filter((o) =>
      o.label.toLowerCase().includes(query.toLowerCase()),
    )
    : options;

  const selectedOptions = options.filter((o) => value.includes(o.value));

  const toggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const remove = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  const handleInputFocus = () => {
    if (!disabled) setIsOpen(true);
  };

  const handleTriggerClick = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className="flex w-full flex-col gap-1.5" ref={containerRef}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-neutral-950">
          {label}
        </label>
      )}

      {/* Trigger */}
      <div
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-listbox`}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={handleTriggerClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleTriggerClick();
          }
          if (e.key === "Escape") {
            setIsOpen(false);
            setQuery("");
          }
        }}
        className={clsx(
          "flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-sm border bg-white px-3 py-2 text-left transition select-none",
          disabled && "cursor-not-allowed bg-slate-50 text-slate-500",
          error
            ? "border-feedback-error-main focus:border-feedback-error-main"
            : "border-neutral-300 hover:bg-neutral-100 focus:border-primary-main focus:shadow-primary-main/16 focus:shadow-[0px_0px_0px_3px] focus:outline-none",
        )}
      >
        <div className="flex flex-1 flex-wrap gap-1.5">
          {selectedOptions.length === 0 ? (
            <span className="text-sm text-neutral-400">
              {isLoading ? "Carregando..." : "Nenhum selecionado"}
            </span>
          ) : (
            selectedOptions.map((opt) => (
              <span
                key={opt.value}
                className="inline-flex items-center gap-1 rounded-full bg-primary-main/10 px-2.5 py-0.5 text-xs font-medium text-primary-main"
              >
                {opt.label}
                <button
                  type="button"
                  aria-label={`Remover ${opt.label}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(opt.value);
                  }}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-primary-main/20 focus:outline-none"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))
          )}
        </div>
        <ChevronsUpDown className="size-4 shrink-0 text-neutral-400" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="relative z-50">
          <div className="absolute top-1 left-0 right-0 rounded-sm border border-neutral-200 bg-white shadow-lg">
            {/* Search input */}
            <div className="border-b border-neutral-100 p-2">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleInputFocus}
                placeholder={placeholder}
                className="w-full rounded-sm border border-neutral-200 px-3 py-1.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-main focus:outline-none"
              />
            </div>

            {/* Options list */}
            <ul
              id={`${id}-listbox`}
              role="listbox"
              aria-multiselectable="true"
              className="max-h-52 overflow-y-auto py-1"
            >
              {isLoading ? (
                <li className="px-3 py-2 text-sm text-neutral-400">Carregando...</li>
              ) : filtered.length === 0 ? (
                <li className="px-3 py-2 text-sm text-neutral-400">Nenhum resultado encontrado.</li>
              ) : (
                filtered.map((opt) => {
                  const isSelected = value.includes(opt.value);
                  return (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => toggle(opt.value)}
                      className={clsx(
                        "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors",
                        isSelected
                          ? "bg-primary-main/5 font-medium text-primary-main"
                          : "text-neutral-700 hover:bg-neutral-50",
                      )}
                    >
                      <span
                        className={clsx(
                          "flex size-4 shrink-0 items-center justify-center rounded border",
                          isSelected
                            ? "border-primary-main bg-primary-main text-white"
                            : "border-neutral-300 bg-white",
                        )}
                      >
                        {isSelected && <Check className="size-3" />}
                      </span>
                      {opt.label}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      )}

      {error && <span className="text-xs text-feedback-error-main">{error}</span>}
    </div>
  );
}
