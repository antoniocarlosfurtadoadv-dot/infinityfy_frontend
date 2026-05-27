"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const buttonBase =
  " inline-flex h-8 w-8 p-1 items-center justify-center rounded-sm border border-neutral-300 bg-white text-primary-main transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 ";

interface IPaginateProps {
  totalRegisters?: number;
  registersPrePage?: number;
  register?: number;
  currentPage?: number;
  perPage?: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export function Paginate({
  onPageChange,
  totalRegisters = 0,
  currentPage = 1,
  registersPrePage = 10,
  perPage,
  register: _register = registersPrePage,
  itemLabel: _itemLabel = "itens",
}: IPaginateProps) {
  const lastPage = perPage || Math.ceil(totalRegisters / registersPrePage);

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= lastPage;

  return (
    <div className="flex flex-row items-center justify-between gap-4 border-t border-neutral-300 pt-4">
      <p className="flex flex-col gap-1 text-sm text-neutral-600">
        <span className="block">
          Página {currentPage} de {lastPage}
        </span>
        <span className="block">{totalRegisters} resultados</span>
      </p>

      <div className="flex items-center gap-5 self-center sm:self-auto">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          aria-label="Página anterior"
          className={buttonBase}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <p className="text-sm font-normal text-neutral-700">
          {currentPage} de {lastPage}
        </p>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          aria-label="Próxima página"
          className={buttonBase}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPrevious,
  onNext,
  onPageChange,
  className,
}: IPaginationProps) {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const handlePrevious = () => {
    if (isFirstPage) {
      return;
    }

    onPrevious();
    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (isLastPage) {
      return;
    }

    onNext();
    onPageChange(currentPage + 1);
  };

  return (
    <div
      className={[
        "flex flex-row border-t border-t-[#DBDDE1] pt-2 justify-between items-center ",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-1 text-neutral-600 ">
        <p className="text-xs ">
          Página {currentPage} de {totalPages}
        </p>
        <p className="text-sm">{totalItems} resultados</p>
      </div>

      <div className="flex items-center sm:self-auto">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isFirstPage}
          aria-label="Página anterior"
          className={buttonBase}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <p className="text-sm font-normal text-neutral-700">
          {currentPage} de {totalPages}
        </p>

        <button
          type="button"
          onClick={handleNext}
          disabled={isLastPage}
          aria-label="Próxima página"
          className={buttonBase}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
