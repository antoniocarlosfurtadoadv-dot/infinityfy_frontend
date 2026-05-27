import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").optional(),
  profileImageUrl: z.string().nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
