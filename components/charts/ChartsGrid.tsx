"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { NacionalData, SerieHistoricaData, PerfilDemograficoData, PorUFData } from "@/lib/types";
import { UFSelector } from "@/components/filters/UFSelector";
import { PeriodoSelector } from "@/components/filters/PeriodoSelector";
import { SeriesBreakBanner } from "@/components/ui/SeriesBreakBanner";
import { DataQualityBadge } from "@/components/ui/DataQualityBadge";
import { FonteCitation } from "@/components/ui/FonteCitation";
import { useFilterStore } from "@/lib/store";
import { ANO_INICIO_DEFAULT, ANO_FIM_DEFAULT } from "@/lib/constants";

// All chart components are loaded client-only to avoid SSR/hydration issues
// (Recharts and react-simple-maps both access window)
const DecisaoDonut = dynamic(
  () => import("./DecisaoDonut").then((m) => ({ default: m.DecisaoDonut })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const TiposPenaisBar = dynamic(
  () => import("./TiposPenaisBar").then((m) => ({ default: m.TiposPenaisBar })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const SerieHistoricaLine = dynamic(
  () =>
    import("./SerieHistoricaLine").then((m) => ({
      default: m.SerieHistoricaLine,
    })),
  { ssr: false, loading: () => <ChartSkeleton h="h-80" /> }
);

const MapaBrasil = dynamic(
  () => import("./MapaBrasil").then((m) => ({ default: m.MapaBrasil })),
  { ssr: false, loading: () => <ChartSkeleton h="h-96" /> }
);

const PerfilDemografico = dynamic(
  () =>
    import("./PerfilDemografico").then((m) => ({
      default: m.PerfilDemografico,
    })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

function ChartSkeleton({ h = "h-72" }: { h?: string }) {
  return (
    <div
      className={`${h} w-full rounded-lg bg-slate-800/50 animate-pulse`}
    />
  );
}

function SectionCard({
  title,
  children,
  badge,
  fonte,
}: {
  title: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
  fonte?: { nome: string; url: string; cobertura?: string };
}) {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900 p-6 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
        {badge}
      </div>
      {children}
      {fonte && (
        <FonteCitation
          nome={fonte.nome}
          url={fonte.url}
          cobertura={fonte.cobertura}
        />
      )}
    </section>
  );
}

interface ChartsGridProps {
  nacional: NacionalData;
  serieHistorica: SerieHistoricaData;
  perfilDemografico: PerfilDemograficoData;
  porUF: PorUFData;
}

export function ChartsGrid({
  nacional,
  serieHistorica,
  perfilDemografico,
  porUF,
}: ChartsGridProps) {
  const { uf, anoInicio, anoFim } = useFilterStore();
  const isNacional = uf === "BR";
  const isPeriodoDefault = anoInicio === ANO_INICIO_DEFAULT && anoFim === ANO_FIM_DEFAULT;

  // If UF is selected but data isn't available, fall back to national data
  const decisoes = isNacional
    ? nacional.decisoes
    : (porUF.ufs[uf]?.decisoes ?? nacional.decisoes);

  const tiposPenais = isNacional
    ? nacional.tipos_penais
    : (porUF.ufs[uf]?.tipos_penais ?? nacional.tipos_penais);

  const showUFFallback = !isNacional && porUF.ufs[uf] === null;

  // Period-filtered stats derived from serie historica
  const periodoSerie = serieHistorica.serie.filter(
    (p) => p.ano >= anoInicio && p.ano <= anoFim
  );
  const periodoTotalAuds = periodoSerie.reduce((s, p) => s + p.total_audiencias, 0);
  const periodoAvgSoltura =
    periodoTotalAuds > 0
      ? Math.round(
          (periodoSerie.reduce((s, p) => s + p.pct_solto * p.total_audiencias, 0) /
            periodoTotalAuds) *
            10
        ) / 10
      : null;

  const periodoLabel =
    anoInicio === anoFim ? `${anoInicio}` : `${anoInicio}–${anoFim}`;

  const aggregateBadge = !isPeriodoDefault ? (
    <span className="rounded-full bg-slate-800 border border-slate-600 px-2 py-0.5 text-[10px] text-slate-500">
      Dados agregados · não filtrável por período
    </span>
  ) : undefined;

  return (
    <div className="flex flex-col gap-8">
      {/* Filtros globais */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-700 bg-slate-900 p-4">
        <UFSelector />
        <PeriodoSelector />
        {showUFFallback && (
          <DataQualityBadge
            mensagem={`Dados para ${uf} indisponíveis — exibindo visão nacional`}
            nivel="info"
          />
        )}
        {!isNacional && (
          <Link
            href={`/estados/${uf.toLowerCase()}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-700/50 bg-indigo-950/40 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:border-indigo-500 hover:text-indigo-300 transition-colors"
          >
            Ver página de {uf} →
          </Link>
        )}
        {/* Period stats summary */}
        {!isPeriodoDefault && periodoAvgSoltura !== null && (
          <div className="ml-auto flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs">
            <span className="text-slate-500">Período selecionado</span>
            <span className="font-semibold text-slate-200">{periodoLabel}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">
              Média soltura:{" "}
              <span className="text-emerald-400 font-medium">{periodoAvgSoltura}%</span>
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">
              ~{(periodoTotalAuds / 1000).toFixed(0)} mil audiências
            </span>
          </div>
        )}
      </div>

      {/* Decisões + Tipos penais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Decisões nas audiências"
          badge={aggregateBadge}
          fonte={{
            nome: "CNJ / SISTAC + BNMP 3.0",
            url: "https://www.cnj.jus.br/sistema-carcerario/audiencia-de-custodia/dados-estatisticos/",
            cobertura: "2015–2025",
          }}
        >
          <DecisaoDonut dados={decisoes} />
        </SectionCard>

        <SectionCard
          title="Tipos penais mais frequentes"
          badge={aggregateBadge}
          fonte={{
            nome: "CNJ / SISTAC + BNMP 3.0",
            url: "https://www.cnj.jus.br/sistema-carcerario/audiencia-de-custodia/dados-estatisticos/",
            cobertura: "2015–2025",
          }}
        >
          <TiposPenaisBar dados={tiposPenais} />
        </SectionCard>
      </div>

      {/* Série histórica */}
      <SectionCard
        title="Série histórica — taxa de soltura (%)"
        fonte={{
          nome: "CNJ / SISTAC (2015–2024) + BNMP 3.0 (ago/2024–presente)",
          url: "https://www.cnj.jus.br/sistema-carcerario/audiencia-de-custodia/dados-estatisticos/",
        }}
      >
        <SeriesBreakBanner />
        <SerieHistoricaLine
          serie={serieHistorica.serie}
          anotacoes={serieHistorica.anotacoes}
        />
      </SectionCard>

      {/* Mapa */}
      <SectionCard
        title="Mapa por estado — taxa de soltura (%)"
        fonte={{
          nome: "CNJ / BNMP 3.0",
          url: "https://bnmp.cnj.jus.br",
          cobertura: "Ago/2024–presente",
        }}
      >
        <p className="text-xs text-slate-500">
          Clique em um estado para filtrar o painel. Cores indicam a taxa de soltura: vermelho = baixa, verde = alta.
        </p>
        <MapaBrasil porUF={porUF} />
      </SectionCard>

      {/* Perfil demográfico */}
      <SectionCard
        title="Perfil do custodiado"
        fonte={{
          nome: "CNJ / BNMP 3.0",
          url: "https://bnmp.cnj.jus.br",
          cobertura: "Ago/2024–presente",
        }}
      >
        <PerfilDemografico
          sexo={perfilDemografico.sexo}
          faixaEtaria={perfilDemografico.faixa_etaria}
          racaCor={perfilDemografico.raca_cor}
          racaCorPctPreenchido={perfilDemografico.raca_cor_pct_preenchido}
          escolaridade={perfilDemografico.escolaridade}
          escolaridadePctPreenchido={perfilDemografico.escolaridade_pct_preenchido}
          estadoCivil={perfilDemografico.estado_civil}
          estadoCivilPctPreenchido={perfilDemografico.estado_civil_pct_preenchido}
        />
      </SectionCard>
    </div>
  );
}
