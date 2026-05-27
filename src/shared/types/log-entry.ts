import type { IBaseEntity } from "./base";
import type { IUser } from "./user";

export interface ILogEntry extends IBaseEntity {

  action: string;
  metadata: Record<string, unknown> | null;
  companyId: string;

  entity: string;
  user?: IUser | null;
}



