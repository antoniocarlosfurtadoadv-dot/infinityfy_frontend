import { z } from "zod";
import { Permission } from "@/shared/types/permission";

export const CreateRoleProfileSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  defaultPermissions: z
    .array(z.nativeEnum(Permission))
    .min(1, "Selecione ao menos uma permissão"),
});

export type CreateRoleProfileInput = z.infer<typeof CreateRoleProfileSchema>;

export const UpdateRoleProfileSchema = CreateRoleProfileSchema.partial();
export type UpdateRoleProfileInput = z.infer<typeof UpdateRoleProfileSchema>;
