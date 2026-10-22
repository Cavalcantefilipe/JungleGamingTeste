# Camada de mocks (MSW)

Toda a "API" do Kurio vive no navegador, em `src/mocks`, e é ativada por `VITE_ENABLE_MOCKS=true` (padrão). O mesmo código serve desenvolvimento, build de demonstração e testes Playwright.

## Estrutura

| Pasta        | Responsabilidade                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `db/`        | banco simulado (`store.ts`), seeds (`seed.ts`) e fixtures determinísticas (48 NFTs, 2 usuários, cupons, imagens placeholder) |
| `handlers/`  | handlers REST finos por recurso (auth, nfts, favoritos, carrinho, cotação, pedidos, perfil, carteiras)                       |
| `shared/`    | regras de domínio puras (catálogo, carrinhos, pedidos, pricing, sessão, senha PBKDF2, transições agendadas)                  |
| `scenarios/` | registro de cenários nomeados, estado atual e simulação de rede (`withNetwork`)                                              |
| `socket/`    | servidor Socket.IO simulado, publicador de eventos e ticker de liquidação de pedidos                                         |
| `control.ts` | painel `window.__kurio` usado pelos testes e pela depuração                                                                  |

## Persistência e reset

O estado fica em `localStorage['kurio.mockdb.v1']` para sobreviver a refresh. `window.__kurio.reset(seed?)` restaura integralmente um seed conhecido (`default` ou `empty`). Mudar de cenário (`?scenario=` na URL, `localStorage['kurio.scenario']` ou `window.__kurio.setScenario`) só reseta o banco quando o seed do cenário muda.

## Tempo real: transporte e limitações

- O cliente usa `socket.io-client` real, com `transports: ['websocket']`, conectando em `VITE_SOCKET_URL` (`wss://realtime.kurio.app`).
- O servidor é simulado com `ws.link('<VITE_SOCKET_URL>/*')` do MSW e `toSocketIo(connection)` do `@mswjs/socket.io-binding`, que faz o handshake Engine.IO/Socket.IO e codifica os eventos como `[evento, payload]`.
- A interceptação acontece no próprio documento (o MSW substitui `window.WebSocket`); por isso o app só é importado depois de `worker.start()` (`src/app/main.tsx`). O service worker não participa do tráfego WebSocket.
- Autenticação: após conectar, o cliente emite `session` com o token; o servidor associa a conexão ao usuário e só entrega `order.updated` ao dono do pedido. `nft.updated` é broadcast.
- Eventos carregam `id` (UUID), `resource`, `version` e `occurredAt`. O cliente descarta duplicatas (por `id`) e versões antigas (por recurso) em `src/features/realtime/event-gate.ts`.
- Reconexão: ao reconectar, o cliente invalida as consultas ativas de NFTs, carrinho, cotação e pedidos e zera o gate, reconciliando com o REST.
- Limitações do binding: apenas namespace padrão, eventos de texto, sem acks, rooms ou binário. O "servidor" vive na mesma aba, portanto não há eventos entre abas diferentes do navegador.
- Cenários `duplicate-events` e `stale-events` fazem o servidor emitir cada evento duas vezes ou emitir uma versão antiga logo após a nova, para exercitar o gate.

## Cenários

Lista completa em `src/mocks/scenarios/registry.ts` (`window.__kurio.listScenarios()`).
