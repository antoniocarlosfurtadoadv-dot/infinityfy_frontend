"use client";

import { useSearchParams } from "next/navigation";
import { usePersistedFilters } from "@/core/hooks/usePersistedFilters";
import { SkeletonList } from "@/components/LoadingState";
import { Button } from "@/components/ui/Button";
import { Paginate } from "@/components/Pagination";
import { formatDate } from "@/core/utils/formatters";
import type { INotification } from "@/shared/types/notification";
import type { INotificationListParams } from "../_services/notification.service";
import { useNotificationList } from "../_hooks/useNotificationList";
import {
  TableContainer,
  TableScrollArea,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
  TableEmpty,
} from "@/components/ui/Table";

const FILTER_KEYS = ["type", "read"];

const TYPE_LABELS: Record<INotification["type"], string> = {
  INFO: "Informação",
  SUCCESS: "Sucesso",
  WARNING: "Aviso",
  ERROR: "Erro",
};

const TYPE_COLORS: Record<INotification["type"], string> = {
  INFO: "bg-blue-100 text-blue-700",
  SUCCESS: "bg-green-100 text-green-700",
  WARNING: "bg-yellow-100 text-yellow-700",
  ERROR: "bg-red-100 text-red-700",
};

export function NotificationsList() {
  const searchParams = useSearchParams();
  usePersistedFilters("notifications-filters", FILTER_KEYS);

  const filters: INotificationListParams = {
    type: (searchParams.get("type") as INotification["type"]) || undefined,
    read:
      searchParams.get("read") !== null
        ? searchParams.get("read") === "true"
        : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
  };

  const { data, isLoading, error, refetch } = useNotificationList(filters);
  const notifications = data?.data ?? [];

  if (isLoading) {
    return <SkeletonList count={6} />;
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-500">Erro ao carregar notificações.</p>
        <Button onClick={() => void refetch()}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TableContainer>
        {/* Desktop table */}
        <TableScrollArea className="hidden md:block">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Título</TableHeadCell>
                <TableHeadCell>Mensagem</TableHeadCell>
                <TableHeadCell>Tipo</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Data</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.length === 0 ? (
                <TableEmpty colSpan={5} message="Nenhuma notificação encontrada." />
              ) : (
                notifications.map((notification) => (
                  <TableRow key={notification.id} hoverable>
                    <TableCell>
                      <span className="text-sm font-medium text-slate-900">
                        {notification.title}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="max-w-xs truncate text-sm text-slate-600">
                        {notification.message}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[notification.type]}`}
                      >
                        {TYPE_LABELS[notification.type]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${notification.read ? "bg-slate-100 text-slate-500" : "bg-indigo-100 text-indigo-700"}`}
                      >
                        {notification.read ? "Lida" : "Não lida"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-500">
                        {formatDate(notification.createdAt)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableScrollArea>

        {/* Mobile list */}
        <ul className="divide-y divide-slate-100 md:hidden">
          {notifications.length === 0 ? (
            <li className="py-8 text-center text-sm text-slate-500">
              Nenhuma notificação encontrada.
            </li>
          ) : (
            notifications.map((notification) => (
              <li key={notification.id} className="flex items-start gap-3 px-4 py-4">
                <div className="mt-0.5 shrink-0">
                  <span
                    className={`inline-flex h-2 w-2 rounded-full ${notification.read ? "bg-slate-300" : "bg-indigo-500"}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {notification.title}
                    </p>
                    <span
                      className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[notification.type]}`}
                    >
                      {TYPE_LABELS[notification.type]}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </TableContainer>

      <Paginate
        perPage={data ? Math.ceil(data.total / data.limit) : undefined}
        onPageChange={(page) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", String(page));
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.pushState({}, "", newUrl);
          void refetch();
        }}
        totalRegisters={data?.total}
        currentPage={data?.currentPage}
        register={data?.data.length}
        registersPrePage={data?.limit}
        itemLabel="notificações"
      />
    </div>
  );
}
