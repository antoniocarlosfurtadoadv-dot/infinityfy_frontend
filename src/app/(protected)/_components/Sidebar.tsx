"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import clsx from "clsx";
import { Badge } from "@/components/ui/Badge";
import type { ISidebarLink } from "./sidebar-config";
import type { IUser } from "@/shared/types/user";
import { cn } from "@/lib/utils";

interface ISidebarProps {
  user: IUser;
  filteredLinks: ISidebarLink[];
  filteredLowerLinks: ISidebarLink[];
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onLinkClick: () => void;
  onLogout: () => void;
}

export function Sidebar({
  user,
  filteredLinks,
  filteredLowerLinks,
  isSidebarOpen,
  onToggleSidebar,
  onLinkClick,
  onLogout,
}: ISidebarProps) {
  const pathname = usePathname();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed px-6 py-8 inset-y-0 left-0 z-40 flex flex-col bg-background-white border-r border-neutral-200 transition-all duration-300 ease-in-out",
          "md:translate-x-0",
          isSidebarOpen
            ? "w-52 lg:w-63 translate-x-0"
            : "w-52 -translate-x-full md:w-16 lg:w-18 md:translate-x-0 items-center",
        )}
      >
        <div className="flex flex-col gap-11.5">
          {/* ── Header ─────────────────────────────────────────── */}
          <div
            className={clsx(
              "flex shrink-0 items-center",
              isSidebarOpen ? "h-10 gap-3 py-1" : "h-16 justify-center",
            )}
          >
            {isSidebarOpen ? (
              <Image
                src="/images/brand/infinityfy-blue-logo.png"
                alt="infinityfy Logo"
                width={82}
                height={32}
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-main text-xs font-black tracking-tight text-white shadow-lg shadow-indigo-500/25">
                AT
              </div>
            )}
          </div>

          {/* ── Navigation ─────────────────────────────────────── */}
          <nav
            className={clsx(
              "flex flex-1  flex-col overflow-x-hidden overflow-y-auto",
              isSidebarOpen ? "gap-2" : "items-center gap-0.5 px-2 w-11.5 ",
            )}
          >
            {filteredLinks.map((item) => {
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

                const isOpen = openAccordion === item.label;

                return (
                  <div key={item.label} className="w-full">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenAccordion((prev) =>
                          prev === item.label ? null : item.label,
                        )
                      }
                      title={!isSidebarOpen ? item.label : undefined}
                      aria-expanded={isOpen}
                      className={cn(
                        "group relative flex items-center gap-3 text-sm font-normal border-l-2 border-l-transparent transition-all duration-150 w-full px-3 py-2",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main",
                        "aria-[current=page]:border-l-primary-main",
                        childActive
                          ? "bg-primary-light text-primary-main font-semibold"
                          : "text-primary-darker hover:text-primary-main hover:border-l-primary-main",
                      )}
                    >
                      {childActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary-light" />
                      )}
                      <item.icon
                        className={cn(
                          "shrink-0 transition-colors",
                          isSidebarOpen ? "h-4.5 w-4.5" : "h-5 w-5",
                          childActive && !isSidebarOpen ? "mx-0.5 my-0.5" : "",
                          childActive
                            ? "text-primary-main"
                            : "text-primary-darker group-hover:text-primary-main",
                        )}
                      />
                      {isSidebarOpen && (
                        <span className="flex-1 truncate text-left">{item.label}</span>
                      )}
                      {isSidebarOpen && (
                        <ChevronRight
                          className={clsx(
                            "h-4 w-4 transition-transform",
                            isOpen ? "rotate-90" : "",
                          )}
                        />
                      )}
                    </button>

                    {isSidebarOpen && isOpen && (
                      <div className="flex flex-col gap-2">
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
                              onClick={onLinkClick}
                              title={child.label}
                              aria-current={isActive ? "page" : undefined}
                              className={cn(
                                "group relative flex items-center gap-3 text-sm font-normal border-l-2 border-l-transparent transition-all duration-150 pl-10 pd-3 py-2",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main",
                                "aria-[current=page]:border-l-primary-main",
                                isActive
                                  ? "bg-primary-light text-primary-main font-semibold"
                                  : "text-primary-darker hover:text-primary-main hover:border-l-primary-main",
                              )}
                            >
                              {isActive && (
                                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary-light" />
                              )}
                              <child.icon className="shrink-0 h-4.5 w-4.5 text-primary-darker group-hover:text-primary-main" />
                              <span className="flex-1 truncate">
                                {child.label}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive =
                item.href &&
                (pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href + "/")));
              return (
                <Link
                  key={item.href ?? item.label}
                  href={(item.href ?? "#") as string}
                  onClick={onLinkClick}
                  title={!isSidebarOpen ? item.label : undefined}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 text-sm font-normal border-l-2 border-l-transparent transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main",
                    "aria-[current=page]:border-l-primary-main",
                    isSidebarOpen
                      ? "w-full px-3 py-2"
                      : "w-11.5  justify-center py-2.5",
                    isActive
                      ? "bg-primary-light text-primary-main font-semibold"
                      : "text-primary-darker hover:text-primary-main hover:border-l-primary-main",
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary-light" />
                  )}
                  <item.icon
                    className={clsx(
                      "shrink-0 transition-colors",
                      isSidebarOpen ? "h-4.5 w-4.5" : "h-5 w-5",
                      isActive && !isSidebarOpen ? "mx-0.5 my-0.5" : "",
                      isActive
                        ? "text-primary-main"
                        : "text-primary-darker group-hover:text-primary-main",
                    )}
                  />
                  {isSidebarOpen && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── User + Logout footer ─────────────────────────────── */}
        <div
          className={clsx(
            "shrink-0 py-3 mt-auto",
            isSidebarOpen
              ? "space-y-0.5"
              : "flex flex-col items-center gap-1 px-2",
          )}
        >
          {/* User info */}
          <div
            className={clsx(
              "flex flex-col items-center text-primary-darker",
              isSidebarOpen ? "gap-2 pt-2 w-full" : "justify-center py-2",
            )}
          >
            {filteredLowerLinks.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href + "/"));
              return (
                <Link
                  key={item.href ?? item.label}
                  href={(item.href ?? "#") as string}
                  onClick={onLinkClick}
                  title={!isSidebarOpen ? item.label : undefined}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "group relative flex items-center gap-3 text-sm font-normal border-l-2 border-l-transparent transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main",
                    "aria-[current=page]:border-l-primary-main",
                    isSidebarOpen
                      ? "w-full px-3 py-2"
                      : "w-11.5 justify-center py-2.5",
                    isActive
                      ? "bg-primary-light text-primary-main font-semibold"
                      : "text-primary-darker hover:text-primary-main hover:border-l-primary-main",
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary-light" />
                  )}
                  <item.icon
                    className={clsx(
                      "shrink-0 transition-colors",
                      isSidebarOpen ? "h-4.5 w-4.5" : "h-5 w-5",
                      isActive && !isSidebarOpen ? "mx-0.5 my-0.5" : "",
                      isActive
                        ? "text-primary-main"
                        : "text-primary-darker group-hover:text-primary-main",
                    )}
                  />
                  {isSidebarOpen && (
                    <Badge
                      label={item.label}
                      showBadge={item.href === "/orion"}
                      className="bg-bg-ai-badge text-ai-badge"
                    />
                  )}
                </Link>
              );
            })}

            {/* Logout */}
            <button
              type="button"
              onClick={onLogout}
              title={!isSidebarOpen ? "Sair" : undefined}
              className={clsx(
                "group cursor-pointer flex items-center gap-2.5 text-sm border-l-2 border-l-transparent font-normal text-primary-darker transition-all duration-150",
                " hover:text-primary-main hover:border-l-primary-main ",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
                isSidebarOpen
                  ? "w-full px-3 py-2"
                  : "w-11.5 justify-center py-2",
              )}
            >
              <LogOut className="h-4.5 w-4.5 shrink-0 transition-transform group-hover:-translate-x-0.5" />
              {isSidebarOpen && <span>Sair</span>}
            </button>

            {isSidebarOpen && (
              <p className="text-center text-xs text-neutral-700">
                {user.email}
              </p>
            )}
          </div>
        </div>

        {/* ── Collapse toggle (desktop only) ───────────────────── */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Fechar sidebar" : "Abrir sidebar"}
          className="absolute -right-3 top-19 hidden p-1 min-h-6 min-w-6 items-center justify-center rounded-full bg-primary-main text-neutral-white shadow-md transition-colors md:flex hover:bg-primary-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main cursor-pointer"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={onToggleSidebar}
        />
      )}
    </>
  );
}
