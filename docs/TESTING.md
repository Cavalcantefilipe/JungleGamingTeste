# Testes e verificações

## Executar

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm check
pnpm build
pnpm e2e
```

O worker MSW está versionado em `public/mockServiceWorker.js`. Os testes usam as APIs e o transporte Socket.IO interceptados; não dependem de uma blockchain ou servidor externo. Use Node 24 e pnpm 11. O Playwright inicia o preview em 4175, ou reutiliza um preview existente fora da CI. Não rode duas suítes Playwright simultâneas no mesmo checkout: elas compartilham relatório e artefatos.

## Cobertura

- Vitest: contratos, dinheiro decimal, idempotência, estoque/concorrência, falhas de persistência, autenticação, isolamento HTTP, corpo adulterado, carteiras e eventos.
- `00`–`05`: shell, catálogo, detalhe, autenticação, favoritos, carrinho/cupom/merge.
- `06`–`07`: compra, formulário, carteira, cotação, recusa, cliques repetidos, timeout e recuperação.
- `08`–`10`: conta, avatar/senha/carteiras, socket, reconciliação e troca de usuário no mesmo runtime.
- `11`: teclado, foco de login/drawer, anúncio de erro, axe, overflow e largura de 720px como aproximação de reflow a zoom 200% em desktop.
- `12`: skeletons medidos antes/depois, erro/retry, reduced motion e sessão lenta.
- `13`: referências visuais versionadas de Início, Detalhe, Carrinho e Pagamento em desktop/mobile.
- `15`: cores, dimensões e alinhamentos medidos no Figma; controles circulares e taxa do carrinho.
- `16`: texto de perfil não executa código e identidade adulterada não libera rota privada.
- `17`: AVIF responsivo, preload local, alvos de quantidade e feedback HTML antes do JavaScript/fonte.
- `18`: headers CSP de produção aplicados à navegação; catálogo, Socket.IO, carteira e compra sem violações.
- `19`: cenário inválido, falha/retry do worker e recuperação após logout com isolamento Ana/Bruno.
- Unitários de reconciliação: filtro, ordenação/composição da página e evento antes da primeira resposta REST.

Os números identificam os cenários do plano, não indicam arquivos ausentes obrigatórios. Testes específicos de desktop/mobile têm skips explícitos no outro projeto. Não são testes ignorados por falha.

Projetos: Chromium desktop **1440×900** e mobile **390×844**. O teste de layout também cobre 768px. axe cobre WCAG 2.0/2.1/2.2 A/AA e falha em impactos sérios/críticos; isso complementa teclado e geometria, sem equivaler a certificação ou teste com todos os leitores de tela.

## Regressão visual

As referências ficam em `e2e/__screenshots__/13-visual.spec.ts/`. Cenário `default`, reset de fixtures, relógio em `2026-07-29T12:00:00Z`, fontes/imagens carregadas, mouse neutro e animações desativadas. Imagens lazy são tornadas eager somente na captura para evitar screenshots com recursos ainda não carregados fora do viewport. O texto de feedback/toasts precisa desaparecer antes da captura.

```sh
pnpm exec playwright test e2e/13-visual.spec.ts
pnpm exec playwright test e2e/13-visual.spec.ts --update-snapshots=all
pnpm exec playwright show-report reports/playwright-report
```

Atualize referências somente após conferir a alteração no Figma e inspecionar o resultado. A tolerância de diferença de pixel é 1%; testes de geometria e cores complementam a comparação. Sistema operacional, versão do Chromium e renderização de fonte podem produzir diferenças; use ambiente equivalente ao gerar/comparar baselines.

A referência é o [Figma do desafio](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge). Medidas, assets originais e adaptações funcionais estão em [DESIGN-REVIEW.md](DESIGN-REVIEW.md). Não se gera baseline para simplesmente aceitar uma diferença desconhecida.

## Artefatos e limites

Relatório HTML em `reports/playwright-report` e traces/screenshots de falha em `test-results` são locais e ignorados pelo Git. Baselines e relatórios de segurança/performance aprovados são versionados. [SECURITY-REVIEW.md](SECURITY-REVIEW.md) descreve os testes de segurança e o limite do backend simulado; [DATA-PERFORMANCE.md](DATA-PERFORMANCE.md) contém a medição da persistência. Um browser mock não oferece garantias de banco compartilhado ou backend de produção.

## Gate de Lighthouse

`pnpm build && pnpm lighthouse` coleta três execuções por página/perfil e guarda HTML/JSON versionados. O comando conserva saída não zero quando uma mediana não atinge a meta. Consulte [LIGHTHOUSE.md](LIGHTHOUSE.md) para o resultado real; não trate a existência dos relatórios como aprovação. Evite concorrência de testes/build durante a coleta.

## Resultado da revisão final local

Depois da rodada única de correção: `pnpm check` com 106 unitários em 27 arquivos, build válido e Playwright com 203 aprovados/9 skips explícitos. O teste de teclado aguarda o conteúdo autoritativo da página 2 antes de navegar pelos novos cards: a URL muda antes dos dados por causa de keepPreviousData. Nenhuma espera fixa ou retry automático foi adicionado para encobrir falhas.

## Clone limpo verificado

Em 23/10/2026, um novo clone de `52bdb86cd91562a26530e69a1cbd66db67256ce3` passou `pnpm install --frozen-lockfile`, `pnpm check` (106), `pnpm build` e `CI=true pnpm e2e` (203/9 skips). A porta 4175 foi servida pelo próprio clone, com reuse desativado; o preview anterior foi restaurado ao terminar. `pnpm lighthouse` executou 12 auditorias e retornou 1 para Performance mobile 89/88, com as outras categorias em 100. Veja [LIGHTHOUSE.md](LIGHTHOUSE.md) para a limitação quantitativa; essa etapa não foi registrada como Lighthouse verde.
