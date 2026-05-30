"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePersistedFilters } from "@/core/hooks/usePersistedFilters";
import { SkeletonList } from "@/components/LoadingState";
import { Button } from "@/components/ui/Button";
import { Paginate } from "@/components/Pagination";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { IRoleProfileListParams } from "../_services/role-profile.service";
import { useRoleProfileList } from "../_hooks/useRoleProfileList";
import { useDeleteRoleProfile } from "../_hooks/useDeleteRoleProfile";
import {
  TableContainer,
  TableScrollArea,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
  TableEmpty,
} from "@/components/ui/Table";

const FILTER_KEYS = ["name"];

export function RoleProfileList() {
  const searchParams = useSearchParams();
  usePersistedFilters("perfis-filters", FILTER_KEYS);

  const { execute: deleteProfile, isLoading: isDeleting } = useDeleteRoleProfile();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filters: IRoleProfileListParams = {
    name: searchParams.get("name") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
  };

  const { data, isLoading, error, refetch } = useRoleProfileList(filters);
  const profiles = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonList count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-500">Erro ao carregar perfis de acesso.</p>
        <Button onClick={() => void refetch()}>Tentar novamente</Button>
      </div>
    );
  }

  if (!profiles.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
        <p className="text-lg font-semibold text-slate-900">Nenhum perfil encontrado</p>
        <p className="text-sm text-slate-500">
          Cadastre o primeiro perfil de acesso para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TableContainer>
        {/* Desktop */}
        <TableScrollArea className="hidden md:block">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Nome</TableHeadCell>
                <TableHeadCell>Descrição</TableHeadCell>
                <TableHeadCell align="center">Permissões</TableHeadCell>
                <TableHeadCell align="right">Ações</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profiles.length === 0 ? (
                <TableEmpty colSpan={4} message="Nenhum perfil encontrado." />
              ) : (
                profiles.map((profile) => (
                  <TableRow key={profile.id} hoverable>
                    <TableCell>
                      <Link
                        href={`/perfis/${profile.id}`}
                        className="text-sm font-medium text-slate-900 hover:text-primary-main transition-colors"
                      >
                        {profile.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-500">
                        {profile.description ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-sm text-slate-500">
                        {profile.defaultPermissions.length} permissões
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/perfis/${profile.id}`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          Ver
                        </Link>
                        <Link
                          href={`/perfis/${profile.id}/edit`}
                          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(profile.id)}
                          className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableScrollArea>

        {/* Mobile */}
        <ul className="divide-y divide-slate-100 md:hidden">
          {profiles.map((profile) => (
            <li key={profile.id}>
              <Link
                href={`/perfis/${profile.id}`}
                className="flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {profile.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {profile.defaultPermissions.length} permissões
                  </p>
                </div>
                <svg
                  className="h-4 w-4 shrink-0 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </TableContainer>

      <Paginate
        perPage={data ? Math.ceil(data.total / data.limit) : undefined}
        onPageChange={(page) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", String(page));
          window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);
          void refetch();
        }}
        totalRegisters={data?.total}
        currentPage={data?.currentPage}
        register={data?.data.length}
      />

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={async () => {
          if (confirmDeleteId) {
            await deleteProfile(confirmDeleteId);
            setConfirmDeleteId(null);
          }
        }}
        title="Excluir perfil"
        message="Tem certeza que deseja excluir este perfil de acesso? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
