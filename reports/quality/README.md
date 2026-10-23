# Evidências da conferência final

Consulte [QUALITY-REVIEW.md](../../docs/QUALITY-REVIEW.md) para resultados, commits e limitações. O [manifesto](manifest.json) registra a proveniência e os hashes; [test-runs.json](test-runs.json) conserva também as falhas intermediárias e as revalidações, sem apresentá-las como uma única execução verde.

## Zoom nativo de 200% no Chrome

Viewport efetivo de 756 px; capturas apenas da área visível, em diferentes posições de rolagem. Os recortes verticais das imagens abaixo são o viewport ampliado, não truncamento do conteúdo da página. [Medições de largura e diálogo](manual-zoom.json).

| Estado          | Captura                  |
| --------------- | ------------------------ |
| Início          | [PNG](zoom-home.png)     |
| Detalhe nft-002 | [PNG](zoom-detail.png)   |
| Carrinho        | [PNG](zoom-cart.png)     |
| Login com erros | [PNG](zoom-login.png)    |
| Cadastro        | [PNG](zoom-register.png) |
| Pagamento       | [PNG](zoom-checkout.png) |
| Recibo          | [PNG](zoom-receipt.png)  |
| Perfil          | [PNG](zoom-profile.png)  |
| Carteiras       | [PNG](zoom-wallets.png)  |

## Dependências e Lighthouse

- [Audit antes da atualização do driver](audit-before.json).
- [Audit completo após a atualização](audit.json) e [somente produção](audit-production.json).
- [Smoke técnico do driver](driver-smoke.report.html), com [dados JSON](driver-smoke.report.json). É uma execução isolada, não a mediana final.
- [Baseline público anterior à refatoração](../lighthouse-final-baseline/summary.json).
- [Medição final pública](../lighthouse-final/summary.json).

Os testes utilizam exclusivamente contas e dados fictícios da demonstração. A validação com VoiceOver ficou inconclusiva; não deve ser inferida dos screenshots ou do axe.
