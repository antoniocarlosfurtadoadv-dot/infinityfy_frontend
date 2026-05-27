import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate2Digit } from "@/core/utils/formatters";

export type CardTone = "success" | "warning" | "danger" | "neutral" | "info";

export type RequestStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
export type RequestPriority = "normal" | "urgent";

export interface ICardUIProps {
  onMenuClick?: () => void;
  menuAriaLabel?: string;
  className?: string;
  menuIcon?: ReactNode;
}

export interface ICardProps extends ICardUIProps {
  id: string;
  requestCode?: string;
  status: RequestStatus;
  priority: RequestPriority;
  pet?: { name: string; breed?: { name: string }; tutor?: { name: string }; species?: { name: string } };
  createdAt?: string;
  deliveryDate?: string;
}

const STATUS_LABEL_MAP: Record<RequestStatus, string> = {
  DRAFT: "Rascunho",
  PENDING: "Pendente",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
};

const STATUS_TONE_MAP: Record<RequestStatus, CardTone> = {
  DRAFT: "neutral",
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

const PRIORITY_BADGE_MAP: Record<
  RequestPriority,
  { badgeLabel: string; badgeTone: CardTone }
> = {
  normal: { badgeLabel: "Normal", badgeTone: "neutral" },
  urgent: { badgeLabel: "Urgente", badgeTone: "danger" },
};

export function getStatusLabel(status: RequestStatus): string {
  return STATUS_LABEL_MAP[status] ?? status;
}

export function getStatusTone(status: RequestStatus): CardTone {
  return STATUS_TONE_MAP[status] ?? "neutral";
}

export function getPriorityBadge(priority: RequestPriority) {
  return PRIORITY_BADGE_MAP[priority] ?? { badgeLabel: "Normal", badgeTone: "neutral" as CardTone };
}

const toneStyles: Record<CardTone, string> = {
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  neutral: "bg-slate-100 text-slate-600",
  info: "bg-sky-100 text-sky-700",
};

function getToneClasses(tone: CardTone = "neutral") {
  return toneStyles[tone] ?? toneStyles.neutral;
}

export { getToneClasses };

function formatDisplayDate(value: string | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return formatDate2Digit(date);
}

export function Card({
  onMenuClick,
  menuAriaLabel = "Abrir ações da requisição",
  className,
  menuIcon,
  ...request
}: ICardProps) {
  const MenuIcon = menuIcon ?? <MoreHorizontal className="h-5 w-5" />;
  const isDraft = request.status === "DRAFT";
  const statusLabel = getStatusLabel(request.status);
  const statusTone = getStatusTone(request.status);
  const { badgeLabel, badgeTone } = getPriorityBadge(request.priority);
  const petName = request.pet?.name ?? "-";
  const petBreed = request.pet?.breed?.name;
  const requestDate = formatDisplayDate(request.createdAt);
  const deliveryDate = formatDisplayDate(request.deliveryDate);

  return (
    <article
      className={cn(
        "relative w-full max-w-122.25 rounded-xl border border-slate-200 bg-white p-4 md:w-full 2xl:max-w-none",
        className,
      )}
    >
      <div className="mb-3">
        <span
          className={cn(
            "inline-flex rounded-full px-3 py-1 text-sm font-medium",
            getToneClasses(badgeTone),
          )}
        >
          {badgeLabel}
        </span>
      </div>

      <button
        type="button"
        onClick={onMenuClick}
        aria-label={menuAriaLabel}
        className="absolute right-4 top-4 rounded-md border border-primary-main p-1 text-primary-main transition hover:bg-primary-main/10"
      >
        {MenuIcon}
      </button>

      <div className="flex items-center border-b border-slate-100 pb-3 pr-14">
        <div className="grid min-w-0 grid-cols-[auto_1fr] items-center gap-2">
          <h3 className="whitespace-nowrap text-lg font-bold text-slate-800">
            {request.requestCode ?? request.id}
          </h3>
          <span
            className={cn(
              "block max-w-full truncate whitespace-nowrap rounded-lg px-2 py-1 text-xs font-medium",
              getToneClasses(statusTone),
            )}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="space-y-1 pt-1">
        <p className="text-lg font-semibold text-slate-800">{petName}</p>
        {petBreed && <p className="text-sm text-slate-500">{petBreed}</p>}
      </div>

      <div className="space-y-2 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>Solicitação: {requestDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>Entrega: {deliveryDate}</span>
        </div>
      </div>

      {isDraft && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <Link
            href={`/requisicoes/new?resumeId=${request.id}`}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary-main px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-darker"
          >
            Continuar rascunho
          </Link>
        </div>
      )}
    </article>
  );
}
