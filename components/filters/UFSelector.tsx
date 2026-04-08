"use client";

import { useFilterStore } from "@/lib/store";
import { UF_LIST } from "@/lib/constants";
import { UF } from "@/lib/types";

export function UFSelector() {
  const { uf, setUF } = useFilterStore();

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="uf-selector"
        className="text-sm text-slate-400 whitespace-nowrap"
      >
        Estado:
      </label>
      <select
        id="uf-selector"
        value={uf}
        onChange={(e) => setUF(e.target.value as UF)}
        className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        {UF_LIST.map((item) => (
          <option key={item.sigla} value={item.sigla}>
            {item.sigla === "BR" ? item.nome : `${item.sigla} — ${item.nome}`}
          </option>
        ))}
      </select>
    </div>
  );
}
