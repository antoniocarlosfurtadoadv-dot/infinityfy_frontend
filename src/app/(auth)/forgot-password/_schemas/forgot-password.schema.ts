import { z } from "zod";

export const forgotPasswordEmailSchema = z.object({
  email: z
    .email("E-mail inválido")
    .min(1, "E-mail é obrigatório")
});

export const forgotPasswordCodeSchema = z.object({
  code: z
    .string()
    .min(4, "O código deve ter 4 dígitos")
    .max(4, "O código deve ter 4 dígitos")
    .regex(/^\d+$/, "O código deve conter apenas números"),
});

export const forgotPasswordNewPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "A senha deve conter letras e números",
    ),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  previousPassword: z.string().optional(),
});

export type ForgotPasswordEmailInput = z.infer<typeof forgotPasswordEmailSchema>;
export type ForgotPasswordCodeInput = z.infer<typeof forgotPasswordCodeSchema>;
export type ForgotPasswordNewPasswordInput = z.infer<typeof forgotPasswordNewPasswordSchema>;
