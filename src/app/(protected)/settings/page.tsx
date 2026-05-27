import { ProfileTabs } from "./_components/ProfileTabs";

export default function ProfilePage() {
  return (
    <div className="bg-neutral-white md:bg-transparent md:flex md:flex-col md:gap-6">
      <div className="p-6 border-b border-b-neutral-300 md:p-0 md:border-none">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-neutral-950">Configurações</h1>
          <p className="text-neutral-600 text-sm">Gerencie e edite suas informações</p>
        </div>
      </div>
     

      <ProfileTabs />
    </div>
  );
}
