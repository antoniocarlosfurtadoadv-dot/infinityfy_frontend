"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

// ─── Context ────────────────────────────────────────────────────────────────

interface ITabsContext {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<ITabsContext | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs sub-components must be used inside <Tabs />");
  return ctx;
}

// ─── Tabs (root) ─────────────────────────────────────────────────────────────

interface ITabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: ITabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const activeTab = value ?? internalValue;

  function setActiveTab(next: string) {
    setInternalValue(next);
    onValueChange?.(next);
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

// ─── TabsList ────────────────────────────────────────────────────────────────

interface ITabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: ITabsListProps) {
  return (
    <div className={cn(className)}>
      <nav className="py-4 px-6 flex justify-center gap-4 md:justify-start md:p-0 md:gap-0">{children}</nav>
    </div>
  );
}

// ─── TabsTrigger ─────────────────────────────────────────────────────────────

interface ITabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function TabsTrigger({
  value,
  children,
  className,
  disabled = false,
}: ITabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={cn(
        "px-4 h-10.5 w-39 md:w-18.25 border-b-2 border-b-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        isActive
          ? "border-primary-main text-neutral-950 text-base font-bold border-b-primary-main"
          : "border-transparent text-neutral-700 hover:text-neutral-950",
        className,
      )}
    >
      {children}
    </button>
  );
}

// ─── TabsContent ─────────────────────────────────────────────────────────────

interface ITabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: ITabsContentProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) return null;

  return <div className={cn(className)}>{children}</div>;
}
