"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import { DecisaoItem } from "@/lib/types";
import { useFilterStore } from "@/lib/store";

interface DecisaoDonutProps {
  dados: DecisaoItem[];
}

const RADIAN = Math.PI / 180;

function renderCustomLabel(props: PieLabelRenderProps) {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
  } = props;

  // `pct` comes from the data entry — cast via unknown to access it
  const pct = (props as unknown as Record<string, unknown>)["pct"] as number | undefined;
  if (!pct || pct < 1) return null;

  const ir = Number(innerRadius);
  const or = Number(outerRadius);
  const radius = ir + (or - ir) * 0.5;
  const x = Number(cx) + radius * Math.cos(-Number(midAngle) * RADIAN);
  const y = Number(cy) + radius * Math.sin(-Number(midAngle) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
      fontWeight={700}
    >
      {`${pct.toFixed(1)}%`}
    </text>
  );
}

export function DecisaoDonut({ dados }: DecisaoDonutProps) {
  const uf = useFilterStore((s) => s.uf);

  const total = dados.reduce((acc, d) => acc + d.pct, 0);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dados}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            dataKey="pct"
            nameKey="tipo"
            labelLine={false}
            label={renderCustomLabel}
          >
            {dados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.cor} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              typeof value === "number" ? `${value.toFixed(1)}%` : `${value}%`,
              name,
            ]}
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#f1f5f9",
            }}
            itemStyle={{ color: "#f1f5f9" }}
            labelStyle={{ color: "#94a3b8" }}
          />
          <Legend
            formatter={(value) => (
              <span className="text-slate-300 text-sm">{value}</span>
            )}
          />
          {/* Center label */}
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#94a3b8"
            fontSize={12}
          >
            {uf === "BR" ? "Nacional" : uf}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
