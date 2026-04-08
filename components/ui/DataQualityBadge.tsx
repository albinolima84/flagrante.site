interface DataQualityBadgeProps {
  mensagem: string;
  nivel?: "aviso" | "info";
}

export function DataQualityBadge({
  mensagem,
  nivel = "aviso",
}: DataQualityBadgeProps) {
  const classes =
    nivel === "aviso"
      ? "bg-amber-900/30 border-amber-500/50 text-amber-300"
      : "bg-blue-900/30 border-blue-500/50 text-blue-300";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${classes}`}
    >
      <span aria-hidden="true">{nivel === "aviso" ? "⚠" : "ℹ"}</span>
      {mensagem}
    </span>
  );
}
