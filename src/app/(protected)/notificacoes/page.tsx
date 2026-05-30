"use client";

import { PageHeader } from "@/components/PageHeader";
import { NotificationsFilter } from "./_components/NotificationsFilter";
import { NotificationsList } from "./_components/NotificationsList";

export default function NotificacoesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Notificações"
        subtitle="Acompanhe todas as notificações do sistema."
      />

      <NotificationsFilter />

      <NotificationsList />
    </div>
  );
}
