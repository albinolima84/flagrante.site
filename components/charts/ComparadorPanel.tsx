"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { PorUFData, NacionalData, DecisaoItem, TipoPenalItem } from "@/lib/types";
import { UF } from "@/lib/types";
import { UF_LIST } from "@/lib/constants";

const DecisaoDonut = dynamic(
  () => import("./DecisaoDonut").then((m) => ({ default: m.DecisaoDonut })),
  { ssr: false, loading: () => <ChartSkeleton h="h-72" /> }
);

const TiposPenaisBar = dynamic(
  () => import("./TiposPenaisBar").then((m) => ({ default: m.TiposPenaisBar })),
  { ssr: false, loading: () => <ChartSkeleton h="h-72" /> }
);

function ChartSkeleton({ h = "h-72" }: { h?: string }) {
  return <div className={`${h} w-full rounded-lg bg-slate-800/50 animate-pulse`} />;
}

const UF_OPTIONS = UF_LIST.filter((u) => u.sigla !== "BR");
const VALID_UFS = new Set(UF_OPTIONS.map((u) => u.sigla));

function isValidUF(s: string): s is UF {
  return VALID_UFS.has(s as UF);
}

// ── Coluna de um estado ──────────────────────────────────────────────────────

function EstadoColuna({
  sigla,
  nome,
  decisoes,
  tiposPenais,
  taxa,
  total,
  taxaNacional,
  accentColor,
}: {
  sigla: UF;
  nome: string;
  decisoes: DecisaoItem[];
  tiposPenais: TipoPenalItem[];
  taxa?: number;
  total?: number;
  taxaNacional: number;
  accentColor: string;
}) {
  const diff = taxa !== undefined ? taxa - taxaNacional : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Cabeçalho */}
      <div
        className="rounded-xl border bg-slate-900 p-4 flex flex-col gap-3"
        style={{ borderColor: `${accentColor}55` }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className="text-xs font-mono font-semibold"
              style={{ color: accentColor }}
            >
              {sigla}
            </p>
            <h3 className="text-base font-semibold text-white mt-0.5">{nome}</h3>
          </div>
          <Link
            href={`/estados/${sigla.toLowerCase()}`}
            className="text-xs text-slate-500 hover:text-indigo-400 transition-colors whitespace-nowrap"
          >
            Ver página →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-800 p-3">
            <p className="text-xs text-slate-500">Taxa de soltura</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {taxa !== undefined ? `${taxa}%` : "—"}
            </p>
            {diff !== null && (
              <p
                className={`text-xs mt-0.5 ${
                  diff >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {diff >= 0 ? "+" : ""}
                {diff} p.p. vs. nacional
              </p>
            )}
          </div>
          <div className="rounded-lg bg-slate-800 p-3">
            <p className="text-xs text-slate-500">Total audiências</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {total !== undefined ? total.toLocaleString("pt-BR") : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Decisões */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h4 className="text-sm font-medium text-slate-300 mb-2">Decisões</h4>
        <DecisaoDonut dados={decisoes} label={sigla} />
      </div>

      {/* Tipos penais */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h4 className="text-sm font-medium text-slate-300 mb-2">Tipos penais</h4>
        <TiposPenaisBar dados={tiposPenais} />
      </div>
    </div>
  );
}

// ── Painel principal ─────────────────────────────────────────────────────────

interface ComparadorPanelProps {
  porUF: PorUFData;
  nacional: NacionalData;
}

export function ComparadorPanel({ porUF, nacional }: ComparadorPanelProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [ufA, setUfA] = useState<UF>("SP");
  const [ufB, setUfB] = useState<UF>("RJ");
  const [ready, setReady] = useState(false);

  // Init from URL params
  useEffect(() => {
    const a = searchParams.get("a")?.toUpperCase() ?? "";
    const b = searchParams.get("b")?.toUpperCase() ?? "";
    if (isValidUF(a)) setUfA(a as UF);
    if (isValidUF(b)) setUfB(b as UF);
    setReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync URL
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams({ a: ufA, b: ufB });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [ready, ufA, ufB]); // eslint-disable-line react-hooks/exhaustive-deps

  const nomeA = UF_LIST.find((u) => u.sigla === ufA)?.nome ?? ufA;
  const nomeB = UF_LIST.find((u) => u.sigla === ufB)?.nome ?? ufB;
  const dataA = porUF.ufs[ufA];
  const dataB = porUF.ufs[ufB];
  const taxaA = dataA?.headlines?.taxa_soltura_pct;
  const taxaB = dataB?.headlines?.taxa_soltura_pct;
  const taxaNacional = nacional.headlines.taxa_soltura_pct;
  const mesmoEstado = ufA === ufB;

  return (
    <div className="flex flex-col gap-6">
      {/* Seletores */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 p-4">
        <select
          value={ufA}
          onChange={(e) => setUfA(e.target.value as UF)}
          className="rounded-lg border border-indigo-700/60 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {UF_OPTIONS.map((u) => (
            <option key={u.sigla} value={u.sigla}>
              {u.sigla} — {u.nome}
            </option>
          ))}
        </select>

        <span className="text-slate-500 font-semibold text-sm px-1">vs</span>

        <select
          value={ufB}
          onChange={(e) => setUfB(e.target.value as UF)}
          className="rounded-lg border border-sky-700/60 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          {UF_OPTIONS.map((u) => (
            <option key={u.sigla} value={u.sigla}>
              {u.sigla} — {u.nome}
            </option>
          ))}
        </select>

        {mesmoEstado && (
          <span className="text-amber-400 text-xs ml-1">
            Selecione dois estados diferentes.
          </span>
        )}
      </div>

      {/* Barra de comparação visual */}
      {!mesmoEstado && taxaA !== undefined && taxaB !== undefined && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 flex flex-col gap-3">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Taxa de soltura — comparação direta
          </p>

          {[
            { sigla: ufA, nome: nomeA, taxa: taxaA, color: "#818cf8" },
            { sigla: ufB, nome: nomeB, taxa: taxaB, color: "#38bdf8" },
          ].map(({ sigla, nome, taxa, color }) => (
            <div key={sigla} className="flex items-center gap-3">
              <span className="w-7 text-xs font-mono font-semibold text-right" style={{ color }}>
                {sigla}
              </span>
              <div className="flex-1 h-6 bg-slate-800 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${taxa}%`, backgroundColor: color, opacity: 0.75 }}
                />
              </div>
              <span className="w-10 text-sm font-bold tabular-nums text-right" style={{ color }}>
                {taxa}%
              </span>
            </div>
          ))}

          {/* Linha da média nacional */}
          <div className="flex items-center gap-3">
            <span className="w-7 text-[10px] text-slate-600 text-right font-mono">BR</span>
            <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full bg-slate-500 opacity-50"
                style={{ width: `${taxaNacional}%` }}
              />
            </div>
            <span className="w-10 text-xs text-slate-500 tabular-nums text-right">
              {taxaNacional}%
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            {taxaA > taxaB
              ? `${nomeA} solta ${(taxaA - taxaB)} p.p. a mais que ${nomeB}.`
              : taxaB > taxaA
              ? `${nomeB} solta ${(taxaB - taxaA)} p.p. a mais que ${nomeA}.`
              : "Ambos têm a mesma taxa de soltura."}
            {" "}
            Média nacional: {taxaNacional}%.
          </p>
        </div>
      )}

      {/* Colunas side-by-side */}
      {!mesmoEstado && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EstadoColuna
            sigla={ufA}
            nome={nomeA}
            decisoes={dataA?.decisoes ?? nacional.decisoes}
            tiposPenais={dataA?.tipos_penais ?? nacional.tipos_penais}
            taxa={taxaA}
            total={dataA?.headlines?.total_audiencias}
            taxaNacional={taxaNacional}
            accentColor="#818cf8"
          />
          <EstadoColuna
            sigla={ufB}
            nome={nomeB}
            decisoes={dataB?.decisoes ?? nacional.decisoes}
            tiposPenais={dataB?.tipos_penais ?? nacional.tipos_penais}
            taxa={taxaB}
            total={dataB?.headlines?.total_audiencias}
            taxaNacional={taxaNacional}
            accentColor="#38bdf8"
          />
        </div>
      )}
    </div>
  );
}
