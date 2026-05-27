"use client";

import { cn } from "@/lib/utils";

interface ISkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "card" | "text" | "circle";
}

export function Skeleton({
  className,
  variant = "text",
  ...props
}: ISkeletonProps) {
  const variantClasses = {
    card: "h-32 rounded-lg",
    text: "h-4 rounded",
    circle: "h-10 w-10 rounded-full",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}

interface ISkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
}

export function SkeletonCard({ className, lines = 3 }: ISkeletonCardProps) {
  return (
    <div className={cn("space-y-4 p-4", className)}>
      <Skeleton variant="circle" className="h-12 w-12" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-8 w-1/2" />
      </div>
      <div className="space-y-2 pt-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={i === lines - 1 ? "h-4 w-2/3" : "h-4"} />
        ))}
      </div>
    </div>
  );
}

interface ISkeletonListProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  height?: string;
}

export function SkeletonList({
  className,
  count = 3,
  height = "h-24",
}: ISkeletonListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cn("w-full rounded-lg", height)} />
      ))}
    </div>
  );
}
