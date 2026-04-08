import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dados abertos — flagrante.site",
  description:
    "Acesso direto aos datasets de audiências de custódia usados neste painel. Download em JSON, reutilização livre sob CC BY 4.0.",
};

const BASE_RAW =
  "https://raw.githubusercontent.com/albinolima84/flagrante.site/main/data/static";

const DATASETS = [
  {
    arquivo: "nacional.json",
    titulo: "Indicadores nacionais",
    descricao:
      "Headlines agregados (total de audiências, taxa de soltura, relatos de tortura), distribuição de decisões e tipos penais mais frequentes para o Brasil.",
    campos: [
      "headlines.total_audiencias",
      "headlines.taxa_soltura_pct",
      "headlines.relatos_tortura_pct",
      "decisoes[].tipo / pct",
      "tipos_penais[].tipo / pct",
    ],
  },
  {
    arquivo: "serie-historica.json",
    titulo: "Série histórica 2015–2025",
    descricao:
      "Taxa de soltura e total de audiências por ano desde fevereiro/2015. Inclui indicação de fonte (SISTAC ou BNMP 3.0) e anotações sobre eventos relevantes.",
    campos: [
      "serie[].ano",
      "serie[].total_audiencias",
      "serie[].pct_solto / pct_preso",
      "serie[].fonte  (sistac | bnmp | misto)",
      "anotacoes[].ano / label / descricao",
    ],
  },
  {
    arquivo: "por-uf.json",
    titulo: "Dados por estado (27 UFs)",
    descricao:
      "Taxa de soltura, total de audiências, decisões e tipos penais para cada um dos 27 estados brasileiros.",
    campos: [
      "ufs.XX.headlines.taxa_soltura_pct",
      "ufs.XX.headlines.total_audiencias",
      "ufs.XX.decisoes[].tipo / pct",
      "ufs.XX.tipos_penais[].tipo / pct",
    ],
  },
  {
    arquivo: "perfil-demografico.json",
    titulo: "Perfil demográfico do custodiado",
    descricao:
      "Distribuição por sexo, faixa etária, raça/cor, escolaridade e estado civil. Raça/cor e escolaridade têm indicador de percentual de preenchimento (campo *_pct_preenchido).",
    campos: [
      "sexo[].categoria / pct",
      "faixa_etaria[].categoria / pct",
      "raca_cor[].categoria / pct  (+raca_cor_pct_preenchido)",
      "escolaridade[].categoria / pct  (+escolaridade_pct_preenchido)",
      "estado_civil[].categoria / pct",
    ],
  },
];

function Code({ children }: { children: string }) {
  return (
    <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-emerald-400 font-mono">
      {children}
    </code>
  );
}

export default function DadosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold text-white mb-3">Dados abertos</h1>
        <p className="text-slate-400 leading-7">
          Todos os datasets usados neste painel estão disponíveis para download
          e reutilização. Os arquivos estão em JSON, hospedados no repositório
          público do projeto no GitHub. Licença:{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline"
          >
            CC BY 4.0
          </a>{" "}
          — cite a fonte como{" "}
          <em className="text-slate-300">flagrante.site / CNJ</em>.
        </p>
      </div>

      {/* Datasets */}
      <div className="flex flex-col gap-6">
        {DATASETS.map((ds) => (
          <section
            key={ds.arquivo}
            className="rounded-xl border border-slate-700 bg-slate-900 p-6 flex flex-col gap-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">{ds.titulo}</h2>
                <p className="text-sm text-slate-400 mt-1 max-w-xl">{ds.descricao}</p>
              </div>
              <a
                href={`${BASE_RAW}/${ds.arquivo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:border-indigo-500 hover:text-indigo-300 transition-colors whitespace-nowrap"
              >
                ↓ {ds.arquivo}
              </a>
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                Campos principais
              </p>
              <ul className="flex flex-wrap gap-2">
                {ds.campos.map((c) => (
                  <li key={c}>
                    <Code>{c}</Code>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      {/* Exemplos de uso */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white border-b border-slate-700 pb-2">
          Exemplos de uso
        </h2>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-slate-300">curl</p>
          <pre className="rounded-lg bg-slate-800 p-4 text-xs text-emerald-400 overflow-x-auto">
            {`curl -s "${BASE_RAW}/por-uf.json" | python3 -m json.tool`}
          </pre>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-slate-300">JavaScript / fetch</p>
          <pre className="rounded-lg bg-slate-800 p-4 text-xs text-emerald-400 overflow-x-auto leading-relaxed">
            {`const res = await fetch("${BASE_RAW}/por-uf.json");
const data = await res.json();
const taxaSP = data.ufs.SP.headlines.taxa_soltura_pct;
console.log(\`São Paulo: \${taxaSP}%\`);`}
          </pre>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-slate-300">Python / pandas</p>
          <pre className="rounded-lg bg-slate-800 p-4 text-xs text-emerald-400 overflow-x-auto leading-relaxed">
            {`import pandas as pd, requests

data = requests.get("${BASE_RAW}/serie-historica.json").json()
df = pd.DataFrame(data["serie"])
print(df[["ano", "pct_solto", "total_audiencias"]])`}
          </pre>
        </div>
      </section>

      {/* Repositório */}
      <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h2 className="text-base font-semibold text-white mb-2">Repositório</h2>
        <p className="text-sm text-slate-400 mb-3">
          Código-fonte, dados brutos e histórico de versões disponíveis no
          GitHub.
        </p>
        <a
          href="https://github.com/albinolima84/flagrante.site"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:border-indigo-500 hover:text-indigo-300 transition-colors"
        >
          github.com/albinolima84/flagrante.site ↗
        </a>
      </section>
    </div>
  );
}
