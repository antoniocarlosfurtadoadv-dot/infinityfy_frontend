import { z } from "zod";

export const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).+$/,
        "A senha deve conter letras e números",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não correspondem",
    path: ["confirmPassword"],
  });

export type NewPasswordInput = z.infer<typeof newPasswordSchema>;
