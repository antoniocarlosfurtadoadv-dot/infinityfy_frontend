import type { ReactNode } from "react";

interface IPageHeaderGroupProps {
  children: ReactNode;
}

export function PageHeaderGroup({ children }: IPageHeaderGroupProps) {
  return (
    <div className="flex flex-col p-6 gap-4 items-start border-b border-b-neutral-300 md:border-none lg:flex-row lg:items-center lg:justify-between lg:p-0">
      {children}
    </div>
  );
}
