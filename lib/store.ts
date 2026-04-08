import { create } from "zustand";
import { FilterState, UF } from "./types";
import { ANO_INICIO_DEFAULT, ANO_FIM_DEFAULT } from "./constants";

export const useFilterStore = create<FilterState>((set) => ({
  uf: "BR" as UF,
  anoInicio: ANO_INICIO_DEFAULT,
  anoFim: ANO_FIM_DEFAULT,

  setUF: (uf: UF) => set({ uf }),
  setAnoInicio: (anoInicio: number) => set({ anoInicio }),
  setAnoFim: (anoFim: number) => set({ anoFim }),
  reset: () =>
    set({ uf: "BR", anoInicio: ANO_INICIO_DEFAULT, anoFim: ANO_FIM_DEFAULT }),
}));
