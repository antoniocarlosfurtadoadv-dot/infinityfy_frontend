"use client";

import { Filter } from "@/components/Filter";


export function LogsFilter() {
  return (
    <Filter
      fields={[
        {
          name: "entity",
          label: "Entidade",
          placeholder: "Selecione uma entidade...",
          type: "select",
          options: [

            { value: "Clinic", label: "Clínica" },
            { value: "Veterinarian", label: "Veterinário" },
          ],
        },
      ]}
    />
  );
}
