import { Sparkles } from "lucide-react";

export function SuccessStep() {
  return (
    <div className="w-full flex flex-col items-center gap-4 text-center py-6 md:py-10">
      <div className="flex items-center justify-center w-14 h-14">
        <Sparkles className="w-12 h-12 text-yellow-400" />
      </div>
      <h2 className="text-2xl font-semibold text-slate-900">Senha alterada!</h2>
      <p className="text-neutral-700 text-base max-w-[320px]">
        Senha alterada com sucesso. Acesse e comece a usar.
      </p>
    </div>
  );
}
