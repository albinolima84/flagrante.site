interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}

export function MetricCard({ label, value, sub, highlight }: MetricCardProps) {
  return (
    <div
      className={`rounded-xl border p-6 flex flex-col gap-1 ${
        highlight
          ? "border-red-500/40 bg-red-950/20"
          : "border-slate-700 bg-slate-800/50"
      }`}
    >
      <span className="text-sm text-slate-400 uppercase tracking-wide">{label}</span>
      <span className="text-3xl font-bold text-white">{value}</span>
      {sub && <span className="text-xs text-slate-500">{sub}</span>}
    </div>
  );
}
