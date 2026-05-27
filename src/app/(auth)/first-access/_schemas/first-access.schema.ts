import { z } from "zod";

// ── Resend first-access link ─────────────────────────────────────────────────
export const firstAccessRequestSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("Insira um e-mail válido"),
});

export type FirstAccessRequestInput = z.infer<typeof firstAccessRequestSchema>;

// ── Step 1: verify temporary password + terms ────────────────────────────────
export const firstAccessVerifySchema = z.object({
  currentPassword: z.string().min(1, "Senha temporária é obrigatória"),
  termsAccepted: z.boolean().refine((v) => v === true, {
    message: "Você deve aceitar os termos para continuar",
  }),
});

export type FirstAccessVerifyInput = z.infer<typeof firstAccessVerifySchema>;

// ── Step 2: create new password ───────────────────────────────────────────────
export const firstAccessNewPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).+$/,
        "A senha deve conter letras e números",
      ),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não correspondem",
    path: ["confirmPassword"],
  });

export type FirstAccessNewPasswordInput = z.infer<
  typeof firstAccessNewPasswordSchema
>;

