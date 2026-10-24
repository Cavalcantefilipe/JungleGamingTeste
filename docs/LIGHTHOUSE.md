# Lighthouse e desempenho

## Resultado vigente — conciliação de 24/10

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

## Método e ambiente

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
