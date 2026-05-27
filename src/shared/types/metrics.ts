// Request Metrics - For veterinarian requests
export interface IRequestMetrics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface IUserMetrics {
  total: number;
  active: number;
  byRole: {
    master?: number;
    admin?: number;
    veterinarian: number;
    employee: number;
  };
}

export interface INotificationMetrics {
  total: number;
  unread: number;
  byType: {
    info: number;
    success: number;
    warning: number;
    error: number;
  };
}

// MASTER Metrics - All tenants/clinics overview
export interface IMasterMetricsResponse {
  period: {
    startDate: Date;
    endDate: Date;
  };
  global: {
    totalTenants: number;
    totalClinics: number;
    totalUsers: number;
    totalVeterinarians: number;
    totalPets: number;
    totalRequests: number;
    totalExams: number;
  };
  tenants: Array<{
    id: string;
    name: string;
    clinic?: {
      id: string;
      name: string;
      veterinariansCount: number;
    };
    users: IUserMetrics;
    requests: IRequestMetrics;
    petsCount: number;
  }>;
  topClinics: Array<{
    clinicId: string;
    clinicName: string;
    requestCount: number;
  }>;
  recentActivity: {
    totalActions: number;
    topActions: Array<{
      action: string;
      count: number;
    }>;
  };
}

// VETERINARIAN Metrics - Personal performance and requests
export interface IVeterinarianMetricsResponse {
  period: {
    startDate: Date;
    endDate: Date;
  };
  veterinarian: {
    id: string;
    name: string;
    crmv?: string;
    specialty?: string;
  };
  clinic: {
    id: string;
    name: string;
  };
  myRequests: IRequestMetrics;
  performance: {
    requestsCreatedInPeriod: number;
    approvalRate: number;
    petsAttended: number;
    examsRequested: number;
  };
  notifications: INotificationMetrics;
  recentRequests: Array<{
    requestId: string;
    petName: string;
    type: string;
    status: string;
    createdAt: Date;
  }>;
}

// EMPLOYEE Metrics - Limited clinic overview
export interface IEmployeeMetricsResponse {
  period: {
    startDate: Date;
    endDate: Date;
  };
  employee: {
    id: string;
    name: string;
    role: string;
  };
  clinic?: {
    id: string;
    name: string;
  };
  overview: {
    totalRequests: number;
    totalPets: number;
    totalTutors: number;
    totalVeterinarians: number;
  };
  requests: IRequestMetrics;
  notifications: INotificationMetrics;
}
export type MetricsResponse = IMasterMetricsResponse | IVeterinarianMetricsResponse | IEmployeeMetricsResponse;
