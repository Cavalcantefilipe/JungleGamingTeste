# Reconciliação das revisões — 24/10/2026

## Preservação das versões

A base publicada era `cd31f63` na `main` do GitHub. A cópia local estava em `00d792b`, com uma revisão sem commit. Antes de mudar de base, todos os arquivos dessa revisão foram preservados no commit `d78072e`, branch `codex/local-review-snapshot`.

A implementação conciliada parte de `cd31f63`. As correções locais foram comparadas por comportamento com a versão publicada. Componentes, contratos e fluxos equivalentes da `main` foram mantidos; as diferenças restantes foram adaptadas à arquitetura atual. O histórico local é incorporado por um merge que conserva a árvore conciliada e ambos os históricos. O envio para `main` é um avanço normal, sem force push.

## Decisões

| Área                          | Resultado da conciliação                                                                                                                                                                                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Imagens/Figma                 | Mantidos AVIF/WebP responsivos, ícones, tokens e composição mais recente da `main`. As fontes PNG da revisão local permanecem recuperáveis em `d78072e:assets/figma`.                                                                                                                      |
| Carrinho                      | O botão “−” permanece ativo com uma unidade e usa a mesma remoção da lixeira. O mínimo de uma unidade no detalhe continua protegido. Desconto no formato `(-) valor`.                                                                                                                      |
| Recomendações                 | O grid fixo foi substituído por carrossel com todos os resultados retornados, setas, indicadores, scroll e ampliação em hover/foco. Três cards em tablet e cinco no desktop; mantida a visibilidade da seção prevista no frame desktop do carrinho.                                        |
| Autenticação                  | Mantidos Radix, foco, Esc e dimensões de referência em 1440×900. A posição e altura se adaptam; o formulário cresce sem rolagem interna. Em telas muito baixas/zoom, a rolagem externa mantém campos e ações acessíveis.                                                                   |
| Checkout mobile               | Itens, subtotal, desconto e taxa podem ser expandidos em “Detalhes do pedido”. A ação não envia o formulário nem cria pedidos.                                                                                                                                                             |
| Merge de carrinhos            | Mantidos atomicidade, limite de 99 e estoque. A resposta informa ajustes e o login mostra aviso; edição esgotada presente nos dois carrinhos é removida.                                                                                                                                   |
| Tempo real                    | Eventos NFT passam pela comparação individual de cada cache. Um detalhe REST mais novo não bloqueia a atualização de listas antigas nem a invalidação do carrinho/cotação. Dedupe, cancelamento de REST antigo, reconciliação de filtros e proteção de pedidos terminais continuam ativos. |
| Recuperação e identidade      | Mantidos rascunho por usuário, tentativa idempotente após 401/timeout, recuperação sem cotação válida, reservas concorrentes e validação de endereço/rede/provedor/carteira da `main`.                                                                                                     |
| Favoritos, perfil e navegação | Preservadas as implementações equivalentes, os links funcionais, a invalidação do catálogo filtrado e as melhorias de acessibilidade existentes.                                                                                                                                           |
| Entrega                       | Mantidos Railpack/Caddy, headers, compressão, healthcheck, Lighthouse 13 e gate de lint com zero avisos.                                                                                                                                                                                   |

## Verificação

Os novos testes reproduziram falhas antes das correções. A cobertura acrescentada verifica remoção da última unidade, parênteses do desconto, navegação/hover do carrossel, autenticação em 390×844, 720×450, 1024×600 e 1440×768, resumo mobile após conexão sem criar pedido e aviso de ajuste pelo fluxo completo de login.

Os unitários adicionais cobrem soma acima de 99, estoque menor que a soma, edição esgotada, merge repetido e evento passando pelo gate com detalhe novo/lista antiga/carrinho/cotação. O revisor independente não encontrou bloqueadores no delta; suas três sugestões de cobertura foram incorporadas.

O preview de validação usa uma porta dedicada, 4189, para evitar reutilizar o servidor de outro worktree na porta 4175. As referências visuais de carrinho/pagamento foram atualizadas após inspeção; início e detalhe conservaram as referências anteriores. A execução final compara imagens sem atualizar baselines.

