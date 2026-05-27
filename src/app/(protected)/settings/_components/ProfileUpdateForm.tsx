"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IUser } from "@/shared/types/user";
import { InputsGrid } from "@/components/ui/InputsGrid";
import { Input } from "@/components/ui/Input";
import { CancelButton } from "@/components/ui/CancelButton";
import { Button } from "@/components/ui/Button";
import { useUpdateProfile } from "../_hooks/useUpdateProfile";
import type { UpdateProfileInput } from "../_schemas/profile.schema";
import { UpdateProfileSchema } from "../_schemas/profile.schema";

interface IProfileUpdateFormProps {
  profile: IUser;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProfileUpdateForm({ profile, onSuccess, onCancel }: IProfileUpdateFormProps) {
  const { execute, isLoading } = useUpdateProfile();

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: profile.name || "",
      profileImageUrl: profile.profileImageUrl ?? undefined,
    },
  });

  async function onSubmit(values: UpdateProfileInput) {
    await execute(values);
    onSuccess?.();
  }

  const { errors } = form.formState;

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <InputsGrid>
        <Input
          label="Nome"
          placeholder="Seu nome"
          {...form.register("name")}
          error={errors.name?.message}
        />
        <Input
          label="URL da Imagem de Perfil"
          placeholder="https://exemplo.com/imagem.jpg"
          {...form.register("profileImageUrl")}
          error={errors.profileImageUrl?.message}
        />
      </InputsGrid>

      <div className="flex gap-3">
        <CancelButton className="w-full" onClick={onCancel} />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Atualizar perfil
        </Button>
      </div>
    </form>
  );
}
