"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { InputsGrid } from "@/components/ui/InputsGrid";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CancelButton } from "@/components/ui/CancelButton";
import { Button } from "@/components/ui/Button";
import { useCreateUser } from "../_hooks/useCreateUser";
import type { CreateUserInput } from "../_schemas/employee.schema";
import { CreateUserSchema, getDefaultValues } from "../_schemas/employee.schema";
import { useRoleProfileList } from "../../perfis/_hooks/useRoleProfileList";
import { formatCpf, formatPhone } from "@/core/utils/formatFields";

interface IUserFormProps {
  onSuccess?: () => void;
}

export function UserForm({ onSuccess }: IUserFormProps) {
  const { execute, isLoading } = useCreateUser();

  const { data: roleProfilesData, isLoading: isLoadingRoleProfiles } = useRoleProfileList({ limit: 100 });
  const roleProfiles = roleProfilesData?.data ?? [];

  const roleProfileOptions = [
    { value: "", label: "Selecione..." },
    ...roleProfiles.map((rp) => ({
      value: rp.id,
      label: rp.name,
    })),
  ];

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: getDefaultValues() as CreateUserInput,
  });

  async function onSubmit(values: CreateUserInput) {
    const result = await execute(values);
    if (!result) return;
    form.reset(getDefaultValues() as CreateUserInput);
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
          error={errors.roleProfileId?.message as string}
          options={roleProfileOptions}
          disabled={isLoadingRoleProfiles}
        />
      </InputsGrid>

      <div className="flex gap-3">
        <CancelButton className="w-full" />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Salvar Usuário
        </Button>
      </div>
    </form>
  );
}
