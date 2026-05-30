"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import type { ILogEntry } from "@/shared/types/log-entry";
import type { ILogListParams } from "../_services/log.service";
import { useLogList } from "../_hooks/useLogList";
import { LogDetailsModal } from "./LogDetailsModal";

import { formatDate } from "@/core/utils/formatters";
import { SkeletonList } from "@/components/LoadingState";
import { Button } from "@/components/ui/Button";
import { Paginate } from "@/components/Pagination";
import {
  TableContainer,
  TableScrollArea,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
} from "@/components/ui/Table";

interface ILogsListProps {
  title?: string;
}

function EntityBadge({ entity }: { entity: string }) {
  const colorMap: Record<string, string> = {
    USER: "bg-blue-100 text-blue-800",
    TEAM: "bg-green-100 text-green-800",
    TASK: "bg-purple-100 text-purple-800",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorMap[entity] ?? "bg-slate-100 text-slate-800"
        }`}
    >
      {entity}
    </span>
  );
}

export function LogsList({ title = "Logs" }: ILogsListProps) {
  const searchParams = useSearchParams();
  const [selectedLog, setSelectedLog] = useState<ILogEntry | null>(null);

  const filters: ILogListParams = {
    entity: searchParams.get("entity") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
  };

  const { data, isLoading, error, refetch } = useLogList(filters);

  const logs = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        </div>
        <SkeletonList count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-500">Erro ao carregar logs.</p>
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
                <TableHeadCell>Ação</TableHeadCell>
                <TableHeadCell>Entidade</TableHeadCell>
                <TableHeadCell>Usuário</TableHeadCell>
                <TableHeadCell>Criado em</TableHeadCell>
                <TableHeadCell align="right">Ações</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} hoverable>
                  <TableCell>
                    <span className="text-sm font-medium text-slate-900">{log.action}</span>
                  </TableCell>
                  <TableCell>
                    <EntityBadge entity={log.entity} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{log.user?.name ?? "Sistema"}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-500">{formatDate(log.createdAt)}</span>
                  </TableCell>
                  <TableCell align="right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Ver detalhes
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableScrollArea>

        {/* Mobile list */}
        <ul className="divide-y divide-slate-100 md:hidden">
          {logs.map((log) => (
            <li key={log.id}>
              <button
                onClick={() => setSelectedLog(log)}
                className="w-full flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-slate-50 text-left"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{log.action}</p>
                  <p className="truncate text-xs text-slate-500">{log.user?.name ?? "Sistema"}</p>
                  <div className="mt-1">
                    <EntityBadge entity={log.entity} />
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </li>
          ))}
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
        itemLabel="logs"
      />

      <LogDetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}
