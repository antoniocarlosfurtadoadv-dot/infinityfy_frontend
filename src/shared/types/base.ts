// Base entity interface Ithat all domain models extend
export interface IBaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// Omit common fields when creating entities
export type CreateEntityData<T extends IBaseEntity> = Omit<T, "id" | "createdAt" | "updatedAt">;

// Partial update without id
export type UpdateEntityData<T extends IBaseEntity> = Partial<Omit<T, "id" | "createdAt" | "updatedAt">>;

// Type for entity with required id
export type EntityWithId<T extends IBaseEntity> = Required<Pick<T, "id">> & T;
