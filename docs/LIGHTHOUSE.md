# Lighthouse e desempenho

## Resultado atual — revisão de 24/10

Código público `4185cbb`, deployment `e4b238a6-0bed-45d7-8769-a4187b3c23de`, verificado como `SUCCESS`. Coleta concluída em `2026-10-24T07:00:28.305Z`: **12 execuções válidas, saída 0 e todas as metas atendidas**. [Resumo](../reports/screens-completeness/lighthouse/summary.json), [log](../reports/screens-completeness/lighthouse.txt), [deployment e hash](../reports/screens-completeness/deployment.json).

| Perfil  | Página | Performance | Acessibilidade | Boas práticas | SEO |     LCP |    CLS |     TBT |
| ------- | ------ | ----------: | -------------: | ------------: | --: | ------: | -----: | ------: |
| desktop | home   |          99 |            100 |           100 | 100 |  775 ms | 0.0082 |  0.0 ms |
| desktop | detail |         100 |            100 |           100 | 100 |  756 ms | 0.0000 |  0.0 ms |
| mobile  | home   |          93 |            100 |           100 | 100 | 2813 ms | 0.0000 | 25.5 ms |
| mobile  | detail |          92 |            100 |           100 | 100 | 2874 ms | 0.0000 | 29.0 ms |

Medianas independentes de três execuções por página/perfil, incluindo as notas mais baixas. O LCP mobile permanece próximo de 2,8 s; cumprir a pontuação do desafio não garante LCP abaixo de 2,5 s em um dispositivo real.

### Ambiente e falhas técnicas preservadas

Lighthouse 13.5.0, Puppeteer 25.13.0, Node 24.12.0, macOS/arm64 e **Chromium Headless Shell 156.0.8078.4**, já instalado pelo Playwright e selecionado via `CHROME_PATH`. Configurações de rede/CPU, emulação, categorias, três execuções e limites foram mantidos. Nenhum recurso da aplicação foi desativado. Não foram executados builds, testes ou navegação pelo agente durante a coleta. [Executável e proveniência](../reports/screens-completeness/lighthouse/executable.json).

O Chrome for Testing usado inicialmente sofreu crashes nativos (`EXC_BREAKPOINT`/`SIGTRAP`), com perda da conexão do driver. Duas tentativas e uma retomada foram interrompidas; a causa nativa específica não foi determinada. Os resultados válidos dessas tentativas foram preservados, mas **nenhum entrou nas medianas finais**. A coleta final inteira foi repetida no Headless Shell, sem misturar os executáveis. A diferença de ambiente impede atribuir toda variação das notas ao código da aplicação.

- [Primeira tentativa incompleta](../reports/screens-completeness/lighthouse-incomplete-connection.txt).
- [Segunda tentativa incompleta](../reports/screens-completeness/lighthouse-incomplete-connection-2.txt).
- [Retomada interrompida, com nove resultados válidos preservados](../reports/screens-completeness/lighthouse-resumed-incomplete/resume-provenance.json).
- [Exceções nativas correspondentes, sem os dumps completos do sistema](../reports/screens-completeness/lighthouse-browser-crashes.json).
- [Smoke do Headless Shell, diagnóstico excluído das medianas](../reports/screens-completeness/lighthouse-headless-shell-smoke/diagnosis.json).

## Checkpoint anterior — conciliação de 24/10

Versão pública `af09da8`: performance **97/98 desktop e 93/92 mobile** (início/detalhe), demais categorias **100**. Doze execuções válidas, mediana de três por combinação, saída 0. [Resumo e ambiente](../reports/reconciliation/lighthouse/summary.json), [publicação e verificação](RECONCILIATION.md#publicação-verificada).

## Checkpoint público anterior — 23/10

Coleta concluída em `2026-10-23T23:53:47.578Z` na [Railway](https://kurio-production-8274.up.railway.app), commit `f5dd2fd`, deployment `2b5f6e07-fb05-4cea-ba08-6eb70f08e0ff`. [Proveniência e hash](../reports/quality/deployment.json).

| Perfil  | Página | Performance | Acessibilidade | Boas práticas | SEO |     LCP |    CLS |   TBT |
| ------- | ------ | ----------: | -------------: | ------------: | --: | ------: | -----: | ----: |
| desktop | home   |          96 |            100 |           100 | 100 |  751 ms | 0.0840 |  0 ms |
| desktop | detail |          98 |            100 |           100 | 100 |  726 ms | 0.0833 |  0 ms |
| mobile  | home   |          93 |            100 |           100 | 100 | 2786 ms | 0.0000 | 36 ms |
| mobile  | detail |          94 |            100 |           100 | 100 | 2839 ms | 0.0000 | 47 ms |

**12 execuções válidas; saída 0.** Metas preservadas: Performance ≥90, Acessibilidade ≥95, Boas práticas ≥95 e SEO ≥90. O LCP mobile continua acima de 2,5 s; atingir a pontuação do desafio não equivale a garantir esse limite em dispositivos reais.

## Método e ambiente do checkpoint de 23/10

Lighthouse **13.5.0**, Puppeteer **25.13.0**, Chromium **156**, Node **24.12.0**, macOS/arm64. Build otimizado, cenário default, perfil limpo e três execuções para cada página/perfil. Mediana independente por categoria e métrica; não se seleciona o melhor run. Sem builds, suítes ou navegação executados pelo agente durante a coleta. Os limites, throttling, mocks, imagens, fontes, Socket.IO e validação de compra foram mantidos.

[Resumo JSON](../reports/lighthouse-final/summary.json). Em `reports/lighthouse-final/{desktop,mobile}/{home,detail}/`, cada `run-1` a `run-3` tem HTML e JSON. São os dados brutos desta coleta.

## Baseline e dependências

O [baseline público anterior à refatoração](../reports/lighthouse-final-baseline/summary.json), código de `c3b5254`, já registrava Performance 97/98 desktop e 93/93 mobile. O resultado antigo 88 no detalhe mobile pertence a uma publicação anterior. Não foi necessário remover recursos nem simplificar a aplicação para passar a meta nesta rodada.

Uma nova consulta identificou Zod 3 vulnerável na cadeia de desenvolvimento do driver 25.9.0. Puppeteer 25.13.0 utiliza chromium-bidi com Zod 4.6.7; os audits voltaram a zero. Um [smoke técnico](../reports/quality/driver-smoke.report.html) verificou o driver antes da publicação, e a coleta final concluiu os 12 runs. Esse smoke isolado não foi incorporado à mediana. [Segurança e advisory](SECURITY-REVIEW.md).

A versão de Lighthouse permaneceu a mesma, mas o driver mudou; a variação entre baseline e final não é atribuída exclusivamente à refatoração. Resultados anteriores, inclusive medianas abaixo da meta e falhas técnicas, estão preservados no [histórico](LIGHTHOUSE-HISTORY.md).

## Reproduzir

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm build
KURIO_LH_BASE_URL=https://kurio-production-8274.up.railway.app KURIO_LH_REPORT_DIR=reports/lighthouse-final pnpm lighthouse
```

Sem `KURIO_LH_BASE_URL`, o comando inicia um preview local na porta 4173. `CHROME_PATH` permite escolher outro Chromium, registrando a diferença de ambiente. Erro técnico interrompe a coleta; mediana abaixo da meta conserva saída 1. Não rode builds/testes simultaneamente nem repita apenas para escolher uma nota maior. Testes Node verificam mediana, assertions, coleta incompleta e retenção dos arquivos auxiliares.
