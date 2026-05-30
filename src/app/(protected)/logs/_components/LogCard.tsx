
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/core/utils/formatters";
import type { ILogEntry } from "@/shared/types/log-entry";
import clsx from "clsx";

interface ILogCardProps {
  log: ILogEntry;
}

export function LogCard({ log }: ILogCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
            {log.action}
          </h3>
        </div>
        <span
          className={clsx(
            "rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ml-3",
            log.entity === "USER"
              ? "bg-blue-100 text-blue-800"
              : log.entity === "TEAM"
                ? "bg-green-100 text-green-800"
                : log.entity === "TASK"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-slate-100 text-slate-800"
          )}
        >
          {log.entity}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-4 text-sm mt-4">
        <div>
          <dt className="font-medium text-slate-400">Usuário</dt>
          <dd className="text-slate-900">{log.user?.name || "Sistema"}</dd>
        </div>

        <div>
          <dt className="font-medium text-slate-400">Data</dt>
          <dd className="text-slate-900">{formatDate(log.createdAt)}</dd>
        </div>
      </dl>

      {log.metadata && Object.keys(log.metadata).length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <dt className="font-medium text-slate-400 text-xs mb-2">Metadados</dt>
          <dd className="text-xs text-slate-600 bg-slate-50 rounded p-2 overflow-x-auto">
            <pre>{JSON.stringify(log.metadata, null, 2)}</pre>
          </dd>
        </div>
      )}
    </Card>
  );
}
