import { UF_LIST } from "@/lib/constants";
import Link from "next/link";

interface PageProps {
  params: Promise<{ uf: string }>;
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center">
      <p className="text-slate-500 text-sm uppercase tracking-wider mb-2">
        Página em construção
      </p>
      <h1 className="text-3xl font-bold text-white mb-4">
        {estado?.nome ?? sigla}
      </h1>
      <p className="text-slate-400 max-w-md mx-auto mb-8">
        Os dados por estado estarão disponíveis no Sprint 2, após consolidação
        do BNMP 3.0. Use o seletor de UF no painel principal para filtrar por
        estado quando os dados estiverem prontos.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
      >
        ← Ir para o painel nacional
      </Link>
    </div>
  );
}