| Gate final local                                        | Resultado                                                             |
| ------------------------------------------------------- | --------------------------------------------------------------------- |
| TypeScript, ESLint e Prettier                           | Aprovados; zero erros e zero avisos de lint                           |
| Vitest                                                  | 120 testes em 32 arquivos                                             |
| Ferramentas Node                                        | 6 testes                                                              |
| Build                                                   | Aprovado                                                              |
| Chromium desktop/mobile, suíte integral                 | 260 aprovados, 32 exclusões por viewport, zero falhas                 |
| Firefox desktop/WebKit mobile, suíte de compatibilidade | 166 aprovados, 16 exclusões por viewport, zero falhas                 |
| Baselines                                               | Oito aprovadas na rodada final, sem atualização durante essa execução |
| Dependências                                            | Zero alertas na consulta completa                                     |

A primeira rodada integral encontrou cinco falhas: duas expectativas do texto antigo do desconto, duas baselines alteradas intencionalmente e o alinhamento do retorno do carrossel. Elas foram corrigidas antes das rodadas finais completas acima. [Histórico das execuções](../reports/reconciliation/test-runs.json), [Chromium](../reports/reconciliation/chromium.txt), [compatibilidade](../reports/reconciliation/compatibility.txt), [check](../reports/reconciliation/check.txt) e [audit](../reports/reconciliation/dependency-audit.json). O relatório de [qualidade de 23/10](QUALITY-REVIEW.md) permanece como histórico da base anterior.

## Publicação verificada

Correções em `2ed7033`; merge que preserva os dois históricos em [`af09da8`](https://github.com/Cavalcantefilipe/JungleGamingTeste/commit/af09da8c7df530fe4606d92b6a8c7b7756d17f71). A `main` foi atualizada por push normal. Railway publicou esse commit no deployment `8ffac3df-b830-4c8a-a351-23e9802036af`, status **SUCCESS**.

- [Aplicação pública](https://kurio-production-8274.up.railway.app/).
- [Verificação HTTP](../reports/reconciliation/public-http.txt): healthcheck, rotas SPA, headers, Brotli, cache, worker e erros 404 aprovados.
- [E2E público](../reports/reconciliation/public-e2e.txt): **84 aprovados, 6 exclusões por viewport, zero falhas**, cobrindo autenticação, carrinho/cupom/merge, compra, recuperação, socket e todos os novos cenários da conciliação.
- [Proveniência do deploy](../reports/reconciliation/deployment.json): commit, deployment, imagem e hashes. O HTML público difere do local nos nomes dos arquivos JS/CSS gerados; os HTMLs normalizados coincidem. Não se alega identidade binária entre ambientes diferentes.

### Performance pública

Lighthouse 13.5.0, Puppeteer 25.13.0, Chromium 156 e Node 24.12.0 em macOS/arm64. Três execuções por página/perfil, medianas independentes; coleta sem builds ou suítes simultâneas. As metas 90/95/95/90 foram atendidas, com saída 0.

| Perfil  | Página  | Performance | Acessibilidade | Boas práticas | SEO |
| ------- | ------- | ----------: | -------------: | ------------: | --: |
| desktop | Início  |          97 |            100 |           100 | 100 |
| desktop | Detalhe |          98 |            100 |           100 | 100 |
| mobile  | Início  |          93 |            100 |           100 | 100 |
| mobile  | Detalhe |          92 |            100 |           100 | 100 |

[Resumo e ambiente](../reports/reconciliation/lighthouse/summary.json); os 12 relatórios HTML e JSON estão em `reports/reconciliation/lighthouse/{desktop,mobile}/{home,detail}/`.

Os commits posteriores de documentação preservam o código funcional validado; a formatação regenerada da árvore de rotas não muda rotas ou comportamento. A confirmação da publicação também verifica o commit servido após atualizar a documentação.

## Limites

As compras, contas e carteiras são simuladas por MSW. Os testes públicos usam contextos isolados e não alteram dados de outros visitantes. WebKit automatizado não equivale a Safari em aparelho físico. A revisão não certifica igualdade de pixels em todas as telas nem substitui testes com leitores de tela. Medições de performance são específicas da versão e do ambiente registrados.
