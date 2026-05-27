import type {
  IVeterinarianMetricsResponse,
  MetricsResponse,
} from "@/shared/types/metrics";

function buildVeterinarianMock(): IVeterinarianMetricsResponse {
  const now = new Date();
  return {
    period: {
      startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      endDate: now,
    },
    veterinarian: {
      id: "vet-local-mock",
      name: "Dr(a). Mock",
      crmv: "CRMV-0000",
      specialty: "Clinica Geral",
    },
    clinic: {
      id: "clinic-local-mock",
      name: "Clinica Local",
    },
    myRequests: {
      total: 300,
      pending: 100,
      approved: 40,
      rejected: 3,
      byPriority: {
        low: 8,
        medium: 12,
        high: 4,
      },
    },
    performance: {
      requestsCreatedInPeriod: 24,
      approvalRate: 84.2,
      petsAttended: 40,
      examsRequested: 47,
    },
    notifications: {
      total: 12,
      unread: 3,
      byType: {
        info: 6,
        success: 4,
        warning: 1,
        error: 1,
      },
    },
    recentRequests: [
      {
        requestId: "810308103",
        petName: "Thor - Gabriel da Silva",
        type: "Labrador",
        status: "Em Recolhimento",
        createdAt: new Date("2025-07-20T10:00:00.000Z"),
      },
      {
        requestId: "810308104",
        petName: "Thor - Gabriel da Silva",
        type: "Labrador",
        status: "Em Analise",
        createdAt: new Date("2025-07-20T10:00:00.000Z"),
      },
      {
        requestId: "810308105",
        petName: "Thor - Gabriel da Silva",
        type: "Labrador",
        status: "Erro na Amostra",
        createdAt: new Date("2025-07-20T10:00:00.000Z"),
      },
      {
        requestId: "810308106",
        petName: "Thor - Gabriel da Silva",
        type: "Labrador",
        status: "Laudo Liberado",
        createdAt: new Date("2025-07-20T10:00:00.000Z"),
      },
      {
        requestId: "810308107",
        petName: "Thor - Gabriel da Silva",
        type: "Labrador",
        status: "Em Analise",
        createdAt: new Date("2025-07-20T10:00:00.000Z"),
      },
      {
        requestId: "810308108",
        petName: "Luna - Maria Oliveira",
        type: "Poodle",
        status: "Em Analise",
        createdAt: new Date("2025-07-21T09:30:00.000Z"),
      },
      {
        requestId: "810308109",
        petName: "Max - João Souza",
        type: "Bulldog",
        status: "Laudo Liberado",
        createdAt: new Date("2025-07-21T11:15:00.000Z"),
      },
      {
        requestId: "810308110",
        petName: "Mel - Ana Costa",
        type: "Shih Tzu",
        status: "Erro na Amostra",
        createdAt: new Date("2025-07-21T13:45:00.000Z"),
      },
      {
        requestId: "810308111",
        petName: "Bob - Carlos Mendes",
        type: "Pastor Alemão",
        status: "Em Recolhimento",
        createdAt: new Date("2025-07-21T15:20:00.000Z"),
      },
    ],
  };
}

export function getMockMetricsByUserType(userType?: string): MetricsResponse {
  void userType;

  return buildVeterinarianMock();
}
