"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { useFilterStore } from "@/lib/store";
import { UF, PorUFData } from "@/lib/types";

const GEO_URL = "/maps/brazil-states.json";

function getChoroColor(pct: number | undefined, isSelected: boolean): string {
  if (isSelected) return "#6366f1";
  if (pct === undefined) return "#334155";
  if (pct < 35) return "#dc2626";
  if (pct < 42) return "#f97316";
  if (pct < 49) return "#64748b";
  if (pct < 57) return "#22c55e";
  return "#10b981";
}

function getChoroHoverColor(pct: number | undefined, isSelected: boolean): string {
  if (isSelected) return "#818cf8";
  if (pct === undefined) return "#475569";
  if (pct < 35) return "#ef4444";
  if (pct < 42) return "#fb923c";
  if (pct < 49) return "#94a3b8";
  if (pct < 57) return "#4ade80";
  return "#34d399";
}

interface MapaBrasilProps {
  porUF: PorUFData;
}

export function MapaBrasil({ porUF }: MapaBrasilProps) {
  const { uf, setUF } = useFilterStore();
  const [hoveredInfo, setHoveredInfo] = useState<{ nome: string; sigla: string } | null>(null);
  const [clickedInfo, setClickedInfo] = useState<{ nome: string; sigla: string } | null>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showClickTooltip(nome: string, sigla: string) {
    if (clickTimer.current) clearTimeout(clickTimer.current);
    setClickedInfo({ nome, sigla });
    clickTimer.current = setTimeout(() => setClickedInfo(null), 5000);
  }

  function dismissClickTooltip() {
    if (clickTimer.current) clearTimeout(clickTimer.current);
    setClickedInfo(null);
  }

  const hoveredUFData = hoveredInfo ? porUF.ufs[hoveredInfo.sigla] : null;
  const clickedUFData = clickedInfo ? porUF.ufs[clickedInfo.sigla] : null;

  return (
    <div className="relative w-full">
      {/* Legenda coroplética */}
      <div className="absolute bottom-2 left-2 z-10 pointer-events-none flex flex-col gap-1">
        <span className="text-[10px] text-slate-500 font-medium">Taxa de soltura</span>
        <div className="flex items-center gap-1">
          {[
            { label: "<35%", color: "#dc2626" },
            { label: "35–42%", color: "#f97316" },
            { label: "42–49%", color: "#64748b" },
            { label: "49–57%", color: "#22c55e" },
            { label: ">57%", color: "#10b981" },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-0.5">
              <span
                className="inline-block w-3 h-3 rounded-sm border border-slate-700"
                style={{ backgroundColor: color }}
              />
              <span className="text-[9px] text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hover tooltip — nome + taxa, sem link */}
      {hoveredInfo && !clickedInfo && (
        <div className="absolute top-2 left-2 rounded-lg bg-slate-800 border border-slate-600 px-3 py-2 text-xs text-slate-200 z-10 pointer-events-none flex flex-col gap-1">
          <div className="font-semibold">{hoveredInfo.nome}</div>
          {hoveredUFData?.headlines?.taxa_soltura_pct !== undefined ? (
            <div className="text-slate-400">
              Taxa de soltura:{" "}
              <span className="text-emerald-400 font-medium">
                {hoveredUFData.headlines.taxa_soltura_pct}%
              </span>
            </div>
          ) : (
            <div className="text-slate-500">Dado indisponível</div>
          )}
          <span className="text-slate-600 italic">Clique para ver detalhes</span>
        </div>
      )}

      {/* Click tooltip — fixo por 5s, com link */}
      {clickedInfo && (
        <div className="absolute top-2 left-2 rounded-lg bg-slate-800 border border-indigo-700/60 px-3 py-2 text-xs text-slate-200 z-20 flex flex-col gap-1.5 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold">{clickedInfo.nome}</span>
            <button
              onClick={dismissClickTooltip}
              className="text-slate-500 hover:text-slate-300 leading-none"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>
          {clickedUFData?.headlines?.taxa_soltura_pct !== undefined ? (
            <div className="text-slate-400">
              Taxa de soltura:{" "}
              <span className="text-emerald-400 font-medium">
                {clickedUFData.headlines.taxa_soltura_pct}%
              </span>
            </div>
          ) : (
            <div className="text-slate-500">Dado indisponível</div>
          )}
          <Link
            href={`/estados/${clickedInfo.sigla.toLowerCase()}`}
            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
          >
            Ver página do estado →
          </Link>
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [-54, -15], scale: 800 }}
        style={{ width: "100%", height: "100%" }}
        height={400}
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const sigla: UF = geo.properties?.sigla ?? geo.properties?.UF_05;
                const isSelected = uf === sigla;
                const ufData = porUF.ufs[sigla];
                const taxaSoltura = ufData?.headlines?.taxa_soltura_pct;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      if (sigla) {
                        const nome =
                          geo.properties?.NM_ESTADO ||
                          geo.properties?.nome ||
                          sigla;
                        if (isSelected) {
                          setUF("BR");
                          dismissClickTooltip();
                        } else {
                          setUF(sigla);
                          showClickTooltip(nome, sigla);
                        }
                      }
                    }}
                    onMouseEnter={() => {
                      const nome =
                        geo.properties?.NM_ESTADO ||
                        geo.properties?.nome ||
                        sigla;
                      setHoveredInfo({ nome, sigla });
                    }}
                    onMouseLeave={() => setHoveredInfo(null)}
                    style={{
                      default: {
                        fill: getChoroColor(taxaSoltura, isSelected),
                        stroke: "#0f172a",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: "pointer",
                      },
                      hover: {
                        fill: getChoroHoverColor(taxaSoltura, isSelected),
                        stroke: "#0f172a",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#4f46e5",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
