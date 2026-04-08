"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { DecisaoItem, TipoPenalItem } from "@/lib/types";
import { FonteCitation } from "@/components/ui/FonteCitation";

const DecisaoDonut = dynamic(
  () => import("./DecisaoDonut").then((m) => ({ default: m.DecisaoDonut })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const TiposPenaisBar = dynamic(
  () => import("./TiposPenaisBar").then((m) => ({ default: m.TiposPenaisBar })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

function ChartSkeleton() {
  return <div className="h-72 w-full rounded-lg bg-slate-800/50 animate-pulse" />;
}

function SectionCard({
  title,
  children,
  fonte,
}: {
  title: string;
  children: React.ReactNode;
  fonte?: { nome: string; url: string; cobertura?: string };
}) {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900 p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
      {children}
      {fonte && (
        <FonteCitation nome={fonte.nome} url={fonte.url} cobertura={fonte.cobertura} />
      )}
    </section>
  );
}

interface EstadoPanelProps {
  decisoes: DecisaoItem[];
  tiposPenais: TipoPenalItem[];
}

export function EstadoPanel({ decisoes, tiposPenais }: EstadoPanelProps) {
  const fonte = {
    nome: "CNJ / BNMP 3.0",
    url: "https://bnmp.cnj.jus.br",
    cobertura: "Ago/2024–presente",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Decisões nas audiências" fonte={fonte}>
          <DecisaoDonut dados={decisoes} />
        </SectionCard>
        <SectionCard title="Tipos penais mais frequentes" fonte={fonte}>
          <TiposPenaisBar dados={tiposPenais} />
        </SectionCard>
      </div>

      <div className="text-center pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:border-indigo-600 hover:text-indigo-400 transition-colors"
        >
          ← Ver painel nacional completo
        </Link>
      </div>
    </div>
  );
}
