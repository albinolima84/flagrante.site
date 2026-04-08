// ─── Data shapes ────────────────────────────────────────────────────────────

export type FonteSerie = "sistac" | "bnmp" | "misto";

export interface PontoSerie {
  ano: number;
  total_audiencias: number;
  pct_solto: number;
  pct_preso: number;
  fonte: FonteSerie;
  nota?: string;
}

export interface AnotacaoSerie {
  ano: number;
  label: string;
  descricao: string;
}

export interface SerieHistoricaData {
  fonte: string;
  ultima_atualizacao: string;
  nota_quebra_serie: string;
  ano_quebra: number;
  serie: PontoSerie[];
  anotacoes: AnotacaoSerie[];
}

export interface DecisaoItem {
  tipo: string;
  pct: number;
  cor: string;
}

export interface TipoPenalItem {
  tipo: string;
  pct: number;
  cor: string;
}

export interface HeadlineData {
  total_audiencias: number;
  total_audiencias_label: string;
  taxa_soltura_pct: number;
  relatos_tortura_pct: number;
  relatos_tortura_abs: number;
  audiencias_presenciais_pct: number;
  nota_presenciais: string;
}

export interface NacionalData {
  fonte: string;
  ultima_atualizacao: string;
  headlines: HeadlineData;
  decisoes: DecisaoItem[];
  tipos_penais: TipoPenalItem[];
}

export interface CategoriaDemo {
  categoria: string;
  pct: number;
}

export interface PerfilDemograficoData {
  fonte: string;
  ultima_atualizacao: string;
  nota: string;
  sexo: CategoriaDemo[];
  faixa_etaria: CategoriaDemo[];
  raca_cor: CategoriaDemo[] | null;
  raca_cor_pct_preenchido?: number;
  escolaridade: CategoriaDemo[] | null;
  escolaridade_pct_preenchido?: number;
  estado_civil: CategoriaDemo[] | null;
  estado_civil_pct_preenchido?: number;
}

export interface UFData {
  decisoes?: DecisaoItem[];
  tipos_penais?: TipoPenalItem[];
  headlines?: Partial<HeadlineData>;
}

export interface PorUFData {
  fonte: string;
  ultima_atualizacao: string | null;
  nota: string;
  disponivel: boolean;
  ufs: Record<string, UFData | null>;
}

// ─── Filter state ────────────────────────────────────────────────────────────

export type UF =
  | "BR"
  | "AC" | "AL" | "AM" | "AP" | "BA" | "CE" | "DF" | "ES" | "GO"
  | "MA" | "MG" | "MS" | "MT" | "PA" | "PB" | "PE" | "PI" | "PR"
  | "RJ" | "RN" | "RO" | "RR" | "RS" | "SC" | "SE" | "SP" | "TO";

export interface FilterState {
  uf: UF;
  anoInicio: number;
  anoFim: number;
  setUF: (uf: UF) => void;
  setAnoInicio: (ano: number) => void;
  setAnoFim: (ano: number) => void;
  reset: () => void;
}
