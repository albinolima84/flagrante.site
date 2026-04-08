"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CategoriaDemo } from "@/lib/types";

interface MiniBarProps {
  titulo: string;
  dados: CategoriaDemo[];
  cor: string;
  qualidadeAviso?: string;
}

function MiniBar({ titulo, dados, cor, qualidadeAviso }: MiniBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text-sm font-medium text-slate-300">{titulo}</h4>
        {qualidadeAviso && (
          <span className="rounded-full bg-amber-950/60 border border-amber-700/50 px-2 py-0.5 text-[10px] text-amber-400">
            {qualidadeAviso}
          </span>
        )}
      </div>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dados}
            margin={{ top: 4, right: 8, left: 0, bottom: 24 }}
          >
            <XAxis
              dataKey="categoria"
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              angle={-30}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, "Participação"]}
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f1f5f9",
                fontSize: 12,
              }}
              itemStyle={{ color: "#f1f5f9" }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Bar dataKey="pct" radius={[4, 4, 0, 0]} fill={cor}>
              {dados.map((_, i) => (
                <Cell key={i} fill={cor} fillOpacity={0.7 + (i / dados.length) * 0.3} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface PerfilDemograficoProps {
  sexo: CategoriaDemo[];
  faixaEtaria: CategoriaDemo[];
  racaCor?: CategoriaDemo[] | null;
  racaCorPctPreenchido?: number;
  escolaridade?: CategoriaDemo[] | null;
  escolaridadePctPreenchido?: number;
  estadoCivil?: CategoriaDemo[] | null;
  estadoCivilPctPreenchido?: number;
}

export function PerfilDemografico({
  sexo,
  faixaEtaria,
  racaCor,
  racaCorPctPreenchido,
  escolaridade,
  escolaridadePctPreenchido,
  estadoCivil,
  estadoCivilPctPreenchido,
}: PerfilDemograficoProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Linha 1: Sexo + Faixa etária */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MiniBar titulo="Por sexo" dados={sexo} cor="#6366f1" />
        <MiniBar titulo="Por faixa etária" dados={faixaEtaria} cor="#0ea5e9" />
      </div>

      {/* Linha 2: Raça/cor + Escolaridade */}
      {(racaCor || escolaridade) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {racaCor && (
            <MiniBar
              titulo="Por raça/cor"
              dados={racaCor}
              cor="#a78bfa"
              qualidadeAviso={
                racaCorPctPreenchido !== undefined
                  ? `${racaCorPctPreenchido}% dos registros preenchidos`
                  : undefined
              }
            />
          )}
          {escolaridade && (
            <MiniBar
              titulo="Por escolaridade"
              dados={escolaridade}
              cor="#f59e0b"
              qualidadeAviso={
                escolaridadePctPreenchido !== undefined
                  ? `${escolaridadePctPreenchido}% dos registros preenchidos`
                  : undefined
              }
            />
          )}
        </div>
      )}

      {/* Linha 3: Estado civil */}
      {estadoCivil && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <MiniBar
            titulo="Por estado civil"
            dados={estadoCivil}
            cor="#10b981"
            qualidadeAviso={
              estadoCivilPctPreenchido !== undefined
                ? `${estadoCivilPctPreenchido}% dos registros preenchidos`
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}
