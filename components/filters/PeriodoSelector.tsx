"use client";

import { useFilterStore } from "@/lib/store";
import { ANO_INICIO_DEFAULT, ANO_FIM_DEFAULT } from "@/lib/constants";

const ANOS = Array.from(
  { length: ANO_FIM_DEFAULT - ANO_INICIO_DEFAULT + 1 },
  (_, i) => ANO_INICIO_DEFAULT + i
);

export function PeriodoSelector() {
  const { anoInicio, anoFim, setAnoInicio, setAnoFim } = useFilterStore();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-slate-400">Período:</span>
      <select
        value={anoInicio}
        onChange={(e) => {
          const v = Number(e.target.value);
          setAnoInicio(v);
          if (v > anoFim) setAnoFim(v);
        }}
        className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        aria-label="Ano início"
      >
        {ANOS.map((ano) => (
          <option key={ano} value={ano}>
            {ano}
          </option>
        ))}
      </select>
      <span className="text-slate-500">→</span>
      <select
        value={anoFim}
        onChange={(e) => {
          const v = Number(e.target.value);
          setAnoFim(v);
          if (v < anoInicio) setAnoInicio(v);
        }}
        className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        aria-label="Ano fim"
      >
        {ANOS.map((ano) => (
          <option key={ano} value={ano}>
            {ano}
          </option>
        ))}
      </select>
    </div>
  );
}
