"use client";

import Link from "next/link";
import { Bone, PawPrint, ShieldAlert } from "lucide-react";

interface IUnauthorizedStateProps {
  redirectTo?: string;
  onBack?: () => void;
}

export function UnauthorizedState({
  redirectTo = "/dashboard",
  onBack,
}: IUnauthorizedStateProps) {
  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden bg-gray-50 px-6 md:-m-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-16 text-gray-400 animate-bounce [animation-delay:0s]">
          <PawPrint width={28} height={28} />
        </div>
        <div className="absolute right-16 top-24 text-gray-400 animate-bounce [animation-delay:0.4s]">
          <PawPrint width={28} height={28} />
        </div>
        <div className="absolute bottom-10 left-10 text-gray-400 animate-bounce [animation-delay:0.8s]">
          <PawPrint width={28} height={28} />
        </div>
        <div className="absolute bottom-20 right-10 text-gray-400 animate-bounce [animation-delay:1.2s]">
          <PawPrint width={28} height={28} />
        </div>
        <div className="absolute left-1/2 top-10 -translate-x-1/2 text-gray-400 animate-pulse">
          <Bone width={28} height={28} />
        </div>
      </div>

      <div className="relative z-10 text-center">
        <div className="relative mx-auto w-fit">
          <div className="text-8xl drop-shadow-sm animate-bounce lg:hidden text-feedback-error-main">
            <ShieldAlert width={78} height={78} />
          </div>
          <div className="hidden text-8xl drop-shadow-sm animate-bounce lg:block text-feedback-error-main">
            <ShieldAlert width={96} height={96} />
          </div>
        </div>

        <h1 className="mt-6 text-6xl font-bold tracking-tight text-gray-900 sm:text-7xl">
          401
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-gray-700 sm:text-3xl">
          Acesso não autorizado
        </h2>

        <p className="mx-auto mt-3 max-w-md leading-relaxed text-gray-600">
          Você não tem permissão para acessar esta página com o perfil atual.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={redirectTo}
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg"
          >
            Voltar ao Dashboard
          </Link>

          <button
            type="button"
            onClick={onBack}
            className="inline-block rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-100 cursor-pointer"
          >
            Voltar
          </button>
        </div>

        <p className="mt-6 animate-pulse text-sm text-gray-400">
          Se você acredita que isso está incorreto, fale com um administrador.
        </p>
      </div>
    </div>
  );
}
