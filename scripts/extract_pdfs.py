#!/usr/bin/env python3
"""
ETL — Extração de dados dos boletins PDF do CNJ (audiências de custódia).

Fase 2 do roadmap. Os boletins trimestrais estão disponíveis em:
https://www.cnj.jus.br/sistema-carcerario/publicacoes-e-relatorios/
(filtrar por "Audiências de Custódia")

Uso:
    python extract_pdfs.py --pdf <caminho_boletim.pdf> --out data/static/

Dependências:
    pip install -r requirements.txt
"""

import argparse
import json
import re
import sys
from pathlib import Path


def parse_args():
    parser = argparse.ArgumentParser(description="Extrai tabelas de boletins PDF do CNJ")
    parser.add_argument("--pdf", required=True, help="Caminho para o PDF do boletim")
    parser.add_argument("--out", default="data/static/", help="Diretório de saída")
    parser.add_argument("--ano", type=int, required=True, help="Ano de referência do boletim")
    parser.add_argument("--trimestre", type=int, choices=[1, 2, 3, 4], help="Trimestre (1–4)")
    return parser.parse_args()


def extrair_tabelas(pdf_path: str) -> list[dict]:
    """
    Extrai tabelas do PDF usando pdfplumber.
    Retorna lista de dicionários normalizados.
    """
    try:
        import pdfplumber
        import pandas as pd
    except ImportError:
        print("Erro: instale as dependências com: pip install -r requirements.txt")
        sys.exit(1)

    resultados = []

    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            tables = page.extract_tables()
            for table in tables:
                if not table or len(table) < 2:
                    continue
                headers = [str(h).strip() if h else f"col_{j}" for j, h in enumerate(table[0])]
                rows = []
                for row in table[1:]:
                    if row:
                        row_dict = {
                            headers[j]: (str(v).strip() if v else None)
                            for j, v in enumerate(row)
                            if j < len(headers)
                        }
                        rows.append(row_dict)
                resultados.append({
                    "pagina": i + 1,
                    "headers": headers,
                    "rows": rows,
                })

    return resultados


def normalizar_decisoes(tabelas: list[dict]) -> dict | None:
    """
    Tenta identificar e normalizar a tabela de decisões (preso/solto).
    Heurística: procura colunas com 'preso', 'solto', 'liberdade'.
    """
    keywords = ["preso", "solto", "liberdade", "preventiva", "domiciliar"]

    for tabela in tabelas:
        headers_lower = [h.lower() for h in tabela["headers"]]
        if any(kw in " ".join(headers_lower) for kw in keywords):
            return tabela

    return None


def pct_para_float(valor: str | None) -> float | None:
    if not valor:
        return None
    cleaned = re.sub(r"[^\d,.]", "", valor).replace(",", ".")
    try:
        return float(cleaned)
    except ValueError:
        return None


def main():
    args = parse_args()
    pdf_path = Path(args.pdf)

    if not pdf_path.exists():
        print(f"Arquivo não encontrado: {pdf_path}")
        sys.exit(1)

    print(f"Processando: {pdf_path}")
    tabelas = extrair_tabelas(str(pdf_path))
    print(f"Tabelas encontradas: {len(tabelas)}")

    decisoes = normalizar_decisoes(tabelas)
    if decisoes:
        print(f"Tabela de decisões identificada na página {decisoes['pagina']}")
    else:
        print("Tabela de decisões não identificada automaticamente.")
        print("Inspecione as tabelas extraídas manualmente.")

    out_path = Path(args.out) / f"extracao_raw_{args.ano}"
    if args.trimestre:
        out_path = Path(args.out) / f"extracao_raw_{args.ano}_q{args.trimestre}"
    out_path = out_path.with_suffix(".json")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(
            {"ano": args.ano, "trimestre": args.trimestre, "tabelas": tabelas},
            f,
            ensure_ascii=False,
            indent=2,
        )

    print(f"Extração salva em: {out_path}")


if __name__ == "__main__":
    main()
