"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { ProfileDetails } from "./ProfileDetails";
import { AccountTab } from "./AccountTab";

export function ProfileTabs() {

  return (
    <Tabs defaultValue="perfil" className="w-full md:flex md:flex-col md:gap-6">
      <TabsList>
        <TabsTrigger value="perfil" >Perfil</TabsTrigger>
        <TabsTrigger value="conta">Conta</TabsTrigger>
      </TabsList>

      <TabsContent value="perfil" className=" p-6 flex flex-col gap-6 items-center md:p-0">
        <ProfileDetails />
      </TabsContent>

      <TabsContent value="conta">
        <AccountTab />
      </TabsContent>
    </Tabs>
  );
}
