import type { IBaseEntity } from "./base";
import type { IRoleProfile } from "./role-profile";
import type { ITenant } from "./tenant";

export interface IUser extends IBaseEntity {
  email: string;
  password: string;
  name: string;
  tenantId: string;
  tenant?: ITenant;
  mustChangePassword: boolean;
  phone?: string;
  cpf?: string;
  funcao?: string; // For Master /  users


  profileImageUrl?: string;
  termsAcceptedAt?: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  roleProfileId: string;
  roleProfile: IRoleProfile;
}
