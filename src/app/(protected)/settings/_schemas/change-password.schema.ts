import { z } from "zod";

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "A senha deve conter letras e números",
    ),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
