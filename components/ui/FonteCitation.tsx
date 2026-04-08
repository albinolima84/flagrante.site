interface FonteCitationProps {
  nome: string;
  url: string;
  cobertura?: string;
}

export function FonteCitation({ nome, url, cobertura }: FonteCitationProps) {
  return (
    <p className="text-xs text-slate-500">
      Fonte:{" "}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-slate-300"
      >
        {nome}
      </a>
      {cobertura && <span className="ml-1">({cobertura})</span>}
    </p>
  );
}
