import type { IUser } from "@/shared/types/user";

export const STATUS_CONFIG: Record<IUser["status"], { label: string; className: string }> = {
  ACTIVE: {
    label: "Ativo",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  INACTIVE: {
    label: "Inativo",
    className: "bg-red-50 text-red-700 ring-red-600/20",
  },
  PENDING: {
    label: "Pendente",
    className: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
};

export function StatusBadge({ status }: { status: IUser["status"] }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
}
