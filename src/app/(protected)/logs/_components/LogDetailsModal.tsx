"use client";

import clsx from "clsx";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/core/utils/formatters";
import type { ILogEntry } from "@/shared/types/log-entry";

interface ILogDetailsModalProps {
  log: ILogEntry | null;
  onClose: () => void;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="text-sm text-slate-900 break-all">{value}</span>
    </div>
  );
}

function EntityBadge({ entity }: { entity: string }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        entity === "USER"
          ? "bg-blue-100 text-blue-800"
          : entity === "TEAM"
            ? "bg-green-100 text-green-800"
            : entity === "TASK"
              ? "bg-purple-100 text-purple-800"
              : "bg-slate-100 text-slate-800"
      )}
    >
      {entity}
    </span>
  );
}

export function LogDetailsModal({ log, onClose }: ILogDetailsModalProps) {
  return (
    <Modal
      isOpen={!!log}
      onClose={onClose}
      title="Detalhes do Log"
      size="lg"
      variant="sheet"
      contentClassName="px-6 pt-2 pb-2 md:p-6 md:gap-4"
      bodyClassName="items-start"
      footer={
        <Button variant="secondary" className="w-full md:w-auto" onClick={onClose}>
          Fechar
        </Button>
      }
    >
      {log && (
        <div className="w-full space-y-6 mt-2 pb-4 md:pb-0">
          {/* Main info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <Field label="Ação" value={log.action} />
            <Field
              label="Entidade"
              value={<EntityBadge entity={log.entity} />}
            />
            <Field label="Usuário" value={log.user?.name ?? "Sistema"} />
            <Field label="Criado em" value={formatDate(log.createdAt) ?? "—"} />
            <Field label="ID da Empresa" value={log.companyId} />
            <Field label="ID do Log" value={log.id} />
          </div>

          {/* Metadata */}
          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Metadados
              </span>
              <pre className="w-full rounded-xl bg-slate-50 border border-slate-100 p-4 text-xs text-slate-600 overflow-auto max-h-52 whitespace-pre-wrap break-all leading-relaxed">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
