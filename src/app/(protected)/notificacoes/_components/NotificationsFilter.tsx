"use client";

import { Filter } from "@/components/Filter";
import type { INotification } from "@/shared/types/notification";

const TYPE_OPTIONS: { value: INotification["type"]; label: string }[] = [
  { value: "INFO", label: "Informação" },
  { value: "SUCCESS", label: "Sucesso" },
  { value: "WARNING", label: "Aviso" },
  { value: "ERROR", label: "Erro" },
];

export function NotificationsFilter() {
  return (
    <Filter
      fields={[
        {
          name: "type",
          label: "Tipo",
          type: "select",
          placeholder: "Todos os tipos",
          options: TYPE_OPTIONS,
        },
        {
          name: "read",
          label: "Status",
          type: "select",
          placeholder: "Todos",
          options: [
            { value: "false", label: "Não lidas" },
            { value: "true", label: "Lidas" },
          ],
        },
      ]}
    />
  );
}
