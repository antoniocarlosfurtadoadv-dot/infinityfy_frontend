import type { IBaseEntity } from "./base";

export interface IProfile extends IBaseEntity {
  name: string;
  email: string;
  type: string;
  profileImageUrl?: string | null;
}
