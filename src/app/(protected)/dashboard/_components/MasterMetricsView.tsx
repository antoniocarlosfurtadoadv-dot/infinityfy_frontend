"use client";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─── Mocked data ────────────────────────────────────────────────────────────

const MONTHLY_REVENUE = [
  { month: "Jan", receita: 148000, despesas: 98000 },
  { month: "Fev", receita: 124000, despesas: 89000 },
  { month: "Mar", receita: 165000, despesas: 104000 },
  { month: "Abr", receita: 198000, despesas: 121000 },
  { month: "Mai", receita: 182000, despesas: 115000 },
  { month: "Jun", receita: 229000, despesas: 138000 },
  { month: "Jul", receita: 184000, despesas: 118000 },
];

const REVENUE_BREAKDOWN = [
  { name: "Serviços", value: 60, color: "#10b981" },
  { name: "Produtos", value: 25, color: "#6366f1" },
  { name: "Assinaturas", value: 10, color: "#f59e0b" },
  { name: "Outros", value: 5, color: "#94a3b8" },
];

const TOP_ACCOUNTS = [
  { name: "Conta Operacional", revenue: "R$38k", pct: 95 },
  { name: "Conta Investimentos", revenue: "R$27k", pct: 68 },
  { name: "Conta Reserva", revenue: "R$21k", pct: 52 },
  { name: "Conta Marketing", revenue: "R$18k", pct: 45 },
  { name: "Conta Fornecedores", revenue: "R$14k", pct: 35 },
];

const EXPENSE_CATEGORIES = [
  { name: "Pessoal", pct: "42%", value: "R$49k" },
  { name: "Infraestrutura", pct: "21%", value: "R$25k" },
  { name: "Marketing", pct: "15%", value: "R$18k" },
  { name: "Fornecedores", pct: "13%", value: "R$15k" },
  { name: "Outros", pct: "9%", value: "R$11k" },
];

const ALERTS = [
  {
    variant: "danger" as const,
    title: "5 Faturas Vencidas",
    description: "Total de R$8.400 em atraso",
  },
  {
    variant: "warning" as const,
    title: "Receita 8% abaixo",
    description: "Queda vs. média dos últimos 3 meses",
  },
  {
    variant: "info" as const,
    title: "Pagamento programado",
    description: "R$12k a vencer nos próximos 3 dias",
  },
  {
    variant: "success" as const,
    title: "Meta Julho: 92%",
    description: "R$184k de R$200k · 8 dias restantes",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

interface IKpiCardProps {
  label: string;
  value: string | number;
  sub: string;
  trend: string;
  trendUp?: boolean | null;
  accent: string;
}

function KpiCard({ label, value, sub, trend, trendUp, accent }: IKpiCardProps) {
  const trendClass =
    trendUp === true
      ? "bg-emerald-50 text-emerald-700"
      : trendUp === false
        ? "bg-red-50 text-red-700"
        : "bg-slate-100 text-slate-500";

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-white p-5 shadow-xs">
      <div className={cn("absolute inset-y-0 left-0 w-1 rounded-l-xl", accent)} />
      <div className="pl-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold", trendClass)}>
            {trend}
          </span>
        </div>
        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        <p className="mt-1 text-xs text-slate-400">{sub}</p>
      </div>
    </div>
  );
}

type AlertVariant = "danger" | "warning" | "info" | "success";

const alertStyles: Record<AlertVariant, { border: string; dot: string }> = {
  danger: { border: "border-l-red-400", dot: "bg-red-400" },
  warning: { border: "border-l-amber-400", dot: "bg-amber-400" },
  info: { border: "border-l-indigo-400", dot: "bg-indigo-400" },
  success: { border: "border-l-emerald-400", dot: "bg-emerald-400" },
};

function AlertItem({
  variant,
  title,
  description,
}: {
  variant: AlertVariant;
  title: string;
  description: string;
}) {
  const s = alertStyles[variant];
  return (
    <div className={cn("flex items-start gap-3 border-l-2 py-2 pl-3", s.border)}>
      <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", s.dot)} />
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
      {children}
    </p>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-semibold text-slate-500">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => (
        <p key={p.name} className="text-xs" style={{ color: p.fill }}>
          {p.name === "receita"
            ? `Receita: R$${(p.value / 1000).toFixed(0)}k`
            : `Despesas: R$${(p.value / 1000).toFixed(0)}k`}
        </p>
      ))}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function MasterMetricsView() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Painel Financeiro</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Visão estratégica · Performance operacional e financeira — Abril 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-xs">
            <span className="text-slate-400">Período:</span>
            <span className="font-medium text-slate-700">Abr 2026</span>
            <span className="text-slate-300">▾</span>
          </div>
          <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-xs hover:bg-slate-50">
            Exportar
          </button>
          <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-xs hover:bg-slate-800">
            + Lançamento
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div>
        <SectionLabel>Financeiro</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            accent="bg-emerald-400"
            label="Faturamento do Mês"
            value="R$184k"
            trend="↑ 12%"
            trendUp
            sub="Meta: R$200k · 92% atingido"
          />
          <KpiCard
            accent="bg-emerald-400"
            label="Receita Líquida"
            value="R$156k"
            trend="↑ 9%"
            trendUp
            sub="Após deduções e impostos"
          />
          <KpiCard
            accent="bg-amber-400"
            label="A Receber (Pendente)"
            value="R$22k"
            trend="= 0%"
            trendUp={null}
            sub="18 contas com fatura em aberto"
          />
          <KpiCard
            accent="bg-slate-400"
            label="Lucro Operacional"
            value="R$48k"
            trend="↑ 6%"
            trendUp
            sub="Margem: 26% · Meta: 28%"
          />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card title="Receita × Despesas" description="Evolução nos últimos 7 meses">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MONTHLY_REVENUE} barCategoryGap="35%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                width={52}
                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="receita" fill="#10b981" radius={[3, 3, 0, 0]} name="receita" />
              <Bar dataKey="despesas" fill="#e2e8f0" radius={[3, 3, 0, 0]} name="despesas" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex gap-5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-sm bg-emerald-400" />
              Receita
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-sm bg-slate-200" />
              Despesas
            </span>
          </div>
        </Card>

        <Card title="Composição da Receita">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={REVENUE_BREAKDOWN}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {REVENUE_BREAKDOWN.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2.5">
            {REVENUE_BREAKDOWN.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: item.color }} />
                  {item.name}
                </span>
                <span className="text-xs font-semibold text-slate-700">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top accounts */}
        <Card title="Distribuição por Conta">
          <div className="space-y-4">
            {TOP_ACCOUNTS.map((account, i) => (
              <div key={account.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-400">
                      {i + 1}
                    </span>
                    {account.name}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{account.revenue}</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all"
                    style={{ width: `${account.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Expense categories */}
        <Card title="Categorias de Despesa">
          <div className="divide-y divide-slate-50">
            {EXPENSE_CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
              >
                <span className="text-sm text-slate-600">{cat.name}</span>
                <div className="text-right">
                  <span className="block text-sm font-semibold text-slate-900">{cat.value}</span>
                  <span className="text-[11px] text-slate-400">{cat.pct} do total</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Alerts */}
        <Card title="Requer Atenção">
          <div className="space-y-1">
            {ALERTS.map((alert) => (
              <AlertItem
                key={alert.title}
                variant={alert.variant}
                title={alert.title}
                description={alert.description}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
