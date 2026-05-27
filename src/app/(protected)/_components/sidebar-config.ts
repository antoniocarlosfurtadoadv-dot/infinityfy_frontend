import type { LucideIcon } from "lucide-react";

import {
  Hospital,
  LayoutDashboard,
  User,
  IdCardLanyard,
  SlidersVertical,
  Sparkles,
  LogsIcon,
  PawPrintIcon,
  FileSpreadsheetIcon,
  BellIcon,
  ShieldCheck,
  FlaskConical,
  Layers,
  ClipboardList,
  Receipt,
  Microscope,
  Cat,
} from "lucide-react";

import { Permission } from "@/shared/types/permission";
import type { IRoleProfile } from "@/shared/types/role-profile";

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
   * Restrição adicional por tipo de perfil
   */
  allowedRoleTypes?: IRoleProfile["type"][] | null;

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
  // REQUISIÇÕES
  // ======================================================

  {
    id: "requisicoes",
    label: "Requisições",
    href: "/requisicoes",
    icon: FileSpreadsheetIcon,
    section: "upper",
    permissions: [
      Permission.REQUISICOES_VISUALIZAR,
      Permission.REQUISICOES_GERENCIAR,
    ],
  },

  // ======================================================
  // PACIENTES
  // ======================================================

  {
    id: "pacientes",
    label: "Pacientes",
    href: "/pacientes",
    icon: PawPrintIcon,
    section: "upper",
    permissions: [
      Permission.PACIENTES_VISUALIZAR,
      Permission.PACIENTES_GERENCIAR,
    ],
  },

  // ======================================================
  // PARCEIROS
  // ======================================================

  {
    id: "parceiros",
    label: "Parceiros",
    icon: Hospital,
    section: "upper",
    permissions: [
      Permission.GESTAO_GERENCIAR_CLINICAS,
      Permission.VETERINARIOS_GERENCIAR,
    ],
  },

  {
    id: "clinicas",
    label: "Clínicas",
    href: "/clinicas",
    icon: Hospital,
    section: "upper",
    parentId: "parceiros",
    permissions: [Permission.GESTAO_GERENCIAR_CLINICAS],
  },

  {
    id: "veterinarios",
    label: "Veterinários",
    href: "/veterinarios",
    icon: IdCardLanyard,
    section: "upper",
    parentId: "parceiros",
    permissions: [Permission.VETERINARIOS_GERENCIAR],
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
  // LABORATÓRIO
  // ======================================================

  {
    id: "laboratorio",
    label: "Laboratório",
    icon: Microscope,
    section: "upper",
    permissions: [
      Permission.EXAMES_VISUALIZAR,
      Permission.EXAMES_GERENCIAR,
      Permission.GESTAO_GERENCIAR_CLINICAS,
    ],
    allowedRoleTypes: ["MASTER"],
  },

  {
    id: "exames",
    label: "Exames",
    href: "/exames",
    icon: Microscope,
    section: "upper",
    parentId: "laboratorio",
    permissions: [Permission.EXAMES_VISUALIZAR],
    allowedRoleTypes: ["MASTER"],
  },

  {
    id: "tipos-exames",
    label: "Tipos de Exame",
    href: "/tipos-exames",
    icon: ClipboardList,
    section: "upper",
    parentId: "laboratorio",
    permissions: [Permission.EXAMES_GERENCIAR],
    allowedRoleTypes: ["MASTER"],
  },

  {
    id: "tipos-material",
    label: "Tipos de Material",
    href: "/tipos-material",
    icon: FlaskConical,
    section: "upper",
    parentId: "laboratorio",
    permissions: [Permission.EXAMES_GERENCIAR],
    allowedRoleTypes: ["MASTER"],
  },

  {
    id: "tipos-recipiente",
    label: "Tipos de Recipiente",
    href: "/tipos-recipiente",
    icon: Layers,
    section: "upper",
    parentId: "laboratorio",
    permissions: [Permission.EXAMES_GERENCIAR],
    allowedRoleTypes: ["MASTER"],
  },

  {
    id: "especies",
    label: "Espécies",
    href: "/especies",
    icon: Cat,
    section: "upper",
    parentId: "laboratorio",
    permissions: [Permission.GESTAO_GERENCIAR_CLINICAS],
    allowedRoleTypes: ["MASTER"],
  },

  // ======================================================
  // FINANCEIRO
  // ======================================================

  {
    id: "financeiro",
    label: "Financeiro",
    icon: Receipt,
    section: "upper",
    permissions: [
      Permission.GESTAO_VISUALIZAR_TABELA_PRECOS,
      Permission.GESTAO_GERENCIAR_TABELA_PRECOS,
    ],
  },

  {
    id: "tabelas-preco",
    label: "Tabelas de Preço",
    href: "/tabelas-preco",
    icon: Receipt,
    section: "upper",
    parentId: "financeiro",
    permissions: [Permission.GESTAO_VISUALIZAR_TABELA_PRECOS],
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

  // ======================================================
  // LOWER
  // ======================================================

  {
    id: "orion",
    label: "Orion - AI",
    href: "/orion",
    icon: Sparkles,
    section: "lower",
    permissions: null,
  },

  {
    id: "settings-vet",
    label: "Configurações",
    href: "/settings",
    icon: SlidersVertical,
    section: "lower",
    permissions: null,
    allowedRoleTypes: ["VETERINARIAN"],
  },
];

/**
 * Verifica se usuário pode visualizar item
 */
function canAccess(
  item: ISidebarItem,
  userPermissions: string[],
  userRoleType: IRoleProfile["type"] | null,
): boolean {
  const permissionOk =
    item.permissions === null ||
    item.permissions === undefined ||
    item.permissions.some((permission) => userPermissions.includes(permission));

  const roleOk =
    item.allowedRoleTypes === null ||
    item.allowedRoleTypes === undefined ||
    (userRoleType !== null && item.allowedRoleTypes.includes(userRoleType));

  return permissionOk && roleOk;
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
  userRoleType: IRoleProfile["type"] | null,
) {
  const visibleItems = sidebarItems.filter((item) =>
    canAccess(item, userPermissions, userRoleType),
  );

  const upperItems = visibleItems.filter((item) => item.section === "upper");

  const lowerItems = visibleItems.filter((item) => item.section === "lower");

  return {
    upper: buildSidebarTree(upperItems),

    lower: buildSidebarTree(lowerItems),
  };
}
