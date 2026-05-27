"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { SkeletonCard, SkeletonList } from "@/components/Skeleton";
import { formatDate2Digit } from "@/core/utils/formatters";
import type { IVeterinarianMetricsResponse } from "@/shared/types/metrics";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  MoreHorizontal,
  PawPrint,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PeriodFilter, type PeriodType } from "./PeriodFilter";
import { DashboardEmptyState } from "./DashboardEmptyState";

interface IVeterinarianMetricsViewProps {
  data: IVeterinarianMetricsResponse;
  isLoading?: boolean;
}

type DashboardTab = "recent" | "urgent";

export function VeterinarianMetricsView({
  data,
  isLoading = false,
}: IVeterinarianMetricsViewProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("recent");
  const [cardPeriods, setCardPeriods] = useState<Record<string, PeriodType>>({
    total: "this-week",
    pending: "this-week",
    pets: "this-week",
    approved: "this-week",
  });

  const allRequests = data?.recentRequests ?? [];
  const urgentRequests = allRequests.filter((request) => {
    const normalizedStatus = request.status.toLowerCase();
    return (
      normalizedStatus.includes("urg") ||
      normalizedStatus.includes("anal") ||
      normalizedStatus.includes("pend") ||
      normalizedStatus.includes("erro")
    );
  });

  const cards = {
    allRequests,
    urgentRequests,
    displayed: activeTab === "urgent" ? urgentRequests : allRequests,
  };

  const getStatusPill = (status: string) => {
    const normalizedStatus = status.toLowerCase();

    if (
      normalizedStatus.includes("liber") ||
      normalizedStatus.includes("aprov")
    ) {
      return "bg-[#177E3C0A] text-[#177E3C]";
    }

    if (
      normalizedStatus.includes("recolh") ||
      normalizedStatus.includes("pend")
    ) {
      return "bg-[#363F720A] text-[#363F720]";
    }

    if (normalizedStatus.includes("anal")) {
      return "bg-[#C4320A0A] text-[#C4320A]";
    }

    if (
      normalizedStatus.includes("erro") ||
      normalizedStatus.includes("rejeit")
    ) {
      return "bg-[#CC1F1F0A] text-[#CC1F1F]";
    }

    return "bg-slate-100 text-slate-600";
  };

  const getExpectedDate = (createdAt: Date) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 3);
    return date;
  };

  const handleCardPeriodChange = (cardKey: string, newPeriod: PeriodType) => {
    setCardPeriods((prev) => ({
      ...prev,
      [cardKey]: newPeriod,
    }));
  };

  const summaryCards = [
    {
      key: "total",
      title: "Total de Requisições",
      value: data.myRequests.total,
      trend: "↑ 7%",
      icon: ClipboardList,
      iconClassName: "bg-blue-50 text-blue-600",
    },
    {
      key: "pending",
      title: "Requisições em Análise",
      value: data.myRequests.pending,
      trend: "↑ 7%",
      icon: Clock3,
      iconClassName: "bg-amber-50 text-amber-500",
    },
    {
      key: "pets",
      title: "Pacientes Ativos",
      value: data.performance.petsAttended,
      trend: "↑ 7% cadastrados",
      icon: PawPrint,
      iconClassName: "bg-violet-50 text-violet-500",
    },
    {
      key: "approved",
      title: "Requisições Concluídas Hoje",
      value: data.myRequests.approved,
      trend: "↑ 7% que ontem",
      icon: CheckCircle2,
      iconClassName: "bg-emerald-50 text-emerald-500",
    },
  ] as const;

  const renderSummaryCards = () => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="min-h-36.25 w-66.75 shrink-0 snap-start rounded-xl xl:w-full xl:flex-1 xl:min-w-55.75 xl:max-w-75.75 2xl:min-w-54 2xl:max-w-84"
        >
          <SkeletonCard lines={2} />
        </div>
      ));
    }

    return summaryCards.map((card) => {
      const Icon = card.icon;
      const currentPeriod = cardPeriods[card.key] || "this-week";

      return (
        <Card
          key={card.key}
          className="min-h-36.25 w-66.75 shrink-0 snap-start rounded-xl border-slate-200 px-4 py-2.5 flex flex-col xl:w-full xl:flex-1 xl:min-w-55.75 xl:max-w-75.75 2xl:min-w-54 2xl:max-w-84"
          padding="none"
        >
          <div className="flex items-center justify-between">
            <div className={`rounded-lg p-2 ${card.iconClassName}`}>
              <Icon className="h-5 w-5" />
            </div>

            {card.title !== "Requisições Concluídas Hoje" && (
              <PeriodFilter
                value={currentPeriod}
                onChange={(newPeriod) =>
                  handleCardPeriodChange(card.key, newPeriod)
                }
                compact
              />
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <p className="text-sm text-slate-500">{card.title}</p>

            <div className=" flex items-center gap-2">
              <p className="text-3xl font-bold text-slate-900">{card.value}</p>
              <span className="text-xs font-semibold text-emerald-500">
                {card.trend}
              </span>
            </div>
          </div>
        </Card>
      );
    });
  };

  const renderRequestsList = () => {
    if (isLoading) {
      return (
        <div className="grid gap-4 pt-6 place-items-center md:grid-cols-[repeat(auto-fit,minmax(19rem,1fr))] md:py-6 md:place-items-stretch xl:grid-cols-3 xl:bg-neutral-white xl:border xl:border-neutral-200 rounded-lg xl:p-5 2xl:grid-cols-4 2xl:gap-5 2xl:place-items-stretch">
          <SkeletonList count={3} height="h-56" />
        </div>
      );
    }

    if (cards.displayed.length === 0) {
      return <DashboardEmptyState />;
    }

    return (
      <div className="grid gap-4 pt-6 place-items-center md:grid-cols-[repeat(auto-fit,minmax(19rem,1fr))] md:py-6 md:place-items-stretch xl:grid-cols-3 xl:bg-neutral-white xl:border xl:border-neutral-200 rounded-lg xl:p-5 2xl:grid-cols-4 2xl:gap-5 2xl:place-items-stretch">
        {cards.displayed.map((request, index) => (
          <Card
            key={`${request.requestId}-${index}`}
            className="relative w-full max-w-122.25 rounded-xl border-slate-200 p-4 md:w-full 2xl:max-w-none"
            padding="none"
          >
            {activeTab === "urgent" && (
              <div className="mb-3">
                <span className="inline-flex rounded-full bg-[#CC1F1F0A] px-3 py-1 text-sm font-medium text-[#CC1F1F]">
                  Urgente
                </span>
              </div>
            )}
            <button
              type="button"
              className="absolute right-4 top-4 rounded-md border border-primary-main p-1 text-primary-main transition hover:bg-primary-main/10"
              aria-label="Abrir ações da requisição"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            <div className="flex items-center border-b border-slate-100 pb-3 pr-14">
              <div className="grid min-w-0 grid-cols-[auto_1fr] items-center gap-2">
                <h3 className="whitespace-nowrap text-lg font-bold text-slate-800">
                  ID {request.requestId}
                </h3>
                <span
                  className={`block max-w-full truncate whitespace-nowrap rounded-lg px-2 py-1 text-xs font-medium ${getStatusPill(request.status)}`}
                >
                  {request.status}
                </span>
              </div>
            </div>
            <div className="space-y-1 pt-1">
              <p className="text-lg font-semibold text-slate-800">
                {request.petName}
              </p>
              <p className="text-sm text-slate-500">
                {request.type || "Labrador"}
              </p>
            </div>
            <div className="space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>Solicitação: {formatDate2Digit(request.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>
                  Entrega:{" "}
                  {formatDate2Digit(getExpectedDate(request.createdAt))}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-neutral-white md:bg-transparent xl:p-6 flex flex-col gap-6 pb-6">
      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between border-b border-neutral-300 md:border-none xl:p-0 md:px-0">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl 2xl:text-2xl font-bold text-neutral-950">
            Dashboard
          </h1>
          <p className="text-sm text-neutral-600">
            Gerencie suas requisições laboratoriais de forma eficiente
          </p>
        </div>

        <Button
          asChild
          variant="primary"
          size="sm"
          className="w-46 h-9.25 justify-center whitespace-nowrap leading-none self-start md:self-auto relative"
          leftIcon={
            <span className="inline-flex h-5 w-5 items-center justify-center text-lg leading-none">
              +
            </span>
          }
        >
          <Link href="/requisicoes/new"><span className="text-sm">Nova requisição</span></Link>
        </Button>
      </div>

      <div className=" flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory  xl:justify-between xl:m-0 xl:flex-wrap xl:overflow-visible xl:snap-none xl:gap-6 xl:p-0 2xl:mx-auto 2xl:w-full 2xl:justify-center 2xl:gap-6 ml-6 md:ml-0">
        {renderSummaryCards()}
      </div>

      <div className="flex flex-col xl:gap-6 px-6 xl:p-0 md:px-0">
        <div className="xl:p-0 ">
          <div className="flex items-center justify-between gap-4 ">
            <div className="flex justify-between w-full items-center gap-2 text-base xl:justify-start">
              <button
                type="button"
                onClick={() => setActiveTab("recent")}
                className={
                  "px-2 py-1 font-semibold transition-colors text-base cursor-pointer " +
                  (activeTab === "recent"
                    ? " text-neutral-950 border-b-2 border-primary-main"
                    : "text-slate-500 hover:text-slate-800")
                }
              >
                Últimas requisições
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("urgent")}
                className={
                  " px-2 py-1 font-medium transition-colors cursor-pointer " +
                  (activeTab === "urgent"
                    ? "text-neutral-950 border-b-2 border-primary-main"
                    : "text-slate-500 hover:text-slate-800")
                }
              >
                Urgentes ({cards.urgentRequests.length})
              </button>
            </div>
            <div className="hidden xl:flex w-25.25 ">
              <Link
                href="/requisicoes"
                className=" text-sm flex items-center cursor-pointer font-semibold text-primary-main hover:text-secondary-main transition-colors"
              >
                Ver todas
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        {renderRequestsList()}
      </div>

      <div className="flex justify-center xl:hidden">
        <Link
          href="/requisicoes"
          className=" text-lg flex items-center cursor-pointer font-semibold text-primary-main hover:text-secondary-main transition-colors"
        >
          Ver todas
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
