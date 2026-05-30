"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/core/utils/formatters";
import { usePersistedFilters } from "@/core/hooks/usePersistedFilters";
import { SkeletonList } from "@/components/LoadingState";
import { Button } from "@/components/ui/Button";
import { Paginate } from "@/components/Pagination";
import type { IUserListParams } from "../_services/user.service";
import { useUserList } from "../_hooks/useUserList";
import {
  TableContainer,
  TableScrollArea,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
} from "@/components/ui/Table";
import { StatusBadge } from "../_utils/user-utils";

interface IUsersListProps {
  title?: string;
}

const USER_FILTER_KEYS = ["name", "roleProfileId"];

export function UsersList({ title = "Usuários" }: IUsersListProps) {
  const searchParams = useSearchParams();
  usePersistedFilters("users-filters", USER_FILTER_KEYS);
  const filters: IUserListParams = {
    name: searchParams.get("name") || undefined,
    roleProfileId: searchParams.get("roleProfileId") || undefined,
    status: searchParams.get("status") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
  };

  const { data, isLoading, error, refetch } = useUserList(filters);

  const users = data?.data ?? [];



  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        </div>
        <SkeletonList count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-500">Erro ao carregar usuários.</p>
        <Button onClick={() => void refetch()}>Tentar novamente</Button>
      </div>
    );
  }



  return (
    <div className="space-y-6">


      <TableContainer>
        {/* Desktop table */}
        <TableScrollArea className="hidden md:block">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Nome</TableHeadCell>
                <TableHeadCell>Email</TableHeadCell>
                <TableHeadCell>Perfil</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Criado em</TableHeadCell>
                <TableHeadCell align="right">Ações</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hoverable>
                  <TableCell>
                    <Link
                      href={`/usuarios/${user.id}`}
                      className="text-sm font-medium text-slate-900 hover:text-primary-main transition-colors"
                    >
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{user.email}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{user.roleProfile?.name}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-500">{formatDate(user.createdAt)}</span>
                  </TableCell>
                  <TableCell align="right">
                    <Link
                      href={`/usuarios/${user.id}`}
                      className="text-sm font-medium text-primary-main hover:text-primary-main transition-colors"
                    >
                      Ver detalhes
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableScrollArea>

        {/* Mobile list */}
        <ul className="divide-y divide-slate-100 md:hidden">
          {users.map((user) => (
            <li key={user.id}>
              <Link
                href={`/usuarios/${user.id}`}
                className="flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                  <div className="mt-1">
                    <StatusBadge status={user.status} />
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">

                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
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
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.pushState({}, "", newUrl);
          void refetch();
        }}
        totalRegisters={data?.total}
        currentPage={data?.currentPage}
        register={data?.data.length}
        registersPrePage={data?.limit}
        itemLabel="usuários"
      />

    </div>
  );
}
