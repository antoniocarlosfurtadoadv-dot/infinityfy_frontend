import { z } from "zod";

// ── Brazilian UF options ──
export const UF_OPTIONS = [
  { value: "AC", label: "AC" },
  { value: "AL", label: "AL" },
  { value: "AP", label: "AP" },
  { value: "AM", label: "AM" },
  { value: "BA", label: "BA" },
  { value: "CE", label: "CE" },
  { value: "DF", label: "DF" },
  { value: "ES", label: "ES" },
  { value: "GO", label: "GO" },
  { value: "MA", label: "MA" },
  { value: "MT", label: "MT" },
  { value: "MS", label: "MS" },
  { value: "MG", label: "MG" },
  { value: "PA", label: "PA" },
  { value: "PB", label: "PB" },
  { value: "PR", label: "PR" },
  { value: "PE", label: "PE" },
  { value: "PI", label: "PI" },
  { value: "RJ", label: "RJ" },
  { value: "RN", label: "RN" },
  { value: "RS", label: "RS" },
  { value: "RO", label: "RO" },
  { value: "RR", label: "RR" },
  { value: "SC", label: "SC" },
  { value: "SP", label: "SP" },
  { value: "SE", label: "SE" },
  { value: "TO", label: "TO" },
] as const;

// ── Status options ──
export const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Ativo" },
  { value: "INACTIVE", label: "Inativo" },
] as const;

// ── Base schema ──
const BaseUserSchema = z.object({
  cpf: z.string().min(11, "CPF inválido"),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  phone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("Email inválido"),
  roleProfileId: z.string().min(1, "Perfil de acesso é obrigatório"),
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]).optional(),
});

export const CreateUserSchema = BaseUserSchema;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = BaseUserSchema.partial();
export type UpdateUserInput = Partial<CreateUserInput>;

export function getDefaultValues(): Record<string, unknown> {
  return {
    cpf: "",
    name: "",
    phone: "",
    email: "",
    roleProfileId: "",
  };
}
