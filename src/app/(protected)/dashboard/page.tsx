// "use client";

// import { useState } from "react";
// import { useMetrics } from "./_hooks/useMetrics";
// import type { IMetricsFilters } from "./_services/metrics.service";
// import { useAuth } from "@/core/hooks/useAuth";
// import { MasterMetricsView } from "./_components/MasterMetricsView";
// import type {
//   IEmployeeMetricsResponse,
//   IVeterinarianMetricsResponse,
// } from "@/shared/types/metrics";
// import { VeterinarianMetricsView } from "./_components/VeterinarianMetricsView";
// import { EmployeeMetricsView } from "./_components/EmployeeMetricsView";
// import { ErrorState } from "@/components/ErrorState";
// import { LoadingSpinner } from "@/components/LoadingState";
// import { PermissionGuard } from "@/components/PermissionGuard";
// import { Permission } from "@/shared/types/permission";

// export default function DashboardPage() {
//   const { user } = useAuth();
//   const [filters] = useState<IMetricsFilters>({});
//   const { data, isLoading, error } = useMetrics(
//     filters,
//     user?.roleProfile?.name,
//   );

//   const renderMetricsView = () => {
//     if (!data) return null;

//     console.log("User Role:", user?.roleProfile?.name);

//     switch (user?.roleProfile?.name) {
//       case "MASTER":
//         return <MasterMetricsView />;
//       case "VETERINARIAN":
//         return (
//           <VeterinarianMetricsView
//             data={data as IVeterinarianMetricsResponse}
//             isLoading={isLoading}
//           />
//         );
//       case "LABORATORY":
//       case "MOTOBOY":
//         return <EmployeeMetricsView data={data as IEmployeeMetricsResponse} />;
//       default:
//         return (
//           <ErrorState
//             message="Tipo de usuário não reconhecido"
//             showBackButton={false}
//           />
//         );
//     }
//   };

//   return (
//     <PermissionGuard
//       requiredPermissions={[
//         Permission.DASHBOARD_VISUALIZAR_OPERACIONAL,
//         Permission.DASHBOARD_VISUALIZAR_FINANCEIRO,
//       ]}
//     >
//       <div>
//         <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"></header>

//         <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>



//         {isLoading && (
//           <div className="flex items-center justify-center py-12">
//             <div className="space-y-3 text-center flex flex-col items-center justify-center">
//               <LoadingSpinner size="lg" />
//               <p className="text-sm text-slate-500">Carregando métricas...</p>
//             </div>
//           </div>
//         )}

//         {error && (
//           <ErrorState
//             message="Erro ao carregar métricas. Tente novamente."
//             showBackButton={false}
//           />
//         )}

//         {!isLoading && !error && renderMetricsView()}
//       </div>
//     </PermissionGuard>
//   );
// }


"use client";

import { useState } from "react";
import { useMetrics } from "./_hooks/useMetrics";
import type { IMetricsFilters } from "./_services/metrics.service";
import { useAuth } from "@/core/hooks/useAuth";
import { MasterMetricsView } from "./_components/MasterMetricsView";
import type {
  IEmployeeMetricsResponse,
  IVeterinarianMetricsResponse,
} from "@/shared/types/metrics";
import { VeterinarianMetricsView } from "./_components/VeterinarianMetricsView";
import { EmployeeMetricsView } from "./_components/EmployeeMetricsView";
import { ErrorState } from "@/components/ErrorState";
import { LoadingSpinner } from "@/components/LoadingState";
import { PermissionGuard } from "@/components/PermissionGuard";
import { Permission } from "@/shared/types/permission";

export default function DashboardPage() {
  const { user } = useAuth();
  const [filters] = useState<IMetricsFilters>({});
  const { data, isLoading, error } = useMetrics(
    filters,
    user?.roleProfile?.name,
  );

  const renderMetricsView = () => {
    if (!data) return null;

    console.log("User Role:", user?.roleProfile?.name);

    switch (user?.roleProfile?.name) {
      case "MASTER":
        return <MasterMetricsView />;
      case "VETERINARIAN":
        return (
          <VeterinarianMetricsView
            data={data as IVeterinarianMetricsResponse}
            isLoading={isLoading}
          />
        );
      case "LABORATORY":
      case "MOTOBOY":
        return <EmployeeMetricsView data={data as IEmployeeMetricsResponse} />;
      default:
        return (
          <ErrorState
            message="Tipo de usuário não reconhecido"
            showBackButton={false}
          />
        );
    }
  };

  return (
    <PermissionGuard
      requiredPermissions={[
        Permission.DASHBOARD_VISUALIZAR_OPERACIONAL,
        Permission.DASHBOARD_VISUALIZAR_FINANCEIRO,
      ]}
    >
      <div>
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"></header>

        <MasterMetricsView />;
      </div>
    </PermissionGuard>
  );
}
