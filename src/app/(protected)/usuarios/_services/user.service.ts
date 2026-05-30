import { api } from "@/core/api/http";
import type { IPagination } from "@/shared/types/pagination";
import type { IUser } from "@/shared/types/user";

export interface IUserListParams {
  page?: number;
  limit?: number;
  name?: string;
  roleProfileId?: string;
  teamId?: string;
  withoutTeam?: boolean;
  status?: string;
}

export interface ICreateUserData {
  cpf?: string;
  name: string;
  phone?: string;
  email: string;
  roleProfileId?: string;
  status?: "ACTIVE" | "INACTIVE" | "PENDING";
  // Master
  funcao?: string;
  // Veterinarian
  crmv?: string;
  crmvUf?: string;
  especialidade?: string;
  clinicId?: string;
  // Laboratory
  crqCrmv?: string;
  crqCrmvUf?: string;
  isGerenteSupervisor?: boolean;
  // Driver
  veiculo?: string;
  tipoVeiculo?: string;
  placa?: string;
  tipoCnh?: string;
  numeroCnh?: string;
  zonaRecolhimento?: string;
  turnoRecolhimento?: string;
}

export interface IUpdateUserData extends Partial<ICreateUserData> {
  id: string;
}

export const UserService = {
  list: async (params: IUserListParams = {}): Promise<IPagination<IUser>> => {
    return await api.get<IPagination<IUser>>("/users", {
      params: { ...params },
    });
  },

  getById: async (id: string): Promise<IUser> => {
    return await api.get<IUser>(`/users/${id}`);
  },

  create: async (data: ICreateUserData): Promise<IUser> => {
    return await api.post<IUser>("/users", data);
  },

  update: async ({ id, ...data }: IUpdateUserData): Promise<IUser> => {
    return await api.put<IUser>(`/users/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<void>(`/users/${id}`);
  },

  resendFirstAccess: async (id: string): Promise<void> => {
    await api.post<void>(`/users/${id}/resend-first-access`, {});
  },
};
