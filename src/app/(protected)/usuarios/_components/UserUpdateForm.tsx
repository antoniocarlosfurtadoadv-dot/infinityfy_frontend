"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { IUser } from "@/shared/types/user";
import { InputsGrid } from "@/components/ui/InputsGrid";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CancelButton } from "@/components/ui/CancelButton";
import { Button } from "@/components/ui/Button";
import { useUpdateUser } from "../_hooks/useUpdateUser";
import type { UpdateUserInput } from "../_schemas/employee.schema";
import { UpdateUserSchema, STATUS_OPTIONS } from "../_schemas/employee.schema";
import type { IRoleProfile } from "@/shared/types/role-profile";
import { formatCpf, formatPhone } from "@/core/utils/formatFields";

interface IUserUpdateFormProps {
  user: IUser;
  roleProfiles: IRoleProfile[];
  roleProfileOptions: Array<{ value: string; label: string }>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UserUpdateForm({ user, roleProfileOptions, onSuccess, onCancel }: IUserUpdateFormProps) {
  const { execute, isLoading } = useUpdateUser(user.id);

  const isPending = user.status === "PENDING";

  const statusOptions = isPending
    ? [{ value: "PENDING", label: "Pendente" }]
    : [
      { value: "", label: "Selecione..." },
      ...STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
    ];

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      cpf: formatCpf(user.cpf ?? ""),
      name: user.name || "",
      phone: formatPhone(user.phone ?? ""),
      email: user.email || "",
      roleProfileId: user.roleProfileId || user.roleProfile?.id || "",
      status: user.status ?? "ACTIVE",
    },
  });

  async function onSubmit(values: UpdateUserInput) {
    const payload = { ...values };

    if (isPending) {
      delete (payload as Record<string, unknown>).status;
    }

    const result = await execute(payload);
    if (!result) return;
    onSuccess?.();
  }

  const { errors } = form.formState;

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <InputsGrid>
        <Input
          label="CPF"
          placeholder="000.000.000-00"
          {...form.register("cpf")}
          onKeyUp={(i: React.KeyboardEvent<HTMLInputElement>) => {
            (i.target as HTMLInputElement).value = formatCpf((i.target as HTMLInputElement).value);
          }}
          error={errors.cpf?.message as string}
        />
        <Input
          label="Nome Completo"
          placeholder="Maria Silva"
          {...form.register("name")}
          error={errors.name?.message as string}
        />
      </InputsGrid>

      <InputsGrid>
        <Input
          label="Telefone / WhatsApp"
          placeholder="(11) 99999-9999"
          {...form.register("phone")}
          onKeyUp={(i: React.KeyboardEvent<HTMLInputElement>) => {
            (i.target as HTMLInputElement).value = formatPhone((i.target as HTMLInputElement).value);
          }}
          error={errors.phone?.message as string}
        />
        <Input
          label="E-mail"
          type="email"
          placeholder="maria@empresa.com"
          {...form.register("email")}
          error={errors.email?.message as string}
        />
      </InputsGrid>

      <InputsGrid>
        <Select
          label="Perfil de Acesso"
          {...form.register("roleProfileId")}
          value={form.watch("roleProfileId")}
          error={errors.roleProfileId?.message as string}
          options={roleProfileOptions}
        />
        <Select
          label="Status"
          {...form.register("status")}
          value={form.watch("status")}
          error={errors.status?.message as string}
          options={statusOptions}
          disabled={isPending}
        />
      </InputsGrid>

      <div className="flex gap-3">
        <CancelButton className="w-full" onClick={onCancel} />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Atualizar usuário
        </Button>
      </div>
    </form>
  );
}
