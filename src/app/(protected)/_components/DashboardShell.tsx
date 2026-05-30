"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "@/core/hooks/useAuth";
import { isTokenExpired } from "@/core/services/storage.service";
import { useSidebarState } from "../_hooks/useSidebarState";
import { buildSidebar } from "./sidebar-config";

import { DashboardLoadingState } from "./DashboardLoadingState";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface IDashboardShellProps {
  children: ReactNode;
}

function DashboardShellInner({ children }: IDashboardShellProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { isSidebarOpen, toggleSidebar, closeSidebarOnMobile } =
    useSidebarState();

  useEffect(() => {
    if (!user || isTokenExpired()) {
      logout();
      router.replace("/login");
    }
  }, [user, router, logout]);

  const userPermissions = useMemo(
    () => user?.roleProfile?.defaultPermissions ?? [],
    [user],
  );

  const sidebar = useMemo(() => {
    if (!user) {
      return {
        upper: [],
        lower: [],
      };
    }

    return buildSidebar(userPermissions);
  }, [user, userPermissions]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!user) {
    return <DashboardLoadingState />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <div className="flex min-h-screen">
        <Sidebar
          user={user}
          filteredLinks={sidebar.upper}
          filteredLowerLinks={sidebar.lower}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
          onLinkClick={closeSidebarOnMobile}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <div
          className={clsx(
            "flex min-h-screen min-w-0 flex-1 flex-col transition-all duration-300",
            isSidebarOpen ? "md:pl-52 lg:pl-63" : "md:pl-16 lg:pl-18",
          )}
        >
          <Navbar user={user} onToggleSidebar={toggleSidebar} />

          {/* Page Content */}
          {/* Don't add padding here */}
          <main className="flex-1 md:px-4 md:py-4 xl:px-6 xl:py-6 bg-neutral-white lg:bg-bg-dashboard">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: IDashboardShellProps) {
  return <DashboardShellInner>{children}</DashboardShellInner>;
}
