import Link from "next/link";

import type { IUser } from "@/shared/types/user";
import { Card } from "@/components/ui/Card";


interface IUserCardProps {
  user: IUser;
}

export function UserCard({ user }: IUserCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <Link
            href={`/usuarios/${user.id}`}
            className="block text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2"
          >
            {user.name}
          </Link>
        </div>
        {user.roleProfile?.name && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">
            {user.roleProfile.name}
          </span>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-4 text-sm text-slate-500">
        <div>
          <dt className="font-medium text-slate-400">Email</dt>
          <dd className="text-slate-900">{user.email}</dd>
        </div>

      </dl>

    </Card>
  );
}
