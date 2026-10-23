# Testes e verificações

O resultado vigente, os commits publicados e as limitações estão em [QUALITY-REVIEW.md](QUALITY-REVIEW.md). As contagens de rodadas anteriores foram preservadas em [TESTING-HISTORY.md](TESTING-HISTORY.md), com os respectivos checkpoints.

## Executar

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
pnpm check
pnpm build
pnpm e2e
pnpm e2e:compat
```

Node 24 e pnpm 11. O worker MSW está versionado. REST e Socket.IO são interceptados; não dependem de API, blockchain ou banco externos. `pnpm lint` usa `--max-warnings=0`: avisos também reprovam o gate. `pnpm check` inclui tipos, lint, formatação, Vitest e testes Node das ferramentas.

O preview usa 4175. Fora da CI, o Playwright pode reutilizar o preview existente; em CI ele inicia o próprio servidor. `E2E_BASE_URL` permite verificar um deploy existente. Rode uma única suíte Playwright por vez no checkout e faça build após mudar a aplicação.

## Projetos

- `pnpm e2e`: Chromium desktop 1440×900 e mobile 390×844, suíte completa com baselines.
- `pnpm e2e:compat`: Firefox desktop 1440×900 e WebKit mobile 390×844; cenários `00`–`11` e `25`, incluindo favoritos. Baselines de Chromium não são reutilizados entre engines.
- WebKit automatizado não equivale a um teste em iPhone físico/Safari instalado.

As fixtures aguardam o destino renderizado após login/compra; mudança da URL sozinha pode preceder o commit visual da navegação SPA. Não há espera fixa nem retry automático para encobrir falhas. O teste de pedido pendente controla o relógio e a confirmação autoritativa. No WebKit/macOS, o percurso completo de teclado usa Option+Tab, preservando as preferências do sistema ([comportamento documentado no projeto Playwright](https://github.com/microsoft/playwright/issues/41808)).

## Cobertura

- Vitest: contratos, dinheiro decimal, idempotência, estoque/concorrência, falhas de persistência, autenticação, isolamento HTTP, corpo adulterado, carteiras e eventos.
- `00`–`05`: shell, catálogo, detalhe, autenticação, favoritos, carrinho/cupom/merge.
- `06`–`07`: compra, formulário, carteira, cotação, recusa, cliques repetidos, timeout e recuperação.
- `08`–`10`: conta, avatar/senha/carteiras, socket, reconciliação e troca de usuário no mesmo runtime.
- `11`: teclado, foco de login/drawer, anúncio de erro, axe, overflow e largura de 720px como aproximação de reflow a zoom 200% em desktop.
- `12`: skeletons medidos antes/depois, erro/retry, reduced motion e sessão lenta.
- `13`: referências visuais versionadas de Início, Detalhe, Carrinho e Pagamento em desktop/mobile.
- `15`: cores, dimensões, tipografia e alinhamentos medidos no Figma; controles circulares, taxa do carrinho, desnível mobile e raio de autenticação.
- `16`: texto de perfil não executa código e identidade adulterada não libera rota privada.
- `17`: AVIF responsivo, preload local, alvos de quantidade, feedback HTML, proporções editoriais, ausência de zoom e carregamento dos ícones SVG.
- `18`: headers CSP de produção aplicados à navegação; catálogo, Socket.IO, carteira e compra sem violações.
- `19`: cenário inválido, falha/retry do worker e recuperação após logout com isolamento Ana/Bruno.
- `20`: edição autenticada da carteira durante conexão/criação de pedido, atualização dos dados e nova revisão sem perder carrinho/rascunho.
- `21`: nove telas em 320/360/375/390/414 px; leitura de textos, ausência de recortes, separação de ações e cliques nos três destaques do hero.
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

## Cobertura acrescentada na conferência final

- `22`: tokens/gradientes e favoritos por hover, foco e toque.
- `23`–`24`: conferência de detalhes por tela e captura dos estados de referência.
- `25`: login/cadastro em 640, 720 e 767 px e recibo em 720 px; largura total, ação final alcançável e erros visíveis.
- `stock-reservations.test.ts`: quatro cenários de dois usuários comprando 5 e 7 de estoque 10, com ambas as ordens de chegada, confirmação única e liberação após recusa.
- Zoom nativo de 200% no Chrome: nove telas/estados, medições e PNGs em `reports/quality/`. O teste `25` é reflow por viewport; não substitui essa verificação manual.

## Artefatos e limites

Relatórios locais HTML: `reports/playwright-report` e `reports/playwright-compat`. Traces/screenshots de falha ficam em `test-results` ou no diretório escolhido por `--output`. Esses artefatos temporários são ignorados pelo Git; baselines, resumos e evidências selecionadas são versionados.

Axe, teclado, geometria e zoom complementam-se. A tentativa de VoiceOver ficou inconclusiva e não é contada como aprovação de leitor de tela. Veja [QUALITY-REVIEW.md](QUALITY-REVIEW.md). Os testes de sessão/compra exercitam a simulação: não certificam banco compartilhado ou backend de produção.

## Lighthouse e dependências

```sh
pnpm lighthouse
pnpm audit
pnpm audit --prod
```

Lighthouse coleta três execuções por página/perfil, conserva falha abaixo das metas e interrompe em erro técnico. Não execute builds, testes ou navegação simultâneos à coleta. Configurações, medição final pública e histórico: [LIGHTHOUSE.md](LIGHTHOUSE.md). Auditorias de dependências são consultas pontuais ao registro; o resultado é preservado em `reports/quality/`.
