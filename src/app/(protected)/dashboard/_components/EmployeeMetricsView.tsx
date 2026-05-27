"use client";

import type { IEmployeeMetricsResponse } from "@/shared/types/metrics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

import { formatDate } from "@/core/utils/formatters";
import { Card } from "@/components/ui/Card";

interface IEmployeeMetricsViewProps {
  data: IEmployeeMetricsResponse;
}

const COLORS = {
  primary: "#0f172a",
  secondary: "#64748b",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
};

export function EmployeeMetricsView({ data }: IEmployeeMetricsViewProps) {
  // Request Status Data
  const requestStatusData = [
    { name: "Pendentes", value: data?.requests?.pending || 0, color: COLORS.warning },
    { name: "Aprovadas", value: data?.requests?.approved || 0, color: COLORS.success },
    { name: "Rejeitadas", value: data?.requests?.rejected || 0, color: COLORS.danger },
  ];

  // Request Priority Data
  const requestPriorityData = [
    { name: "Baixa", value: data?.requests?.byPriority.low || 0 },
    { name: "Média", value: data?.requests?.byPriority.medium || 0 },
    { name: "Alta", value: data?.requests?.byPriority.high || 0 },
  ];

  // Notification Type Data
  const notificationTypeData = [
    { name: "Info", value: data?.notifications?.byType.info || 0, color: COLORS.info },
    { name: "Sucesso", value: data?.notifications?.byType.success || 0, color: COLORS.success },
    { name: "Aviso", value: data?.notifications?.byType.warning || 0, color: COLORS.warning },
    { name: "Erro", value: data?.notifications?.byType.error || 0, color: COLORS.danger },
  ];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-linear-to-br from-slate-900 to-slate-700 text-white">
          <p className="text-sm text-slate-300">Total de Solicitações</p>
          <p className="text-4xl font-bold">{data?.requests?.total || 0}</p>
          <p className="text-xs text-emerald-300">{data?.requests?.approved || 0} aprovadas</p>
        </Card>

        <Card className="bg-linear-to-br from-blue-600 to-blue-400 text-white">
          <p className="text-sm text-blue-100">Total de Pets</p>
          <p className="text-4xl font-bold">{data?.overview?.totalPets || 0}</p>
        </Card>

        <Card className="bg-linear-to-br from-emerald-600 to-emerald-400 text-white">
          <p className="text-sm text-emerald-100">Total de Tutores</p>
          <p className="text-4xl font-bold">{data?.overview?.totalTutors || 0}</p>
        </Card>

        <Card className="bg-linear-to-br from-amber-600 to-amber-400 text-white">
          <p className="text-sm text-amber-100">Veterinários</p>
          <p className="text-4xl font-bold">{data?.overview?.totalVeterinarians || 0}</p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Status das Solicitações">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={requestStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {requestStatusData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Solicitações por Prioridade">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestPriorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Employee & Clinic Info */}
      <Card
        title="Informações"
        description={`Período: ${formatDate(data?.period.startDate)} - ${formatDate(data?.period.endDate)}`}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Funcionário</p>
            <p className="text-lg font-bold text-slate-900">{data?.employee?.name}</p>
            <p className="text-xs text-slate-500">{data?.employee?.role}</p>
          </div>
          {data?.clinic && (
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Clínica</p>
              <p className="text-lg font-bold text-slate-900">{data?.clinic?.name}</p>
            </div>
          )}
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Solicitações Totais</p>
            <p className="text-2xl font-bold text-slate-900">{data?.overview?.totalRequests || 0}</p>
          </div>
        </div>
      </Card>

      {/* Notifications Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Resumo de Notificações">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Total de Notificações</p>
              <p className="text-3xl font-bold text-slate-900">{data?.notifications?.total || 0}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-sm text-amber-700">Não Lidas</p>
              <p className="text-3xl font-bold text-amber-600">{data?.notifications?.unread || 0}</p>
            </div>
          </div>
        </Card>

        <Card title="Notificações por Tipo">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={notificationTypeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {notificationTypeData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
