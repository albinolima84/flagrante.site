export function SeriesBreakBanner() {
  return (
    <div className="rounded-lg border border-orange-500/40 bg-orange-950/20 px-4 py-3 text-sm text-orange-200">
      <p>
        <strong className="text-orange-300">Quebra de série histórica em agosto/2024.</strong>{" "}
        O CNJ migrou do SISTAC para o BNMP 3.0. Campos como perfil sociodemográfico,
        modalidade (presencial/virtual) e drogas apreendidas só existem a partir desta data.
        Comparações com períodos anteriores devem ser feitas com cautela.{" "}
        <a href="/sobre#quebra-serie" className="underline hover:text-orange-100">
          Saiba mais
        </a>
      </p>
    </div>
  );
}
