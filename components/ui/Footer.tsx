export function Footer() {
  return (
    <footer className="border-t border-slate-700 bg-slate-900 py-8 mt-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-slate-400">
          <div>
            <h3 className="font-semibold text-slate-200 mb-2">Fontes</h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="https://bnmp.cnj.jus.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-200 underline"
                >
                  BNMP 3.0 (ago/2024–presente)
                </a>
              </li>
              <li>
                <a
                  href="https://www.cnj.jus.br/sistema-carcerario/audiencia-de-custodia/dados-estatisticos/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-200 underline"
                >
                  SISTAC / Boletins CNJ (2015–2024)
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-200 mb-2">Limitações</h3>
            <ul className="space-y-1 text-xs">
              <li>Série histórica com quebra em ago/2024</li>
              <li>Raça/escolaridade: &gt;50% sem preenchimento</li>
              <li>Dados por UF disponíveis no Sprint 2</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-200 mb-2">Sobre</h3>
            <ul className="space-y-1">
              <li>
                <a href="/sobre" className="hover:text-slate-200 underline">
                  Metodologia completa
                </a>
              </li>
              <li>
                <a
                  href="https://atos.cnj.jus.br/atos/detalhar/2234"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-200 underline"
                >
                  Resolução CNJ nº 213/2015
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-600">
          Dados públicos do CNJ. Uso jornalístico e educacional.
        </p>
      </div>
    </footer>
  );
}
