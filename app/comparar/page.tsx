import { Suspense } from "react";
import type { Metadata } from "next";
import porUFData from "@/data/static/por-uf.json";
import nacionalData from "@/data/static/nacional.json";
import type { PorUFData, NacionalData } from "@/lib/types";
import { ComparadorPanel } from "@/components/charts/ComparadorPanel";

export const metadata: Metadata = {
  title: "Comparar estados — flagrante.site",
  description:
    "Compare dados de audiências de custódia entre dois estados brasileiros: taxa de soltura, decisões e tipos penais.",
};

const porUF = porUFData as PorUFData;
const nacional = nacionalData as NacionalData;

export default function ComparadorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Comparar estados</h1>
        <p className="mt-1 text-sm text-slate-400 max-w-2xl">
          Selecione dois estados para comparar taxa de soltura, decisões nas
          audiências e tipos penais mais frequentes. O link desta página pode
          ser compartilhado — os estados selecionados ficam na URL.
        </p>
      </div>

      <Suspense>
        <ComparadorPanel porUF={porUF} nacional={nacional} />
      </Suspense>
    </div>
  );
}
