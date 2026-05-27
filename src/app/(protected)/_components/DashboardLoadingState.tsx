export function DashboardLoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="mx-auto h-20 w-20 animate-spin rounded-full border-4 border-slate-200 border-t-primary-main" />
        <p className="text-sm text-slate-500">Preparando ambiente...</p>
      </div>
    </div>
  );
}
