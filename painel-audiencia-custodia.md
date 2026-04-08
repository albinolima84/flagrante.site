# Painel de Audiências de Custódia no Brasil
## Documentação Técnica para Implementação
> **Versão:** 1.0  
> **Status:** Pronto para desenvolvimento  
> **Última atualização:** Abril/2026
-----
## 1. Visão Geral do Produto
### Objetivo
Painel público interativo que consolida e apresenta dados sobre audiências de custódia no Brasil, combinando múltiplas fontes abertas em uma interface acessível para jornalistas, pesquisadores, defensores públicos e cidadãos.
### Proposta de valor
O CNJ possui dados, mas distribui em painéis fragmentados, PDFs e boletins separados. Este produto entrega tudo em um único lugar com visualizações comparativas, filtros por UF e série histórica clara.
-----
## 2. Fontes de Dados
### 2.1 BNMP 3.0 — Fonte Principal (pós agosto/2024)
|Item                  |Detalhe                                          |
|----------------------|-------------------------------------------------|
|**Portal público**    |https://bnmp.cnj.jus.br (aba “Estatísticas”)     |
|**Tipo de acesso**    |Painel web com **exportação de dados** disponível|
|**Atualização**       |Tempo real (alimentado pelos tribunais)          |
|**Cobertura temporal**|Agosto/2024 → presente                           |
|**Granularidade**     |Por tribunal, órgão e UF                         |
**Campos disponíveis no BNMP 3.0:**
- Decisão da audiência: prisão mantida / liberdade / prisão domiciliar
- Modalidade: presencial vs. virtual
- Tipo penal (tráfico, furto, violência doméstica, armas, CNT, outros)
- Drogas apreendidas (tipo)
- Armas apreendidas (sim/não)
- Medidas protetivas emitidas
- Perfil do custodiado: sexo, raça/cor, faixa etária, escolaridade, estado civil
- Situação de emprego (formal, informal, nenhum)
- Dependentes químicos
- Gestante/lactante
- Relatos de tortura ou maus-tratos
> ⚠️ **Limitação de qualidade:** Raça, estado civil e escolaridade têm mais de 50% dos campos sem preenchimento. O produto deve exibir isso como indicador de qualidade de dados, não omitir.
-----
### 2.2 SISTAC/Boletins CNJ — Série Histórica (2015–2024)
|Item                  |Detalhe                                                                            |
|----------------------|-----------------------------------------------------------------------------------|
|**Portal**            |https://www.cnj.jus.br/sistema-carcerario/audiencia-de-custodia/dados-estatisticos/|
|**Tipo de acesso**    |PDFs e boletins trimestrais públicos                                               |
|**Cobertura temporal**|Fevereiro/2015 → julho/2024                                                        |
|**Campos disponíveis**|Decisão (preso/solto), volume de audiências, UF, tipo penal básico                 |
**Dados consolidados já publicados pelo CNJ (podem entrar como dataset estático v1):**
|Indicador                      |Valor                                                  |
|-------------------------------|-------------------------------------------------------|
|Total de audiências (2015–2025)|> 2 milhões                                            |
|Prisão preventiva mantida      |59%                                                    |
|Liberdade concedida            |41%                                                    |
|Prisão domiciliar              |0,3%                                                   |
|Relatos de tortura (total)     |~153 mil (7%)                                          |
|Principais tipos penais        |Tráfico 24%, Furto 13%, Viol. Dom. 7%, Armas 6%, CNT 5%|
|Perfil (sexo)                  |84% homens, 16% mulheres                               |
-----
### 2.3 Observa Custódia — Qualidade do Processo
|Item              |Detalhe                                                                                                                     |
|------------------|----------------------------------------------------------------------------------------------------------------------------|
|**Portal**        |https://www.observacustodia.com                                                                                             |
|**Tipo de acesso**|Painel web — verificar se há API ou exportação                                                                              |
|**Cobertura**     |Capitais dos 26 estados + DF                                                                                                |
|**Categorias**    |10 categorias: acesso à defesa, atendimento médico, contato família, relatos de violência, encaminhamento psicossocial, etc.|

