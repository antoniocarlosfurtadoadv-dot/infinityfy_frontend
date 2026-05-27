import type { HTMLAttributes } from "react";
import { CalendarDays, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate2Digit } from "@/core/utils/formatters";
import type { ICardProps } from "@/components/Card";
import {
  getPriorityBadge,
  getStatusLabel,
  getStatusTone,
  getToneClasses,
} from "@/components/Card";

export interface ICardListProps extends HTMLAttributes<HTMLDivElement> {
  items: ICardProps[];
  isLoading?: boolean;
  loadingCount?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  onItemMenuClick?: (item: ICardProps) => void;
}

function CardListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-full animate-pulse rounded-xl border border-slate-200 bg-white px-4 py-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="h-6 w-16 rounded-full bg-slate-100" />
              <div className="h-5 w-28 rounded bg-slate-100" />
            </div>
            <div className="h-8 w-8 rounded-md bg-slate-100" />
          </div>
          <div className="mt-3 border-t border-slate-100" />
          <div className="mt-3 h-5 w-48 rounded bg-slate-100" />
          <div className="mt-2 h-4 w-28 rounded bg-slate-100" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-40 rounded bg-slate-100" />
            <div className="h-4 w-36 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function formatDisplayDate(value: string | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return formatDate2Digit(date);
}

function formatRequestIdentifier(value: string | undefined): string {
  if (!value) return "-";
  return value.slice(0, 6);
}

function MobileRequestCard({
  item,
  onMenuClick,
}: {
  item: ICardProps;
  onMenuClick?: () => void;
}) {
  const { badgeLabel, badgeTone } = getPriorityBadge(item.priority);
  const statusLabel = getStatusLabel(item.status);
  const statusTone = getStatusTone(item.status);
  const requestDate = formatDisplayDate(item.createdAt);
  const deliveryDate = formatDisplayDate(item.deliveryDate);
  const petName = item.pet?.name ?? "-";
  const tutorName = item.pet?.tutor?.name;
  const speciesLabel = item.pet?.breed?.name ?? item.pet?.species?.name ?? "-";
  const showPriorityBadge = item.priority === "urgent";

  return (
    <article className="w-full flex flex-col gap-4 p-4 rounded-md border border-neutral-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2 ">
          {showPriorityBadge && (
            <span
              className={cn(
                "inline-flex rounded-full px-3 py-1 text-sm font-medium",
                getToneClasses(badgeTone),
              )}
            >
              {badgeLabel}
            </span>
          )}

          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="whitespace-nowrap text-base font-semibold text-slate-800">
              ID {formatRequestIdentifier(item.requestCode ?? item.id)}
            </h3>
            <span
              className={cn(
                "inline-flex max-w-full truncate whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium",
                getToneClasses(statusTone),
              )}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir ações da requisição"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-primary-main text-primary-main transition hover:bg-primary-main/10"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-3 border-t border-slate-100" />

      <div className="">
        <p className="text-base font-semibold text-slate-800">
          {petName}
          {tutorName ? ` - ${tutorName}` : ""}
        </p>
        <p className="text-sm text-slate-500">{speciesLabel}</p>
      </div>

      <div className="flex flex-col gap-2 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span>Solicitação: {requestDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span>Entrega: {deliveryDate}</span>
        </div>
      </div>
    </article>
  );
}

export function CardList({
  items,
  isLoading = false,
  loadingCount = 4,
  emptyTitle = "Nenhum resultado encontrado",
  emptyDescription = "Não há registros para exibir no momento.",
  onItemMenuClick,
  className,
  ...props
}: ICardListProps) {
  if (isLoading) {
    return <CardListSkeleton count={loadingCount} />;
  }

  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      {items.map((item, index) => (
        <MobileRequestCard
          key={`${item.id}-${index}`}
          item={item}
          onMenuClick={
            onItemMenuClick ? () => onItemMenuClick(item) : undefined
          }
        />
      ))}
    </div>
  );
}
