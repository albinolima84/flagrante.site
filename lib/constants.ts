import { UF } from "./types";

export const ANO_INICIO_DEFAULT = 2015;
export const ANO_FIM_DEFAULT = 2025;
export const SERIES_BREAK_YEAR = 2024;

export const UF_LIST: { sigla: UF; nome: string }[] = [
  { sigla: "BR", nome: "Brasil (nacional)" },
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "TO", nome: "Tocantins" },
];

export const CHART_COLORS = {
  solto: "#10b981",
  preso: "#ef4444",
  domiciliar: "#f59e0b",
  sistac: "#6366f1",
  bnmp: "#0ea5e9",
  neutro: "#94a3b8",
  quebra: "#f97316",
};

export const FONTES = [
  {
    nome: "BNMP 3.0 — Banco Nacional de Monitoramento de Prisões",
    url: "https://bnmp.cnj.jus.br",
    cobertura: "Agosto/2024 → presente",
  },
  {
    nome: "SISTAC / Boletins CNJ — Sistema de Audiências de Custódia",
    url: "https://www.cnj.jus.br/sistema-carcerario/audiencia-de-custodia/dados-estatisticos/",
    cobertura: "Fevereiro/2015 → julho/2024",
  },
];
