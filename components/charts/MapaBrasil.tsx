"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { useFilterStore } from "@/lib/store";
import { UF } from "@/lib/types";

const GEO_URL = "/maps/brazil-states.json";

interface MapaBrasilProps {
  disponivel: boolean;
}

export function MapaBrasil({ disponivel }: MapaBrasilProps) {
  const { uf, setUF } = useFilterStore();
  const [hoveredUF, setHoveredUF] = useState<string | null>(null);

  return (
    <div className="relative w-full">
      {!disponivel && (
        <div className="absolute inset-0 flex items-end justify-center pb-4 z-10 pointer-events-none">
          <span className="rounded-full bg-slate-800/90 border border-slate-600 px-4 py-2 text-xs text-slate-400">
            Dados por UF disponíveis em breve (Sprint 2)
          </span>
        </div>
      )}

      {hoveredUF && (
        <div className="absolute top-2 left-2 rounded bg-slate-800 border border-slate-600 px-3 py-1.5 text-xs text-slate-200 z-10 pointer-events-none">
          <strong>{hoveredUF}</strong>
          {!disponivel && (
            <span className="ml-2 text-slate-500">Dados indisponíveis</span>
          )}
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
                const isHovered = hoveredUF === sigla;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      if (sigla) {
                        setUF(isSelected ? "BR" : sigla);
                      }
                    }}
                    onMouseEnter={() => {
                      const nome =
                        geo.properties?.NM_ESTADO ||
                        geo.properties?.nome ||
                        sigla;
                      setHoveredUF(nome);
                    }}
                    onMouseLeave={() => setHoveredUF(null)}
                    style={{
                      default: {
                        fill: isSelected ? "#6366f1" : "#334155",
                        stroke: "#1e293b",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: "pointer",
                      },
                      hover: {
                        fill: isSelected ? "#818cf8" : "#475569",
                        stroke: "#1e293b",
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
