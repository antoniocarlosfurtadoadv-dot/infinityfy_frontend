import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";
import clsx from "clsx";
import { cn } from "@/lib/utils";

// ─── TableContainer ────────────────────────────────────────────────────────────

interface ITableContainerProps {
  children: ReactNode;
  className?: string;
}

export function TableContainer({ children, className }: ITableContainerProps) {
  return (
    <div
      className={cn(
        "overflow-hidden ",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── TableScrollArea ──────────────────────────────────────────────────────────
// Wraps the <table> to allow horizontal scroll on smaller screens without
// breaking the container's rounded corners.

interface ITableScrollAreaProps {
  children: ReactNode;
  className?: string;
}

export function TableScrollArea({ children, className }: ITableScrollAreaProps) {
  return (
    <div className={clsx("overflow-x-auto", className)}>
      {children}
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

interface ITableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: ITableProps) {
  return (
    <table className={clsx("min-w-full divide-y divide-slate-100", className)}>
      {children}
    </table>
  );
}

// ─── TableHead ────────────────────────────────────────────────────────────────

interface ITableHeadProps {
  children: ReactNode;
  className?: string;
}

export function TableHead({ children, className }: ITableHeadProps) {
  return (
    <thead className={clsx("bg-slate-50", className)}>
      {children}
    </thead>
  );
}

// ─── TableBody ────────────────────────────────────────────────────────────────

interface ITableBodyProps {
  children: ReactNode;
  className?: string;
}

export function TableBody({ children, className }: ITableBodyProps) {
  return (
    <tbody className={clsx("divide-y divide-slate-100", className)}>
      {children}
    </tbody>
  );
}

// ─── TableRow ─────────────────────────────────────────────────────────────────

interface ITableRowProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function TableRow({ children, className, hoverable = false, onClick }: ITableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={clsx(
        "transition-colors",
        hoverable && "cursor-pointer hover:bg-slate-50",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </tr>
  );
}

// ─── TableHeadCell ────────────────────────────────────────────────────────────

interface ITableHeadCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export function TableHeadCell({
  children,
  className,
  align = "left",
  ...props
}: ITableHeadCellProps) {
  return (
    <th
      scope="col"
      className={clsx(
        "px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

// ─── TableCell ────────────────────────────────────────────────────────────────

interface ITableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  noWrap?: boolean;
}

export function TableCell({
  children,
  className,
  align = "left",
  noWrap = true,
  ...props
}: ITableCellProps) {
  return (
    <td
      className={clsx(
        "px-6 py-4",
        noWrap && "whitespace-nowrap",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

// ─── TableEmpty ───────────────────────────────────────────────────────────────

interface ITableEmptyProps {
  colSpan: number;
  message?: string;
  className?: string;
}

export function TableEmpty({
  colSpan,
  message = "Nenhum resultado encontrado.",
  className,
}: ITableEmptyProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={clsx("px-6 py-12 text-center text-sm text-slate-500", className)}
      >
        {message}
      </td>
    </tr>
  );
}
