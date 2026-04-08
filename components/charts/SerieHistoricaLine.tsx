"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { PontoSerie, AnotacaoSerie } from "@/lib/types";
import { CHART_COLORS, SERIES_BREAK_YEAR } from "@/lib/constants";
import { useFilterStore } from "@/lib/store";

interface SerieHistoricaLineProps {
  serie: PontoSerie[];
  anotacoes: AnotacaoSerie[];
}

export function SerieHistoricaLine({ serie, anotacoes }: SerieHistoricaLineProps) {
  const { anoInicio, anoFim } = useFilterStore();

  const filtrada = serie.filter((p) => p.ano >= anoInicio && p.ano <= anoFim);

  // Split into two datasets: sistac (sólido) and bnmp (tracejado)
  // For points marked "misto", include in both series
  const dadosSistac = filtrada.map((p) =>
    p.fonte === "bnmp"
      ? { ...p, pct_solto: undefined }
      : p
  );
  const dadosBnmp = filtrada.map((p) =>
    p.fonte === "sistac"
      ? { ...p, pct_solto: undefined }
      : p
  );

  const temQuebra =
    anoInicio <= SERIES_BREAK_YEAR && anoFim >= SERIES_BREAK_YEAR;

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={filtrada}
          margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            vertical={false}
          />
          <XAxis
            dataKey="ano"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={[30, 55]}
          />
          <Tooltip
            formatter={(value, name) =>
              value !== undefined ? [`${value}%`, name] : ["-", name]
            }
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#f1f5f9",
            }}
            labelStyle={{ color: "#94a3b8" }}
          />
          <Legend
            formatter={(value) => (
              <span className="text-slate-300 text-sm">{value}</span>
            )}
          />

          {/* Anotações verticais */}
          {anotacoes
            .filter((a) => a.ano >= anoInicio && a.ano <= anoFim && a.ano !== SERIES_BREAK_YEAR)
            .map((a) => (
              <ReferenceLine
                key={a.ano}
                x={a.ano}
                stroke="#475569"
                strokeDasharray="4 2"
                label={{
                  value: a.label,
                  position: "top",
                  fill: "#64748b",
                  fontSize: 10,
                }}
              />
            ))}

          {/* Área da quebra de série */}
          {temQuebra && (
            <ReferenceArea
              x1={SERIES_BREAK_YEAR - 0.5}
              x2={SERIES_BREAK_YEAR + 0.5}
              fill={CHART_COLORS.quebra}
              fillOpacity={0.15}
              label={{
                value: "Quebra de série",
                position: "insideTop",
                fill: CHART_COLORS.quebra,
                fontSize: 10,
              }}
            />
          )}

          {/* Linha SISTAC (sólida) */}
          <Line
            data={dadosSistac}
            type="monotone"
            dataKey="pct_solto"
            name="% soltura (SISTAC)"
            stroke={CHART_COLORS.sistac}
            strokeWidth={2}
            dot={{ r: 3, fill: CHART_COLORS.sistac }}
            connectNulls={false}
            activeDot={{ r: 5 }}
          />

          {/* Linha BNMP (tracejada) */}
          <Line
            data={dadosBnmp}
            type="monotone"
            dataKey="pct_solto"
            name="% soltura (BNMP 3.0)"
            stroke={CHART_COLORS.bnmp}
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={{ r: 3, fill: CHART_COLORS.bnmp }}
            connectNulls={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
