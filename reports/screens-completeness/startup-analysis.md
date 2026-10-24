# Diagnóstico do carregamento inicial

Coleta exploratória em 24/10/2026, sobre o código-base `d77c09a` e o delta local de startup. Os números abaixo não são Lighthouse, medianas nem uma promessa de tempo em todos os aparelhos. A validação formal pública posterior deve ser consultada separadamente.

## Causa e correção

O bootstrap esperava um `requestAnimationFrame`, depois iniciava a importação de ambiente e só então solicitava o módulo MSW. O código da página era solicitado após montar o Router, criando outra etapa de rede. Quando essa etapa ultrapassava os 150 ms configurados para mostrar o estado de carregamento, o padrão de 500 ms de `defaultPendingMinMs` do Router também mantinha o skeleton visível.

A alteração em `src/app/main.tsx` começa o bootstrap imediatamente e importa ambiente/MSW em paralelo. A validação de ambiente continua anterior à ativação do worker. `VITE_ENABLE_MOCKS=false` evita importar e iniciar MSW; valores inválidos continuam chegando ao tratamento acessível de falha inicial.

`src/app/preloadInitialRoute.ts` antecipa somente o código das rotas correspondentes ao pathname atual, pela API pública tipada `getMatchedRoutes`/`loadRouteChunk` do Router instalado. Não executa `beforeLoad`, loader ou chamadas de API. A montagem da aplicação continua aguardando o worker. Contratos, fixtures, stores, REST, Socket.IO e comportamento de autenticação não foram alterados.

O módulo MSW observado no build tinha aproximadamente 334 KB sem compressão/91 KB transferidos. Não removemos o worker: ele faz parte da aplicação simulada exigida pelo desafio. Na coleta Lighthouse anterior de Home mobile, a imagem do destaque já estava disponível antes do momento em que o catálogo podia renderizar. As fontes e imagens não explicam sozinhas essa espera pelo JavaScript.

## Comparação controlada

Arquivo bruto: [startup-latency200.json](./startup-latency200.json).

- Chromium, viewport 390 × 844, movimento reduzido, CPU sem redução de velocidade (`rate=1`).
- Builds de produção isolados com a mesma versão de mídia em todas as variantes. O baseline substituiu somente `main.tsx` pela versão de `HEAD`; o restante do código local era comum às variantes.
- `before`: bootstrap original. `stage1`: bootstrap imediato e imports de ambiente/MSW em paralelo. `stage2`: acrescenta antecipação do código da rota atual.
- Servidor HTTP local com Brotli, cache imutável em `/assets/` e `no-cache` nos demais arquivos, incluindo imagens públicas.
- Atraso real de 200 ms em **todas** as respostas HTTP, inclusive solicitações feitas pelo Service Worker. Sem limitação de banda, sem simulação de CPU e sem throttling CDP adicional.
- Flags funcionais: mocks habilitados, cenário `default`, API `/api`, URL de Socket.IO padrão. Cada variante iniciou em contexto vazio; `returning` foi reload no mesmo contexto, conservando cache e worker.
- Uma amostra por combinação. O catálogo padrão continha 48 NFTs, sem injetar dados de usuário.
- Valores em milissegundos **após `navigation.responseEnd`**, para separar o efeito do código da obtenção inicial do HTML.

| Variante | Visita | `<main>` no DOM | Primeiro card no DOM | Imagens visíveis prontas |
| --- | --- | ---: | ---: | ---: |
| before | cold | 1306.4 | 1830.4 | 2177.2 |
| before | returning | 59.1 | 194.5 | 482.9 |
| stage1 | cold | 1270.2 | 1795.1 | 2159.0 |
| stage1 | returning | 71.7 | 209.0 | 501.4 |
| stage2 | cold | 1282.0 | 1429.2 | 1905.0 |
| stage2 | returning | 53.8 | 186.9 | 479.3 |

Nesta amostra, o catálogo frio apareceu cerca de 401 ms antes (22%); as imagens visíveis ficaram prontas cerca de 272 ms antes (12,5%). O reload permaneceu próximo do baseline. Os marcadores são observações de DOM/imagens e não uma medição formal de tempo até interação. O script esperou nove cards visíveis antes de verificar `complete`/`naturalWidth` das imagens no viewport.

## Visita pública antes da alteração

Arquivo bruto: [startup-public-before.json](./startup-public-before.json). Foram observadas primeira visita e reload em contextos separados para 1440 e 390 px, com movimento reduzido e sem throttling. Inclui Resource Timing, marcos de renderização, URL do worker e apenas contagens do store.

A primeira navegação desktop teve `responseEnd` por volta de 3,31 s. A investigação HTTP independente registrou DNS de aproximadamente 3,07 s na primeira consulta e poucos milissegundos nas seguintes; não é correto atribuir esse trecho a processamento JavaScript ou inicialização do Railway. Consulte [initial-dns-timing.json](./initial-dns-timing.json), [initial-html-timing.json](./initial-html-timing.json) e [deployment-http.txt](./deployment-http.txt). A comparação local acima usa o instante posterior à resposta HTML para evitar essa confusão.

## Limites e validação

Uma tentativa exploratória de 2G/3G pelo CDP não limitou de modo consistente as solicitações emitidas pelo Service Worker. Seus números foram descartados da comparação; não há resultado confiável de banda 2G/3G neste relatório. O servidor com limitação real de banda foi encerrado sem iniciar outra rodada, para convergir a integração e deixar a coleta formal isolada. O ambiente local HTTP/1 e o Railway público também não são idênticos.

Os builds isolados de baseline, stage1 e stage2 concluíram durante a investigação, sem substituir o `dist` compartilhado. O teste focado final passou: **3 arquivos / 11 testes**, cobrindo bootstrap imediato, paralelismo dos imports, worker antes da montagem, mocks desabilitados, falhas de ambiente/worker e antecipação restrita aos componentes da rota. Log: [startup-unit.txt](./startup-unit.txt). A verificação global e o Lighthouse público pertencem aos artefatos posteriores da integração.

Comando unitário utilizado:

```sh
pnpm exec vitest run src/app/main.test.ts src/app/preloadInitialRoute.test.ts src/lib/env.test.ts
```
