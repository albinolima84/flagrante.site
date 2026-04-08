"use client";

import { useState } from "react";
import Link from "next/link";
import { PorUFData } from "@/lib/types";
import { UF_LIST } from "@/lib/constants";

type SortKey = "taxa_soltura_pct" | "total_audiencias" | "diff";
type SortDir = "asc" | "desc";


function choroColor(pct: number): string {
  if (pct < 35) return "#dc2626";
  if (pct < 42) return "#f97316";
  if (pct < 49) return "#64748b";
  if (pct < 57) return "#22c55e";
  return "#10b981";
}

interface RankingEstadosProps {
  porUF: PorUFData;
  taxaNacional: number;
}

export function RankingEstados({ porUF, taxaNacional }: RankingEstadosProps) {
  const [sortKey, setSortKey] = useState<SortKey>("taxa_soltura_pct");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [busca, setBusca] = useState("");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const termo = busca.trim().toLowerCase();

  const rows = UF_LIST.filter((u) => u.sigla !== "BR")
    .filter((u) =>
      !termo ||
      u.sigla.toLowerCase().includes(termo) ||
      u.nome.toLowerCase().includes(termo)
    )
    .map((u) => {
      const data = porUF.ufs[u.sigla];
      const taxa = data?.headlines?.taxa_soltura_pct ?? null;
      const total = data?.headlines?.total_audiencias ?? null;
      const diff = taxa !== null ? taxa - taxaNacional : null;
      return { sigla: u.sigla, nome: u.nome, taxa, total, diff };
    })
    .sort((a, b) => {
      const av = a[sortKey === "diff" ? "diff" : sortKey === "taxa_soltura_pct" ? "taxa" : "total"] ?? -Infinity;
      const bv = b[sortKey === "diff" ? "diff" : sortKey === "taxa_soltura_pct" ? "taxa" : "total"] ?? -Infinity;
      return sortDir === "desc" ? (bv as number) - (av as number) : (av as number) - (bv as number);
    });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="text-slate-700 ml-1">↕</span>;
    return <span className="text-indigo-400 ml-1">{sortDir === "desc" ? "↓" : "↑"}</span>;
  }

  function Th({
    col,
    children,
    className = "",
  }: {
    col: SortKey;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <th
        className={`px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:text-slate-200 transition-colors whitespace-nowrap ${className}`}
        onClick={() => handleSort(col)}
      >
        {children}
        <SortIcon col={col} />
      </th>
    );
  }

  return (
    <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2">
      <input
        type="search"
        placeholder="Buscar estado…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="w-48 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      {termo && (
        <span className="text-xs text-slate-500">
          {rows.length} estado{rows.length !== 1 ? "s" : ""} encontrado{rows.length !== 1 ? "s" : ""}
        </span>
      )}
    </div>
    <div className="overflow-x-auto rounded-lg border border-slate-700">
      <table className="w-full text-sm">
        <thead className="bg-slate-800/60 border-b border-slate-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-10">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Estado
            </th>
            <Th col="taxa_soltura_pct">Taxa de soltura</Th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
              Faixa
            </th>
            <Th col="diff">vs. Nacional ({taxaNacional}%)</Th>
            <Th col="total_audiencias" className="hidden sm:table-cell">
              Total audiências
            </Th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {rows.map((row, i) => {
            const cor = row.taxa !== null ? choroColor(row.taxa) : "#334155";
            const diffPos = row.diff !== null && row.diff >= 0;

            return (
              <tr
                key={row.sigla}
                className="hover:bg-slate-800/40 transition-colors"
              >
                {/* Rank */}
                <td className="px-4 py-3 text-slate-600 font-mono text-xs">
                  {i + 1}
                </td>

                {/* Estado */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500 w-6">
                      {row.sigla}
                    </span>
                    <span className="text-slate-200">{row.nome}</span>
                  </div>
                </td>

                {/* Taxa */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-semibold tabular-nums"
                      style={{ color: cor }}
                    >
                      {row.taxa !== null ? `${row.taxa}%` : "—"}
                    </span>
                    {row.taxa !== null && (
                      <div className="hidden lg:block w-20 h-1.5 rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(row.taxa, 100)}%`,
                            backgroundColor: cor,
                            opacity: 0.7,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </td>

                {/* Faixa de cor */}
                <td className="px-4 py-3 hidden md:table-cell">
                  {row.taxa !== null && (
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `${cor}22`,
                        color: cor,
                        border: `1px solid ${cor}55`,
                      }}
                    >
                      {row.taxa < 35
                        ? "Muito baixa"
                        : row.taxa < 42
                        ? "Baixa"
                        : row.taxa < 49
                        ? "Média"
                        : row.taxa < 57
                        ? "Alta"
                        : "Muito alta"}
                    </span>
                  )}
                </td>

                {/* Diff vs Nacional */}
                <td className="px-4 py-3 tabular-nums">
                  {row.diff !== null ? (
                    <span
                      className={
                        diffPos ? "text-emerald-400" : "text-red-400"
                      }
                    >
                      {diffPos ? "+" : ""}
                      {row.diff} p.p.
                    </span>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>

                {/* Total */}
                <td className="px-4 py-3 text-slate-400 tabular-nums hidden sm:table-cell">
                  {row.total !== null
                    ? row.total.toLocaleString("pt-BR")
                    : "—"}
                </td>

                {/* Link */}
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/estados/${row.sigla.toLowerCase()}`}
                    className="text-xs text-indigo-500 hover:text-indigo-300 transition-colors whitespace-nowrap"
                  >
                    Ver →
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </div>
  );
}
