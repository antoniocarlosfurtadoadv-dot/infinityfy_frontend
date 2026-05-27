import { z } from "zod";

export const verifyCodeSchema = z.object({
  code: z.string().length(4, "Digite o código de 4 dígitos"),
});

export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;
