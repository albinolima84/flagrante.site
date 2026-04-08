import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-700 bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <span className="text-xl font-bold text-white tracking-tight">
            flagrante<span className="text-red-400">.site</span>
          </span>
          <span className="text-xs text-slate-400">
            Painel de Audiências de Custódia no Brasil
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">
            Painel
          </Link>
          <Link href="/sobre" className="hover:text-white transition-colors">
            Metodologia
          </Link>
          <a
            href="https://www.cnj.jus.br/sistema-carcerario/audiencia-de-custodia/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Fonte CNJ ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
