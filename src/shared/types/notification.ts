import type { IBaseEntity } from "./base";




export interface INotification extends IBaseEntity {
  userId: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  read: boolean;
  readAt: Date | null;
  entityType: string | null;
  entityId: string | null;
  metadata: Record<string, unknown> | null;

}
