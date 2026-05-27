import { api } from "@/core/api/http";
import type { IUser } from "@/shared/types/user";

export interface IUpdateProfileData {
  name?: string;
  profileImageUrl?: string | null;
}

export interface IChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const ProfileService = {
  getMe: async (): Promise<IUser> => {
    return await api.get<IUser>("/auth/me");
  },

  update: async (data: IUpdateProfileData): Promise<IUser> => {
    return await api.patch<IUser>("/auth/me", data);
  },

  uploadPhoto: async (file: File): Promise<IUser> => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    return await api.post<IUser>("/users/upload", formData);
  },

  removePhoto: async (): Promise<IUser> => {
    return await api.patch<IUser>("/auth/me", { profileImageUrl: null });
  },

  changePassword: async (data: IChangePasswordData): Promise<void> => {
    await api.patch<void>("/auth/change-password", data);
  },
};
