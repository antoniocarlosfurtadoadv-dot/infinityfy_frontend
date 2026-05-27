"use client";

import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Card } from "@/components/ui/Card";
import { ProfileUpdateForm } from "./ProfileUpdateForm";
import { useProfile } from "../_hooks/useProfile";

export function ProfileEdit() {
  const router = useRouter();
  const { data: profile, isLoading, error } = useProfile();

  const handleSuccess = () => {
    router.push("/settings");
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !profile) {
    return (
      <ErrorState message="Não foi possível carregar os dados do perfil." />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <ProfileUpdateForm
          profile={profile}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  );
}
