"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CancelButton } from "@/components/ui/CancelButton";
import type { Permission } from "@/shared/types/permission";
import { CreateRoleProfileSchema, type CreateRoleProfileInput } from "../_schemas/role-profile.schema";
import { useCreateRoleProfile } from "../_hooks/useCreateRoleProfile";
import { PermissionsCheckboxGroup } from "./PermissionsCheckboxGroup";

interface IRoleProfileFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function RoleProfileForm({ onSuccess, onCancel }: IRoleProfileFormProps) {
  const { execute, isLoading } = useCreateRoleProfile();

  const form = useForm<CreateRoleProfileInput>({
    resolver: zodResolver(CreateRoleProfileSchema),
    defaultValues: {
      name: "",
      description: "",
      defaultPermissions: [] as Permission[],
    },
  });

  const { errors } = form.formState;

  async function onSubmit(values: CreateRoleProfileInput) {
    await execute(values);
    form.reset();
    onSuccess?.();
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nome"
          placeholder="Ex: Atendente de Clínica"
          {...form.register("name")}
          onChange={(e) => {
            const value = e.target.value;
            const normalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            form.setValue("name", normalized, { shouldValidate: true });
          }}
          error={errors.name?.message}
        />
        <Input
          label="Descrição"
          placeholder="Descreva a finalidade deste perfil"
          {...form.register("description")}
          error={errors.description?.message}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Permissões
        </label>
        <Controller
          control={form.control}
          name="defaultPermissions"
          render={({ field }) => (
            <PermissionsCheckboxGroup
              value={field.value as Permission[]}
              onChange={field.onChange}
              error={errors.defaultPermissions?.message}
            />
          )}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        {onCancel && <CancelButton onClick={onCancel} />}
        <Button type="submit" isLoading={isLoading}>
          Criar perfil
        </Button>
      </div>
    </form>
  );
}
