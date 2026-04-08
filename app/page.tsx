import nacionalData from "@/data/static/nacional.json";
import serieHistoricaData from "@/data/static/serie-historica.json";
import perfilDemograficoData from "@/data/static/perfil-demografico.json";
import porUFData from "@/data/static/por-uf.json";
import { MetricCard } from "@/components/ui/MetricCard";
import { ChartsGrid } from "@/components/charts/ChartsGrid";
import type {
  NacionalData,
  SerieHistoricaData,
  PerfilDemograficoData,
  PorUFData,
} from "@/lib/types";

// Cast imported JSONs to typed interfaces
const nacional = nacionalData as NacionalData;
const serieHistorica = serieHistoricaData as SerieHistoricaData;
const perfilDemografico = perfilDemograficoData as PerfilDemograficoData;
const porUF = porUFData as PorUFData;

export default function Home() {
  const h = nacional.headlines;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col gap-8">
      {/* Page intro */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Audiências de Custódia no Brasil
        </h1>
        <p className="mt-1 text-slate-400 text-sm max-w-2xl">
          Painel público com dados consolidados do CNJ sobre audiências de
          custódia realizadas desde 2015. Atualizado com base nos boletins
          SISTAC e no BNMP 3.0.
        </p>
      </div>

      {/* Metric cards — national headlines */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total de audiências"
          value={h.total_audiencias_label}
          sub="Desde fev/2015"
        />
        <MetricCard
          label="Taxa de soltura"
          value={`${h.taxa_soltura_pct}%`}
          sub="Série histórica 2015–2025"
        />
        <MetricCard
          label="Relatos de tortura"
          value={`${h.relatos_tortura_pct}%`}
          sub={`~${h.relatos_tortura_abs.toLocaleString("pt-BR")} casos registrados`}
          highlight
        />
        <MetricCard
          label="Audiências presenciais"
          value={`${h.audiencias_presenciais_pct}%`}
          sub={h.nota_presenciais}
        />
      </div>

      {/* Charts — client boundary */}
      <ChartsGrid
        nacional={nacional}
        serieHistorica={serieHistorica}
        perfilDemografico={perfilDemografico}
        porUF={porUF}
      />
    </div>
  );
}
