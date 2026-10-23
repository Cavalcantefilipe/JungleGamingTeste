# Testes e verificações

## Resultado atual — revisão de performance e Figma

23/10/2026: `pnpm check` passou com **109 unitários em 28 arquivos e 6 testes Node de ferramentas**, além de tipos, lint sem erros e formatação. Build válido. Suíte Playwright completa: **210 aprovados/10 skips explícitos por viewport**, em 4,6 minutos, sem retries. Capturas de conferência separadas: **2/2**, cobrindo 18 estados em 1440 e 414 px; [15 referências originais e capturas](../reports/design/README.md).

`pnpm test:tooling` valida mediana/assertions (resultado abaixo da meta falha, coleta incompleta/runtime error não gera aprovação), integridade Brotli, negociação HTTP, fallback sem compressão, cache do worker, arquivos de um build novo e limpeza apenas dos relatórios gerados. O teste de geometria mobile também usa o tamanho original 414 px, verifica desnível de 32 px e conserva alvos de 44 px. O teste do rodapé mede contêiner/link no mesmo frame para evitar que uma mudança de altura da página entre duas leituras produza um diagnóstico falso.

O clone do código de aplicação `8b314b1` também passou instalação frozen, check (109 + 5 naquele checkpoint), build e 210 E2E/10 skips em 4,8 minutos. A revisão `87e20f0` modifica apenas o driver da auditoria e a retenção dos arquivos de relatório; tem seis testes Node e conserva a mesma aplicação. O hash do HTML foi idêntico ao worktree. As seções de checkpoints anteriores identificam os commits históricos; estes números não são uma alegação de nova certificação de segurança. [Resultado Lighthouse](LIGHTHOUSE.md).

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
- `15`: cores, dimensões, tipografia e alinhamentos medidos no Figma; controles circulares, taxa do carrinho, desnível mobile e raio de autenticação.
- `16`: texto de perfil não executa código e identidade adulterada não libera rota privada.
- `17`: AVIF responsivo, preload local, alvos de quantidade e feedback HTML antes do JavaScript/fonte.
- `18`: headers CSP de produção aplicados à navegação; catálogo, Socket.IO, carteira e compra sem violações.
- `19`: cenário inválido, falha/retry do worker e recuperação após logout com isolamento Ana/Bruno.
- `20`: edição autenticada da carteira durante conexão/criação de pedido, atualização dos dados e nova revisão sem perder carrinho/rascunho.
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

## Atualização de comportamento posterior ao clone

A revisão solicitada pelo usuário acrescentou o cadastro válido com merge/refresh/logout/login e a vinculação da compra ao endereço revisado. O teste `20` aguarda a latência registrada pelo MSW antes de editar a carteira por API autenticada; não depende apenas do evento de início de request nem usa sleep. A validação de domínio anterior criou um pedido para endereço diferente mesmo após reconectar: duas regressões falharam antes e passaram depois da correção. O terceiro unitário preserva replay de pedido antigo sem endereço no payload. Resultados atuais e limites em [BEHAVIOR-REVIEW.md](BEHAVIOR-REVIEW.md); os registros acima continuam identificando o commit histórico realmente auditado.

Verificação desta atualização: `pnpm check` com **109 unitários em 28 arquivos**, build válido e suíte completa Playwright com **209 aprovados/9 skips explícitos**. O novo cadastro mobile navega ao perfil para acessar logout, pois o carrinho mobile não apresenta o header. A primeira rodada registrou essa falha de seletor; após correção do teste, o caso focado e a suíte completa passaram.

## Checkpoint final em clone limpo — 87e20f0

Depois da fixação do driver e do teste de retenção de relatórios, o clone atualizado passou instalação frozen, `pnpm check` (**109 unitários + 6 testes Node**), build, `CI=true pnpm e2e` (**210 aprovados/10 skips, 4,7 minutos**) e Lighthouse (**12 execuções válidas, saída 0**). Aplicação e HTML mantêm o mesmo hash do checkpoint de UI `8b314b1`. Somente arquivos de relatório foram alterados pelos comandos; nenhuma mudança de código ocorreu no clone. O runtime do servidor de E2E foi verificado nesse diretório e o preview do worktree foi restaurado ao concluir.

A primeira coleta do clone com Puppeteer 25.16.0 falhou no cleanup da 12ª execução, após 11 runs completos. A coleta inteira foi refeita com 25.9.0, base declarada do Lighthouse; [histórico](../reports/lighthouse/checkpoints/history.json). Não houve retry automático ou seleção de runs por nota. O ajuste da ferramenta não alterou os limites.
