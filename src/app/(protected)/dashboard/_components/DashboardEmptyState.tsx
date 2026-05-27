"use client";

import { Card } from "@/components/ui/Card";
import { Inbox } from "lucide-react";

interface IDashboardEmptyStateProps {
  title?: string;
  description?: string;
  showIcon?: boolean;
}

export function DashboardEmptyState({
  title = "Nenhuma requisição encontrada",
  description = "Tente ajustar o período ou os filtros",
  showIcon = true,
}: IDashboardEmptyStateProps) {
  return (
    <Card className="rounded-xl border-slate-200 text-center py-8">
      {showIcon && (
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-slate-100 p-3">
            <Inbox className="h-6 w-6 text-slate-400" />
          </div>
        </div>
      )}
      <p className="text-sm font-medium text-slate-700">{title}</p>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </Card>
  );
}
