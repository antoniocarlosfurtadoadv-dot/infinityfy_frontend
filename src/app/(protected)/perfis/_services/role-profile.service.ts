import { api } from "@/core/api/http";
import type { IPagination } from "@/shared/types/pagination";
import type { IRoleProfile } from "@/shared/types/role-profile";

export interface IRoleProfileListParams {
  page?: number;
  limit?: number;
  name?: string;
}

export interface ICreateRoleProfileData {
  name: string;
  description?: string;
  defaultPermissions: string[];
}

export interface IUpdateRoleProfileData extends Partial<ICreateRoleProfileData> {
  id: string;
}

export const RoleProfileService = {
  list: (params: IRoleProfileListParams = {}) =>
    api.get<IPagination<IRoleProfile>>("/role-profiles", {
      params: params as Record<string, string | number | boolean | undefined>,
    }),

  getById: (id: string) => api.get<IRoleProfile>(`/role-profiles/${id}`),

  create: (data: ICreateRoleProfileData) =>
    api.post<IRoleProfile>("/role-profiles", data),

  update: ({ id, ...data }: IUpdateRoleProfileData) =>
    api.patch<IRoleProfile>(`/role-profiles/${id}`, data),

  delete: (id: string) => api.delete<void>(`/role-profiles/${id}`),
};