> 🔍 **Tarefa para o dev:** Inspecionar as requisições de rede do painel da Observa Custódia para identificar se há API REST subjacente. Muitos painéis desse tipo usam APIs públicas não documentadas.
-----
### 2.4 DataJud — API Pública CNJ (complementar)
|Item            |Detalhe                                                                                  |
|----------------|-----------------------------------------------------------------------------------------|
|**URL**         |https://datajud-wiki.cnj.jus.br/api-publica/                                             |
|**Autenticação**|API Key pública (cadastro gratuito)                                                      |
|**Utilidade**   |Metadados de processos — pode complementar com volume de processos criminais por tribunal|

> ⚠️ O DataJud não contém dados específicos de audiências de custódia, mas pode enriquecer o contexto com dados de processos criminais gerais.
-----
## 3. Estratégia de Coleta de Dados
### Fase 1 — MVP com dados estáticos (semanas 1–2)
Montar JSON/CSV com os dados já publicados nos boletins e artigos do CNJ. Permite lançar uma v1 funcional enquanto a coleta automatizada é desenvolvida.
Arquivo sugerido: `data/static/serie-historica-cnj.json`
```json
{
 "fonte": "CNJ / Boletins SISTAC + BNMP 3.0",
 "ultima_atualizacao": "2025-02",
 "serie_historica": [
   { "ano": 2015, "total_audiencias": 45000, "pct_solto": 38, "pct_preso": 62 },
   { "ano": 2016, "total_audiencias": 180000, "pct_solto": 39, "pct_preso": 61 },
   ...
 ],
 "tipos_penais": [
   { "tipo": "Tráfico", "pct": 24 },
   { "tipo": "Furto", "pct": 13 },
   { "tipo": "Violência Doméstica", "pct": 7 },
   { "tipo": "Armas", "pct": 6 },
   { "tipo": "CNT", "pct": 5 },
   { "tipo": "Outros", "pct": 45 }
 ]
}
```
-----
### Fase 2 — Extração de PDFs (semanas 2–3)
Os boletins trimestrais do CNJ são PDFs com tabelas. Usar `pdfplumber` (Python) para extrair.
```python
# Exemplo de extração
import pdfplumber
import pandas as pd
with pdfplumber.open("boletim-custodia-q1-2024.pdf") as pdf:
   for page in pdf.pages:
       tables = page.extract_tables()
       for table in tables:
           df = pd.DataFrame(table[1:], columns=table[0])
           # processar e normalizar...
```
**URLs dos boletins:** https://www.cnj.jus.br/sistema-carcerario/publicacoes-e-relatorios/ (filtrar por “Audiências de Custódia”)
-----
### Fase 3 — Scraping/API do BNMP 3.0 (semana 3–4)
O painel do BNMP 3.0 permite exportação de dados. Fluxo sugerido:
1. Acessar https://bnmp.cnj.jus.br (aba Estatísticas)
1. Inspecionar as chamadas de rede (DevTools → Network → XHR/Fetch)
1. Identificar endpoints REST e estrutura de payload
1. Se houver API: implementar cliente HTTP com cache local
1. Se não houver: usar Playwright para automação da exportação
**Headers esperados para tentar:**
```
GET /api/estatisticas/audiencias-custodia?uf=SP&periodo=2024-01_2025-03
Accept: application/json
```
-----
### Fase 4 — Observa Custódia (semana 4)
Inspecionar https://www.observacustodia.com da mesma forma. Se não houver API, os dados são públicos e podem ser copiados manualmente para o dataset estático como complemento qualitativo.
-----
## 4. Arquitetura do Produto
### Stack sugerida
|Camada         |Tecnologia sugerida                              |
|---------------|-------------------------------------------------|
|Frontend       |Next.js + TypeScript                             |
|Visualizações  |Recharts ou D3.js                                |
|Mapa do Brasil |react-simple-maps (SVG, leve)                    |
|Dados estáticos|JSON no repositório (Fase 1)                     |
|Dados dinâmicos|API route no Next.js + cache                     |
|ETL/coleta     |Python (pdfplumber, requests, Playwright)        |
|Hospedagem     |Vercel (frontend) + GitHub Actions (ETL agendado)|
-----
### Estrutura de pastas sugerida
```
painel-custodia/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Home — visão geral nacional
│   ├── estados/[uf]/page.tsx   # Página por estado
│   └── sobre/page.tsx          # Metodologia e fontes
├── components/
│   ├── charts/
│   │   ├── DecisaoDonut.tsx     # % solto vs. preso
│   │   ├── TiposPenaisBar.tsx   # Barras horizontais
│   │   ├── SerieHistoricaLine.tsx
│   │   ├── PerfilRadar.tsx      # Perfil sociodemográfico
│   │   └── MapaBrasil.tsx       # Coroplético por UF
│   ├── filters/
│   │   ├── PeriodoSelector.tsx
│   │   └── UFSelector.tsx
│   └── ui/
│       ├── MetricCard.tsx
│       ├── DataQualityBadge.tsx # Aviso de qualidade dos dados
│       └── FonteCitation.tsx
├── data/
│   ├── static/
│   │   ├── serie-historica.json
│   │   ├── por-uf.json
│   │   └── perfil-nacional.json
│   └── collected/              # gerado pelo ETL
├── scripts/
│   ├── extract_pdfs.py
│   ├── scrape_bnmp.py
│   └── scrape_observa.py
└── public/
   └── metodologia.md
```
-----
## 5. Módulos do Painel (Telas / Seções)
### 5.1 Header — Números Nacionais
Cards de destaque, sempre visíveis no topo.
|Card                  |Valor      |Nota               |
|----------------------|-----------|-------------------|
|Total de audiências   |> 2 milhões|Desde 2015         |
|Taxa de soltura       |41%        |Série histórica    |
|Relatos de tortura    |7%         |Série histórica    |
|Audiências presenciais|46%        |Apenas pós ago/2024|
-----
### 5.2 Módulo — Decisões
- **Gráfico tipo:** Donut / Pizza dupla (nacional vs. UF selecionada)
- **Dados:** % prisão preventiva, % liberdade, % prisão domiciliar
- **Filtros:** UF, período (ano/trimestre)
- **Tooltip:** valor absoluto + percentual ao passar o mouse
-----
### 5.3 Módulo — Tipos Penais
- **Gráfico tipo:** Barras horizontais ranqueadas
- **Top 6:** Tráfico, Furto, Violência Doméstica, Armas, CNT, Outros
- **Filtros:** UF
- **Interação:** Clicar no tipo filtra os outros módulos
-----
### 5.4 Módulo — Série Histórica
- **Gráfico tipo:** Linha com área sombreada
- **Eixo Y:** % de soltura / volume de audiências (toggle)
- **Eixo X:** 2015 → presente (trimestral quando disponível, anual no legado)
- **Anotações visuais:**
 - 📌 Mar/2020: Suspensão pandemia
 - 📌 Ago/2024: Migração BNMP 3.0 (quebra de série)
 - 📌 2019: CPP atualizado
