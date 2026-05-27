"use client";

import { useEffect, useMemo, useState } from "react";
import { Fragment } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, MenuIcon, Search, X, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { NotificationPanel } from "./NotificationPanel";
import Image from "next/image";
import { useAuth } from "@/core/hooks/useAuth";
import { buildSidebar } from "./sidebar-config";
import type { IUser } from "@/shared/types/user";
import { useProfile } from "../settings/_hooks/useProfile";

interface INavbarProps {
  user: IUser;
  onToggleSidebar?: () => void;
}

export function Navbar({ user }: INavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { data: profile } = useProfile();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(
    null,
  );

  const initials = profile?.name
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  const userPermissions = useMemo(
    () => user?.roleProfile?.defaultPermissions ?? [],
    [user],
  );

  const userRoleType = user?.roleProfile?.type ?? null;

  const sidebar = useMemo(() => {
    return buildSidebar(userPermissions, userRoleType);
  }, [userPermissions, userRoleType]);

  const mobileUpperLinks = sidebar.upper;

  const mobileLowerLinks = sidebar.lower;

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      return;
    }

    document.body.style.overflow = "unset";
  }, [isMobileMenuOpen]);

  const handleToggleMobileSearch = () => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen((prev) => !prev);
  };

  const handleToggleMobileMenu = () => {
    setIsMobileSearchOpen(false);
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b  border-slate-200 px-4 py-3 md:px-6 ">
      <div className="flex items-center justify-between md:px-2 lg:px-8 ">
        <div className="flex min-w-0 flex-1 items-center gap-4 p-1">
          <Image
            src="/images/brand/infinityfy-blue-logo.png"
            alt="infinityfy Logo"
            className="md:hidden"
            width={61}
            height={24}
          />

          {/* Search Input */}
          <div className="hidden md:block md:w-72 lg:w-80 xl:w-100">
            <Input
              placeholder="Buscar requisições, pacientes..."
              leftIcon={<Search className="h-5 w-5" />}
              className="border-slate-300 bg-slate-50 text-sm text-slate-700 focus:border-slate-400 focus:bg-white focus:ring-slate-100"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="flex md:hidden items-center justify-between gap-2">
            <div
              className="h-9 w-9 rounded-full overflow-hidden shrink-0 cursor-pointer"
              onClick={() => router.push("/settings")}
            >
              {profile?.profileImageUrl ? (
                <Image
                  src={profile.profileImageUrl}
                  alt="User"
                  width={36}
                  height={36}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary-main">
                  <span className="text-base font-bold text-white">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleToggleMobileSearch}
              aria-expanded={isMobileSearchOpen}
              aria-label="Abrir busca"
              className="p-1 text-neutral-900 hover:text-primary-main rounded-lg transition-colors"
            >
              <Search className="h-6 w-6" />
            </button>

            <button
              onClick={handleToggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-label="Abrir menu"
              className="p-1 text-neutral-900 hover:text-primary-main rounded-lg transition-colors"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="hidden md:flex">
            <NotificationPanel />
          </div>

          <div
            className="h-8 w-px hidden md:flex bg-neutral-200"
            aria-hidden="true"
          />

          <button
            className="hidden cursor-pointer items-center gap-3 md:flex px-2 py-2 hover:shadow-sm duration-300 delay-100 rounded-md"
            onClick={() => router.push("/settings")}
          >
            <div className="h-10 w-10 rounded-full overflow-hidden shrink-0">
              {profile?.profileImageUrl ? (
                <Image
                  src={profile.profileImageUrl}
                  alt="User"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary-main">
                  <span className="text-sm font-bold text-white">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            <div className="hidden lg:flex flex-col items-start">
              <p className="text-sm font-bold text-neutral-950">{user.name}</p>
              <p className="text-xs text-neutral-700 font-medium">
                {user.roleProfile?.name ?? user?.roleProfile?.type}
              </p>
            </div>
          </button>
        </div>
      </div>

      <div
        className={
          "grid transition-all duration-300 ease-out md:hidden " +
          (isMobileSearchOpen
            ? "mt-3 grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0")
        }
      >
        <div className="overflow-hidden">
          <div
            className={
              "transition-all duration-300 ease-out " +
              (isMobileSearchOpen
                ? "translate-y-0 scale-100"
                : "-translate-y-2 scale-[0.98]")
            }
          >
            <Input
              placeholder="Buscar requisições, pacientes..."
              leftIcon={<Search className="h-5 w-5" />}
              inputSize="sm"
              autoFocus={isMobileSearchOpen}
              className="border-slate-300 bg-slate-50 text-sm text-slate-700 focus:border-slate-400 focus:bg-white focus:ring-slate-100"
            />
          </div>
        </div>
      </div>

      <div
        className={
          "fixed inset-0 z-40 md:hidden transition-opacity duration-300 " +
          (isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0")
        }
      >
        <div
          className="absolute inset-0 bg-slate-950/45"
          onClick={handleCloseMobileMenu}
        />

        <aside
          className={
            "absolute inset-x-0 top-0 flex h-screen w-full flex-col overflow-y-auto bg-neutral-white text-primary-darker shadow-2xl transition-transform duration-300 ease-out " +
            (isMobileMenuOpen ? "translate-x-0" : "translate-x-full")
          }
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-8 flex items-center justify-between border-b border-neutral-300 py-3 px-6">
            <Image
              src="/images/brand/infinityfy-blue-logo.png"
              alt="infinityfy Logo"
              width={61}
              height={24}
            />

            <div className="flex items-center gap-3">
              <button
                onClick={handleCloseMobileMenu}
                aria-label="Fechar menu"
                className="rounded-lg p-1 text-primary-darker transition-colors hover:bg-neutral-white/15"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex h-full flex-col px-6 pb-4">
            <nav className="flex flex-1 flex-col gap-2">
              {mobileUpperLinks.map((item) => {
                const hasChildren =
                  Array.isArray(item.children) && item.children.length > 0;

                if (hasChildren) {
                  const childActive = item.children!.some((c) =>
                    c.href
                      ? pathname === c.href ||
                      (c.href !== "/dashboard" &&
                        pathname.startsWith(c.href + "/"))
                      : false,
                  );

                  const isOpen = openMobileAccordion === item.label;

                  return (
                    <Fragment key={item.label}>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMobileAccordion((prev) =>
                            prev === item.label ? null : item.label,
                          )
                        }
                        className={
                          "flex items-center gap-3 px-3 py-3 text-xs border-l-2 transition-colors w-full mobile-l:text-lg " +
                          (childActive
                            ? "bg-primary-light text-primary-main font-semibold border-l-primary-main"
                            : "text-primary-darker hover:bg-neutral-white/10  border-l-transparent font-normal hover:text-primary-main hover:border-l-primary-main")
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
                        />
                      </button>

                      {isOpen && (
                        <div className="flex flex-col">
                          {item.children!.map((child) => {
                            const isActive =
                              child.href === undefined
                                ? false
                                : pathname === child.href ||
                                (child.href !== "/dashboard" &&
                                  pathname.startsWith(child.href + "/"));
                            return (
                              <Link
                                key={child.href ?? child.label}
                                href={(child.href ?? "#") as string}
                                onClick={handleCloseMobileMenu}
                                className={
                                  "flex items-center gap-3 px-3 py-3 text-xs border-l-2 transition-colors w-full mobile-l:text-lg pl-10 " +
                                  (isActive
                                    ? "bg-primary-light text-primary-main font-semibold border-l-primary-main"
                                    : "text-primary-darker hover:bg-neutral-white/10  border-l-transparent font-normal hover:text-primary-main hover:border-l-primary-main")
                                }
                              >
                                <child.icon className="h-5 w-5" />
                                <span>{child.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </Fragment>
                  );
                }

                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href + "/"));
                return (
                  <Link
                    key={item.href ?? item.label}
                    href={(item.href ?? "#") as string}
                    onClick={handleCloseMobileMenu}
                    className={
                      "flex items-center gap-3 px-3 py-3 text-xs border-l-2 transition-colors w-full mobile-l:text-lg " +
                      (isActive
                        ? "bg-primary-light text-primary-main font-semibold border-l-primary-main"
                        : "text-primary-darker hover:bg-neutral-white/10  border-l-transparent font-normal hover:text-primary-main hover:border-l-primary-main")
                    }
                  >
                    <item.icon className={`h-5 w-5`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-neutral-200 pt-4">
              <nav className="flex flex-col gap-2">
                {mobileLowerLinks.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href + "/"));
                  return (
                    <Link
                      key={item.href ?? item.label}
                      href={(item.href ?? "#") as string}
                      onClick={handleCloseMobileMenu}
                      className={
                        "flex items-center gap-3 px-3 py-3 text-xs border-l-2 transition-colors w-full mobile-l:text-lg " +
                        (isActive
                          ? "bg-primary-light text-primary-main font-semibold border-l-primary-main"
                          : "text-primary-darker hover:bg-neutral-white/10  border-l-transparent font-normal hover:text-primary-main hover:border-l-primary-main")
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>

                      {item.label == "Orion - AI" && (
                        <span className="inline-flex items-center rounded-full bg-bg-ai-badge px-2 py-0.5 text-xs font-medium text-ai-badge">
                          NOVO
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3 py-3 text-xs text-primary-darker transition-colors hover:bg-neutral-white/10 hover:text-primary-main border-l-2 border-l-transparent hover:border-l-primary-main font-normal mobile-l:text-lg"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>

              <div>
                <p className="pl-10 py-2 text-xs text-neutral-700 mobile-l:text-sm">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
}
