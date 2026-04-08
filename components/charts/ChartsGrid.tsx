"use client";

import dynamic from "next/dynamic";
import { NacionalData, SerieHistoricaData, PerfilDemograficoData, PorUFData } from "@/lib/types";
import { UFSelector } from "@/components/filters/UFSelector";
import { PeriodoSelector } from "@/components/filters/PeriodoSelector";
import { SeriesBreakBanner } from "@/components/ui/SeriesBreakBanner";
import { DataQualityBadge } from "@/components/ui/DataQualityBadge";
import { FonteCitation } from "@/components/ui/FonteCitation";
import { useFilterStore } from "@/lib/store";

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
  const uf = useFilterStore((s) => s.uf);
  const isNacional = uf === "BR";

  // If UF is selected but data isn't available, fall back to national data
  const decisoes = isNacional
    ? nacional.decisoes
    : (porUF.ufs[uf]?.decisoes ?? nacional.decisoes);

  const tiposPenais = isNacional
    ? nacional.tipos_penais
    : (porUF.ufs[uf]?.tipos_penais ?? nacional.tipos_penais);

  const showUFFallback = !isNacional && porUF.ufs[uf] === null;

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
      </div>

      {/* Decisões + Tipos penais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Decisões nas audiências"
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
        title="Mapa por estado"
        fonte={{
          nome: "CNJ / BNMP 3.0",
          url: "https://bnmp.cnj.jus.br",
          cobertura: "Ago/2024–presente",
        }}
      >
        <p className="text-xs text-slate-500">
          Clique em um estado para filtrar o painel.
          {!porUF.disponivel && " Dados por UF disponíveis em breve."}
        </p>
        <MapaBrasil disponivel={porUF.disponivel} />
      </SectionCard>

      {/* Perfil demográfico */}
      <SectionCard
        title="Perfil do custodiado"
        badge={
          <DataQualityBadge
            mensagem="Raça/escolaridade: >50% sem preenchimento — disponíveis no Sprint 2"
            nivel="aviso"
          />
        }
        fonte={{
          nome: "CNJ / BNMP 3.0",
          url: "https://bnmp.cnj.jus.br",
          cobertura: "Ago/2024–presente",
        }}
      >
        <PerfilDemografico
          sexo={perfilDemografico.sexo}
          faixaEtaria={perfilDemografico.faixa_etaria}
        />
      </SectionCard>
    </div>
  );
}
