# Revisão do frontend — 23/10/2026

## Escopo

Revisão complementar solicitada após a publicação: gradientes ausentes, cores reutilizáveis no Tailwind, posição/comportamento do favorito e componentes com responsabilidades demais. A referência são os SVGs originais exportados do [Figma](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge), além dos PNGs em `reports/design`.

## Tokens e diferenças visuais corrigidas

A paleta já existia em `src/styles/tokens.css`. Foram adicionados tokens de imagem de fundo no mesmo `@theme` do Tailwind 4, consumidos por classes como `bg-surface-gradient` e `bg-filter-gradient`. Os componentes usam nomes semânticos; cores literais permanecem no arquivo de tokens e nos assets originais.

| Token               | Uso e referência                                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `primary-gradient`  | CTA de compra, cupom e checkout; stops Primary 100% → 80%, extraídos de `70397:251`. O gradiente agora é CSS e acompanha a paleta. |
| `filter-gradient`   | Botão de filtros mobile; Primary 45% → 100%, `14:5226`.                                                                            |
| `surface-gradient`  | Suporte dos cards mobile; Card → Raised, `14:5226`. Desktop mantém o fundo sólido da referência.                                   |
| `detail-gradient`   | Fundo superior do detalhe mobile; Card → Raised, `15:5536`.                                                                        |
| `market-gradient`   | Círculo central da navegação mobile; Primary 40% → 100%, `70395:245`.                                                              |
| `featured-gradient` | Fundo da oferta lateral desktop; Primary 10% → 3%, `2:2`.                                                                          |
| `skeleton-gradient` | Shimmer compartilhado, com as cores Card/Raised existentes.                                                                        |

Os ângulos e limites dos stops foram calculados a partir dos vetores e dimensões dos SVGs, inclusive os pontos fora do retângulo. O fundo ilustrado do hero continua no SVG original, com suas formas e gradientes próprios.

O coração agora acompanha o topo da imagem, em vez do topo do suporte. O círculo visual continua com 28 px e o alvo tem 44 px. Em dispositivos com mouse e hover, aparece no card sob o ponteiro, por foco de teclado ou quando já favoritado. Em telas de toque fica disponível sem exigir hover; isso evita esconder uma ação essencial no celular. O contorno de foco e `aria-pressed` permanecem.

## Organização e problemas corrigidos

| Arquivo                               | Linhas anteriores | Linhas após a revisão | Responsabilidades extraídas                                                        |
| ------------------------------------- | ----------------: | --------------------: | ---------------------------------------------------------------------------------- |
| `CheckoutContent.tsx`                 |               182 |                    32 | Seleção/formulário de carteira, submissão, criação do payload, revisão e feedback. |
| `CheckoutPage.tsx`                    |                91 |                    18 | Estado de carregamento/erro/recuperação e requisitos para comprar.                 |
| `CatalogPage.tsx`                     |                91 |                    27 | Seção de filtros e resultados, incluindo vazio/erro/paginação.                     |
| `NftDetailPage.tsx`                   |                91 |                    28 | Navegação mobile, título/preço, metadados, resumo e compartilhamento.              |
| `Header.tsx`                          |               111 |                    30 | Navegação, ações e menu da conta, mantendo importação lazy.                        |
| `AuthDialog.tsx`                      |                99 |                    43 | Cabeçalho, abas e painel do formulário.                                            |
| `LoginForm.tsx` / `RegisterForm.tsx`  |           78 / 87 |               26 / 33 | Hooks de envio e grupos de campos.                                                 |
| `CartItemRow.tsx` / `CartSummary.tsx` |           99 / 97 |               47 / 42 | Identificação, total, remoção, cotação, cupom e navegação ao checkout.             |
| `CollectorForm.tsx`                   |               129 |                    53 | Campos de identidade/carteira, observação e seletor de outra carteira.             |
| `WalletNetworkPicker.tsx`             |               123 |                    49 | Opções de carteiras/provedores e estado da conexão.                                |

As extrações preservam a estrutura HTML, classes, labels, chaves de remontagem e ordem dos controles. Tipos reutilizam contratos Zod e os retornos dos hooks. Não foram adicionadas bibliotecas, requisições ou caches paralelos. Comparando os logs dos builds anterior e atual, o chunk do checkout passou de 6,27 para 6,73 KB gzip, e o catálogo de 11,44 para 11,53 KB gzip. São medidas de bundle, não de latência ou pontuação Lighthouse.

A lógica de favoritos passou para `useFavoriteControl`. Login/cadastro têm hooks próprios e usam o componente existente de erro raiz. A persistência do checkout usa `subscribe` com cleanup, substituindo `watch(callback)` e removendo o aviso de incompatibilidade dessa API com memoização. A sessão continua sendo comparada antes de salvar qualquer rascunho.

O checkout mantém: revisão explícita da cotação, verificação de carteira antes do pedido, tratamento dos erros de conexão, bloqueio quando a persistência falha e recuperação da tentativa com a chave de idempotência existente. A camada de simulação não foi modificada.

## Verificação

- Testes de gradientes/favoritos foram executados antes da correção e detectaram os problemas; passaram após o ajuste.
- Comparação manual das capturas mobile com o Figma; baselines atualizados para as mudanças visuais intencionais.
- `pnpm check`: TypeScript, ESLint, formatação, 109 testes unitários e 6 testes de ferramentas.
- Revisão independente por `code-reviewer`: nenhum achado acionável no commit visual e na refatoração.
- Suíte completa: 222 E2E aprovados e 16 ignorados por viewport. No domínio público: 18 aprovados e 6 ignorados, incluindo gradientes/favoritos, imagens e os percursos mobile de 320 a 414 px. Headers, Brotli, cache, rotas e hash do HTML publicados também foram conferidos. Detalhes em `docs/TESTING.md` e `docs/DEPLOYMENT.md`.

O lint passou de 58 para 41 avisos nesta refatoração, sem erros. Permanecem avisos anteriores de tamanho em outras funções e de imports de dependências. Esta revisão não declara toda a base livre de dívida técnica. As referências de desempenho anteriores continuam vinculadas aos respectivos commits; não houve nova coleta de Lighthouse.
