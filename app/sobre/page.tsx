import type { Metadata } from "next";
import { FONTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Metodologia — Flagrante.site",
  description:
    "Metodologia, fontes e limitações do painel de audiências de custódia.",
};

function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="text-xl font-bold text-white mt-10 mb-3 pb-2 border-b border-slate-700"
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-slate-200 mt-6 mb-2">
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-400 leading-7 mb-4">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc list-inside space-y-1 text-slate-400 mb-4 pl-2">
      {children}
    </ul>
  );
}

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-3">
        Metodologia e Transparência
      </h1>

      <P>
        Este painel consolida dados públicos do Conselho Nacional de Justiça
        (CNJ) sobre audiências de custódia realizadas no Brasil desde fevereiro
        de 2015.
      </P>

      <H2 id="fontes">Fontes</H2>
      <UL>
        {FONTES.map((f) => (
          <li key={f.nome}>
            <a
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              {f.nome}
            </a>
            {f.cobertura && (
              <span className="text-slate-500 ml-1">({f.cobertura})</span>
            )}
          </li>
        ))}
      </UL>

      <H2 id="quebra-serie">Quebra de série histórica (agosto/2024)</H2>
      <div className="rounded-lg border border-orange-500/40 bg-orange-950/20 px-4 py-3 mb-4">
        <P>
          Em agosto de 2024, o CNJ migrou do sistema SISTAC para o BNMP 3.0
          (Banco Nacional de Monitoramento de Prisões). Esta migração criou uma
          quebra de série histórica: campos como perfil sociodemográfico
          (raça/cor, escolaridade, estado civil), modalidade de audiência
          (presencial/virtual) e drogas apreendidas só existem a partir desta
          data. Os dados anteriores a agosto/2024 e posteriores{" "}
          <strong className="text-orange-300">
            não são diretamente comparáveis
          </strong>{" "}
          para esses campos.
        </P>
      </div>

      <H2 id="qualidade-dados">Qualidade dos dados</H2>
      <H3>Raça/cor, escolaridade e estado civil</H3>
      <P>
        Mais de 50% dos registros no BNMP 3.0 não possuem informação de raça,
        estado civil e escolaridade. Por isso, esses campos{" "}
        <strong className="text-slate-300">não são exibidos no Sprint 1</strong>
        . Serão incluídos no Sprint 2 acompanhados de um indicador de qualidade
        de dados que informa o percentual de preenchimento.
      </P>

      <H3>O que não é possível medir</H3>
      <P>
        As seguintes análises{" "}
        <strong className="text-slate-300">não são possíveis</strong> com os
        dados públicos disponíveis e não serão incluídas neste painel:
      </P>
      <UL>
        <li>Taxa de soltura por juiz/magistrado</li>
        <li>Reincidência criminal dos custodiados</li>
        <li>
          Acompanhamento pós-audiência (cumprimento de medidas alternativas)
        </li>
      </UL>

      <H2 id="metodologia-estatistica">Nota sobre os valores exibidos</H2>
      <P>
        Os valores da série histórica (2015–2023) foram obtidos dos boletins
        publicados pelo CNJ e podem divergir dos dados exatos por limitações de
        extração de PDFs. Os números do painel devem ser verificados nas fontes
        primárias antes de uso em publicações.
      </P>

      <H2 id="base-legal">Base legal</H2>
      <P>
        As audiências de custódia foram instituídas pela{" "}
        <a
          href="https://atos.cnj.jus.br/atos/detalhar/2234"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 underline"
        >
          Resolução CNJ nº 213/2015
        </a>{" "}
        e positivadas no Código de Processo Penal pela Lei 13.964/2019 (Pacote
        Anticrime, art. 310). Devem ser realizadas em até 24 horas após a prisão
        em flagrante.
      </P>

      <H2>Código-fonte e reutilização</H2>
      <P>
        Este painel é de código aberto. Os dados e o código estão disponíveis
        para reutilização conforme a{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 underline"
        >
          CC BY 4.0
        </a>
        .
      </P>
    </div>
  );
}
