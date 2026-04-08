import type { Metadata } from "next";
import Link from "next/link";
import { UF_LIST } from "@/lib/constants";
import porUFData from "@/data/static/por-uf.json";
import nacionalData from "@/data/static/nacional.json";
import type { PorUFData, NacionalData } from "@/lib/types";
import { EstadoPanel } from "@/components/charts/EstadoPanel";
import { MetricCard } from "@/components/ui/MetricCard";

const porUF = porUFData as PorUFData;
const nacional = nacionalData as NacionalData;

interface PageProps {
  params: Promise<{ uf: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { uf } = await params;
  const sigla = uf.toUpperCase();
  const estado = UF_LIST.find((u) => u.sigla === sigla);
  const ufData = porUF.ufs[sigla];
  const taxa = ufData?.headlines?.taxa_soltura_pct;
  const nome = estado?.nome ?? sigla;

  return {
    title: `${nome} — Audiências de Custódia | flagrante.site`,
    description: `Dados de audiências de custódia em ${nome}${taxa !== undefined ? `: taxa de soltura de ${taxa}%` : ""}. Decisões, tipos penais e comparação com a média nacional.`,
  };
}

export async function generateStaticParams() {
  return UF_LIST.filter((u) => u.sigla !== "BR").map((u) => ({
    uf: u.sigla.toLowerCase(),
  }));
}

export default async function EstadoPage({ params }: PageProps) {
  const { uf } = await params;
  const sigla = uf.toUpperCase();
  const estado = UF_LIST.find((u) => u.sigla === sigla);
  const ufData = porUF.ufs[sigla];

  // Fallback to national if UF data not available
  const decisoes = ufData?.decisoes ?? nacional.decisoes;
  const tiposPenais = ufData?.tipos_penais ?? nacional.tipos_penais;
  const taxaSoltura = ufData?.headlines?.taxa_soltura_pct;
  const totalAudiencias = ufData?.headlines?.total_audiencias;
  const taxaNacional = nacional.headlines.taxa_soltura_pct;

  const diffVsNacional =
    taxaSoltura !== undefined ? taxaSoltura - taxaNacional : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
          Audiências de Custódia
        </p>
        <h1 className="text-2xl font-bold text-white">
          {estado?.nome ?? sigla}
        </h1>
        <p className="text-sm text-slate-400 max-w-xl">
          Dados consolidados do CNJ para o estado de {estado?.nome ?? sigla}.
          Fonte principal: BNMP 3.0 (ago/2024–jan/2026).
        </p>
        <Link
          href={`/comparar?a=${sigla}`}
          className="mt-2 self-start inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-400 hover:border-indigo-600 hover:text-indigo-400 transition-colors"
        >
          ⇄ Comparar com outro estado
        </Link>
      </div>

      {/* Headline metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard
          label="Taxa de soltura"
          value={taxaSoltura !== undefined ? `${taxaSoltura}%` : "—"}
          sub={
            diffVsNacional !== null
              ? `${diffVsNacional >= 0 ? "+" : ""}${diffVsNacional} p.p. vs. nacional (${taxaNacional}%)`
              : "Dado indisponível"
          }
          highlight={diffVsNacional !== null && diffVsNacional < 0}
        />
        <MetricCard
          label="Total de audiências"
          value={
            totalAudiencias !== undefined
              ? totalAudiencias.toLocaleString("pt-BR")
              : "—"
          }
          sub="Série histórica 2015–2025"
        />
        <MetricCard
          label="Média nacional"
          value={`${taxaNacional}%`}
          sub="Taxa de soltura — Brasil"
        />
      </div>

      {/* Comparison bar */}
      {diffVsNacional !== null && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <p className="text-xs text-slate-500 mb-3">
            Comparação com a média nacional ({taxaNacional}%)
          </p>
          <div className="relative h-5 rounded-full bg-slate-800 overflow-hidden">
            {/* National baseline */}
            <div
              className="absolute top-0 h-full w-0.5 bg-slate-500 z-10"
              style={{ left: `${taxaNacional}%` }}
            />
            {/* UF bar */}
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
              style={{
                width: `${taxaSoltura}%`,
                backgroundColor:
                  diffVsNacional >= 0 ? "#22c55e" : "#ef4444",
                opacity: 0.7,
              }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-slate-600">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      )}

      {/* Charts */}
      <EstadoPanel decisoes={decisoes} tiposPenais={tiposPenais} />
    </div>
  );
}
