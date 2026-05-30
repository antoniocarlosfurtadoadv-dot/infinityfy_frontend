import type { LucideIcon } from "lucide-react";

import {
  LayoutDashboard,
  User,
  SlidersVertical,
  LogsIcon,
  BellIcon,
  ShieldCheck,
} from "lucide-react";

import { Permission } from "@/shared/types/permission";

export type SidebarSection = "upper" | "lower";

export interface ISidebarItem {
  id: string;

  label: string;

  href?: string;

  icon: LucideIcon;

  section: SidebarSection;

  /**
   * Se existir, significa que esse item é filho de outro item
   */
  parentId?: string;

  /**
   * null = visível para qualquer usuário autenticado
   */
  permissions?: Permission[] | null;

  /**
   * Ordenação opcional
   */
  order?: number;
}

export interface ISidebarLink {
  id: string;

  label: string;

  href?: string;

  icon: LucideIcon;

  children?: ISidebarLink[];
}

/**
 * TODOS os itens ficam em uma lista única
 */
export const sidebarItems: ISidebarItem[] = [
  // ======================================================
  // DASHBOARD
  // ======================================================

  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    section: "upper",
    permissions: [
      Permission.DASHBOARD_VISUALIZAR_OPERACIONAL,
      Permission.DASHBOARD_VISUALIZAR_FINANCEIRO,
    ],
  },



  // ======================================================
  // ACESSOS
  // ======================================================

  {
    id: "acessos",
    label: "Acessos",
    icon: ShieldCheck,
    section: "upper",
    permissions: [
      Permission.GESTAO_GERENCIAR_PERFIS,
      Permission.GESTAO_GERENCIAR_USUARIOS,
    ],
  },

  {
    id: "perfis",
    label: "Perfis",
    href: "/perfis",
    icon: ShieldCheck,
    section: "upper",
    parentId: "acessos",
    permissions: [Permission.GESTAO_GERENCIAR_PERFIS],
  },

  {
    id: "usuarios",
    label: "Usuários",
    href: "/usuarios",
    icon: User,
    section: "upper",
    parentId: "acessos",
    permissions: [Permission.GESTAO_GERENCIAR_USUARIOS],
  },







  // ======================================================
  // SISTEMA
  // ======================================================

  {
    id: "sistema",
    label: "Sistema",
    icon: SlidersVertical,
    section: "upper",
    permissions: [
      Permission.GESTAO_VISUALIZAR_LOGS,
      Permission.GESTAO_RECEBER_NOTIFICACOES,
    ],
  },

  {
    id: "settings",
    label: "Configurações",
    href: "/settings",
    icon: SlidersVertical,
    section: "upper",
    parentId: "sistema",
    permissions: [
      Permission.GESTAO_VISUALIZAR_LOGS,
      Permission.GESTAO_RECEBER_NOTIFICACOES,
    ],
  },

  {
    id: "logs",
    label: "Logs",
    href: "/logs",
    icon: LogsIcon,
    section: "upper",
    parentId: "sistema",
    permissions: [Permission.GESTAO_VISUALIZAR_LOGS],
  },

  // ======================================================
  // NOTIFICAÇÕES
  // ======================================================

  {
    id: "notificacoes",
    label: "Notificações",
    href: "/notificacoes",
    icon: BellIcon,
    section: "upper",
    permissions: [Permission.GESTAO_RECEBER_NOTIFICACOES],
  },

];

/**
 * Verifica se usuário pode visualizar item
 */
function canAccess(
  item: ISidebarItem,
  userPermissions: string[],
): boolean {
  return (
    item.permissions === null ||
    item.permissions === undefined ||
    item.permissions.some((permission) => userPermissions.includes(permission))
  );
}

/**
 * Constrói árvore automaticamente
 */
function buildSidebarTree(items: ISidebarItem[]): ISidebarLink[] {
  const map = new Map<string, ISidebarLink>();

  items.forEach((item) => {
    map.set(item.id, {
      id: item.id,
      label: item.label,
      href: item.href,
      icon: item.icon,
      children: [],
    });
  });

  const roots: ISidebarLink[] = [];

  items.forEach((item) => {
    const currentItem = map.get(item.id)!;

    if (item.parentId) {
      const parent = map.get(item.parentId);

      if (parent) {
        parent.children ??= [];
        parent.children.push(currentItem);
      }
    } else {
      roots.push(currentItem);
    }
  });

  return roots;
}

/**
 * Sidebar final já filtrada
 */
export function buildSidebar(
  userPermissions: string[],
) {
  const visibleItems = sidebarItems.filter((item) =>
    canAccess(item, userPermissions),
  );

  const upperItems = visibleItems.filter((item) => item.section === "upper");

  const lowerItems = visibleItems.filter((item) => item.section === "lower");

  return {
    upper: buildSidebarTree(upperItems),

    lower: buildSidebarTree(lowerItems),
  };
}