> ⚠️ **Obrigatório:** Sinalizar claramente a quebra de série em ago/2024. Os dados pré e pós não são diretamente comparáveis em todos os campos.
-----
### 5.5 Módulo — Mapa por Estado
- **Gráfico tipo:** Mapa coroplético do Brasil (SVG)
- **Métrica:** % de soltura por UF (cor mais fria = mais solto, mais quente = mais preso)
- **Interação:** Clicar no estado filtra todos os outros módulos
- **Tooltip:** Nome da UF, % soltura, total de audiências
-----
### 5.6 Módulo — Perfil do Custodiado
- **Gráficos:** Donut para sexo, barras para raça, barras para faixa etária, barras para escolaridade
- **Destaque obrigatório:** Badge vermelho indicando % de campos sem preenchimento para raça/escolaridade
- **Comparativo:** Nacional vs. UF selecionada lado a lado
-----
### 5.7 Módulo — Qualidade do Processo (Observa Custódia)
- **Tipo:** Heatmap ou tabela comparativa por capital
- **Dimensões:** Acesso à defesa, atendimento médico, contato família, encaminhamento psicossocial
- **Nota de fonte:** Dados coletados por observação presencial e virtual pela APT + Justiça Global
-----
### 5.8 Rodapé — Metodologia e Transparência
Seção obrigatória com:
- Fontes utilizadas e URLs
- Datas de atualização por fonte
- Explicação das limitações (campos sem preenchimento, quebra de série)
- Link para os dados brutos quando disponível
-----
## 6. Regras de Negócio e Avisos Obrigatórios
### 6.1 Quebra de série histórica
```
⚠️ Em agosto de 2024, o CNJ migrou do SISTAC para o BNMP 3.0.
Campos como perfil sociodemográfico, tipo de audiência (presencial/virtual)
e drogas apreendidas só existem a partir desta data.
Comparações com períodos anteriores devem ser feitas com cautela.
```
### 6.2 Qualidade dos dados de raça/escolaridade
```
ℹ️ Mais de 50% dos registros não possuem informação de raça, estado civil
e escolaridade. Os percentuais exibidos consideram apenas os registros
com preenchimento. Isso pode introduzir viés de seleção.
```
### 6.3 Dados não disponíveis publicamente
As seguintes análises **não são possíveis** com dados públicos e não devem ser prometidas:
- Taxa de soltura por juiz/magistrado
- Reincidência criminal dos custodiados
- Acompanhamento pós-audiência (cumprimento de medidas alternativas)
-----
## 7. Roadmap de Desenvolvimento
### Sprint 1 — Fundação (semana 1–2)
- [ ] Setup Next.js + TypeScript + Recharts
- [ ] Montar dataset estático JSON com dados já publicados
- [ ] Implementar layout base + cards nacionais
- [ ] Gráfico de decisões (donut) — nacional
- [ ] Gráfico tipos penais (barras) — nacional
- [ ] Deploy em Vercel
### Sprint 2 — Visualizações completas (semana 2–3)
- [ ] Série histórica com anotações
- [ ] Mapa do Brasil por UF
- [ ] Perfil do custodiado com badge de qualidade
- [ ] Filtro global por UF
- [ ] Página de metodologia
### Sprint 3 — Coleta automatizada (semana 3–4)
- [ ] Script Python de extração dos PDFs do CNJ
- [ ] Inspeção e implementação da API/scraping do BNMP 3.0
- [ ] GitHub Actions para atualização periódica (semanal)
- [ ] Substituição dos dados estáticos por dados coletados
### Sprint 4 — Qualidade e lançamento (semana 4–5)
- [ ] Módulo Observa Custódia
- [ ] Responsivo mobile
- [ ] Acessibilidade (WCAG AA)
- [ ] SEO e Open Graph
- [ ] Texto de apresentação e contexto legal
- [ ] Revisão de todas as fontes e citações
-----
## 8. Referências e Links Úteis
|Recurso                            |URL                                                                                                     |
|-----------------------------------|--------------------------------------------------------------------------------------------------------|
|Portal CNJ — Audiências de Custódia|https://www.cnj.jus.br/sistema-carcerario/audiencia-de-custodia/                                        |
|Dados Estatísticos CNJ (SISTAC)    |https://www.cnj.jus.br/sistema-carcerario/audiencia-de-custodia/dados-estatisticos/                     |
|BNMP 3.0 — Portal Público          |https://bnmp.cnj.jus.br                                                                                 |
|Painéis Estatísticos CNJ           |https://www.cnj.jus.br/sistema-carcerario/paineis-estatisticos/                                         |
|Observa Custódia                   |https://www.observacustodia.com                                                                         |
|Publicações CNJ (boletins PDF)     |https://www.cnj.jus.br/sistema-carcerario/publicacoes-e-relatorios/                                     |
|DataJud API Pública                |https://datajud-wiki.cnj.jus.br/api-publica/                                                            |
|Resolução CNJ nº 213/2015          |https://atos.cnj.jus.br/atos/detalhar/2234                                                              |
|Relatório 10 anos — Defensoria MS  |https://www.defensoria.ms.def.br/images/repositorio-dpgems/imagens-noticias/audiencia-custodia-fecha.pdf|