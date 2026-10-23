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

## Publicação Railway — 23/10/2026

O mesmo `Caddyfile` usado pelo Railpack foi validado com Caddy 2.11.7 local: **210 E2E aprovados/10 skips explícitos, em 4,6 minutos**. `E2E_BASE_URL` permite executar a suíte contra outro origin sem iniciar o preview; as asserções de retorno à Home agora respeitam essa base.

No domínio [kurio-production-8274.up.railway.app](https://kurio-production-8274.up.railway.app), o build do commit `45cd7e1` passou **16 testes em 1,2 minuto**, oito em cada viewport: cadastro com carrinho, login com refresh, compra até o recibo, preço pelo socket sem novo REST, skeletons de catálogo/detalhe em rede lenta, CSP e recuperação isolada após logout. São contextos independentes com dados simulados. O caso CSP reaplica a política versionada; o script HTTP confere separadamente que a resposta pública já contém esses mesmos headers.

`pnpm verify:deployment https://kurio-production-8274.up.railway.app` passou: navegação direta nas rotas SPA, HTML, headers reais, cache, integridade Brotli versus identity, worker, healthcheck e 404 sem HTML indevido. O build remoto usou Node 24.21.0, pnpm 11.18.0, Railpack 0.43.0 e Caddy 2.11.7 em Linux/amd64; as auditorias de navegador foram executadas no Mac local. [Publicação](DEPLOYMENT.md) e [Lighthouse público](LIGHTHOUSE.md).

## Revisão de ícones, enquadramentos e textos mobile — 23/10/2026

Suíte completa: **219 aprovados/15 skips explícitos, 4,7 minutos**; `pnpm check`: **109 unitários + 6 testes Node**, typecheck, lint sem erros e formatação válidos. Depois dos últimos ajustes decorativos de tamanho dos ícones e fundo adaptável do hero, os cenários visuais, geometria, imagens e matriz mobile foram reexecutados: **40 aprovados/10 skips explícitos**. As capturas atualizadas incluem 1440 × 900, 414 × 896 e 320 × 844. Os baselines foram comparados às referências e revistos visualmente.

A regressão de recorte foi reproduzida primeiro em 320 px: nomes dos NFTs e título do rodapé. A navegação completa também revelou o recibo transbordando nessa largura. A revisão independente encontrou um indicador do hero coberto pelo bloco de texto; o teste agora clica nos três indicadores em cada largura.

O lint passa a ignorar `test-results`, diretório de artefatos temporários já ignorado pelo Git. Isso evita tentar ler arquivos de trace enquanto o Playwright os remove, sem excluir testes ou código-fonte da análise. Esta rodada usa Chromium; não comprova renderização em Safari/Firefox nem pontuações Lighthouse do novo build.

### Verificação pública da revisão mobile

A aplicação de `cf36ac1`, publicada pelo deploy `529ec4be-9b97-48c4-86a9-0be6f31fbbe6` do commit documental `c1ce70f`, passou **10 testes de imagens/ícones em desktop e mobile** e **5 fluxos completos mobile em 320/360/375/390/414 px**. O script HTTP também passou; o HTML e os três SVGs conferidos têm bytes idênticos aos arquivos locais validados.

Na primeira coleta pública a nova análise geométrica contou cartões fora da janela de um carrossel com rolagem horizontal como recortes. O teste foi corrigido para reconhecer contêineres roláveis, aguardar a coleção relacionada e clicar em “Próximos NFTs” até verificar cada título inteiro. Usar `scrollIntoViewIfNeeded` nesse caso disputava com `scroll-snap`; o fluxo final usa os controles reais e aguarda a posição visível. As cinco larguras passaram em 51,9 segundos, sem espera fixa nem retry automático. Essa correção altera apenas o teste, sem relaxar a verificação de textos truncados dentro dos cartões.

## Tokens e refatoração do frontend — 23/10/2026

Código da aplicação: `1b4551c`, incluindo o ajuste visual `e7b453d` e a refatoração do checkout `59a121a`.

- `pnpm check`: aprovado; 109 unitários, 6 testes de ferramentas, zero erros de lint e 41 avisos anteriores restantes (58 antes da refatoração).
- `pnpm build`: aprovado.
- `pnpm e2e`: **222 aprovados, 16 ignorados por viewport, 4,7 minutos**. Inclui a suíte completa, os oito baselines visuais e os percursos de nove telas nas cinco larguras mobile.
- `e2e/22-design-tokens.spec.ts`: verifica gradientes renderizados, posição do coração relativa à imagem, alvo de 44 px, hover, foco e uso por toque. Antes da correção, os três casos aplicáveis falharam; após o ajuste, passaram.
- Capturas finais: três percursos concluídos, 27 PNGs atualizados. Hashes e commit em `reports/design/manifest.json`.
- Revisão de código independente: nenhum achado acionável; sessão, cotação, carteira e recuperação idempotente preservadas.

A extração dos componentes manteve a composição visual: os baselines aprovados após o ajuste dos gradientes passaram novamente na suíte completa, sem atualização de screenshots durante a refatoração. Os testes de rascunho após expiração de sessão passaram com a assinatura `subscribe`.

No domínio público da Railway, sobre o mesmo código `1b4551c`, passaram **18 testes E2E**, com 6 ignorados por viewport, em 1 minuto: dez de imagens/ícones/alvos, cinco percursos mobile e três de gradientes/favoritos. `pnpm verify:deployment` também passou; o SHA-256 do HTML publicado coincide com o build local. Esses resultados não são uma nova auditoria Lighthouse.
