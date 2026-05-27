import type { IBaseEntity } from "./base";
import type { IUser } from "./user";
import type { Permission } from "./permission";



export interface IRoleProfile extends IBaseEntity {
  name: string;
  defaultPermissions: Permission[];
  description?: string;
  userId: string;
  users?: IUser[];
  type: "MASTER" | "VETERINARIAN" | "LABORATORY" | "MOTOBOY";
}
