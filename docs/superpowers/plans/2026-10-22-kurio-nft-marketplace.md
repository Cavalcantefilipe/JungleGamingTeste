# Kurio NFT Marketplace — Plano de Implementação

> **Para o agente executor:** SUB-SKILL OBRIGATÓRIA: use `superpowers:subagent-driven-development` (recomendado) ou `superpowers:executing-plans` para implementar este plano tarefa por tarefa. Os passos usam checkboxes (`- [ ]`) para acompanhamento. Antes de cada tarefa de UI, releia a seção **2. Design System** e a seção **5. Regras de código**. Nunca pule os passos de teste.
>
> **Primeiro commit:** copie este arquivo para `docs/superpowers/plans/2026-10-22-kurio-nft-marketplace.md` e mova o enunciado para `docs/CHALLENGE.md`.

**Objetivo:** entregar, em 2 dias (prazo: 24/10/2026), o NFT Marketplace "Kurio" do desafio Jungle Gaming com fidelidade ao Figma, fluxos completos (descoberta → compra → conta), mocks MSW + Socket.IO determinísticos, E2E Playwright, auditoria Lighthouse e deploy público, sem falhas de layout ou comportamento e com segurança levada a sério.

**Arquitetura:** SPA React 19 + TypeScript com TanStack Router (file-based, estado na URL), TanStack Query (estado remoto, invalidação, otimista) e Axios como único transporte. Toda a "API" vive em MSW 2.x no browser: handlers REST + servidor Socket.IO simulado via `@mswjs/socket.io-binding`, ambos lendo/escrevendo um único mock store persistido em `localStorage`, com cenários nomeados e reset total. Contratos zod compartilhados entre mocks, transporte e UI. Organização por feature.

**Stack:** Vite 7, React 19, TypeScript 5.9, TanStack Router 1.170+, TanStack Query 5, Axios 1.20, MSW **2.15** (não 3.x), `@mswjs/socket.io-binding` 0.2, socket.io-client 4.8, Tailwind CSS 4, shadcn/ui (Radix), zod 4, react-hook-form 7, big.js, Playwright 1.64, `@axe-core/playwright`, Lighthouse CI 0.15, Vitest 5, pnpm 11, deploy Vercel.

**Spec:** `/Users/filipecavalcante/Documents/JungleGamingTeste/README.md` (enunciado do desafio; mover para `docs/CHALLENGE.md`). Figma (view-only, público): https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge?node-id=0-1

---

## 0. Contexto

- A pasta do projeto contém apenas o `README.md` do desafio. Tudo é greenfield.
- Máquina: Node 24.12, pnpm 11.18, git 2.50, gh 2.87. Sem Vercel CLI, sem Figma MCP/token.
- O Figma foi inspecionado pelo planejador via Chrome (view-only): marca **KURIO**, página "Marketplace de NFTs GreenMint", 9 frames desktop (1440px) e 6 frames mobile (414px). Tokens, tipografia e composição estão na seção 2 — **use-os como fonte da verdade** e confira no Figma quando houver dúvida.
- Comentários públicos no Figma (de outros revisores) apontam inconsistências do próprio layout: espaçamento assimétrico entre linhas de cards, primeira coluna desalinhada com a sidebar, nav central 1-2px fora do eixo vertical, modal de Criar conta sem backdrop. **Decisão:** normalizar para um grid consistente (8px), adicionar backdrop 60% nos modais e registrar cada desvio em `ARCHITECTURE.md`.
- Critérios eliminatórios do enunciado (nunca negociáveis): uso efetivo de toda a stack; fluxos principais funcionais (não só visuais); compra confirmada **somente** com resposta da simulação; zero vazamento de dados entre usuários; eventos de tempo real **sempre** via `socket.io-client` (nunca setters/callbacks diretos na UI); testes E2E executáveis.
- Prioridade por pontos: Fidelidade visual + responsividade (20), Fluxos (20), Integração/estado (15), Tempo real (10), Mocking (10), Testes (10), A11y (5), Performance (5), Arquitetura/docs (5).

## 1. Decisões de versão (fixar no `package.json`)

| Pacote | Range | Motivo |
| --- | --- | --- |
| `msw` | `^2.15.0` | `@mswjs/socket.io-binding@0.2.0` declara peer `msw ^2.10.2`; MSW 3 renomeia eventos (`websocket:connection`) e não tem binding publicado compatível. |
| `@mswjs/socket.io-binding` | `^0.2.0` | API `toSocketIo(connection)` → `io.client.on/emit`. Suporta apenas namespace default e eventos de texto (sem acks/binário/rooms). |
| `socket.io-client` | `^4.8.0` | Cliente real exigido pelo enunciado. Conectar com `transports: ['websocket']`. |
| `vite` / `@vitejs/plugin-react` | `^7.3` / `^5.2` | Vite 8 (rolldown) e plugin-react 6 são recentes demais para um prazo de 2 dias. |
| `typescript` | `~5.9.3` | TS 7 (tsgo) é novo; 5.9 é o piso do ecossistema atual. |
| `@tanstack/react-router` + `@tanstack/router-plugin` | `^1.170` / `^1.168` (pares) | File-based routing + `autoCodeSplitting`. |
| `@tanstack/react-query` | `^5.104` | |
| `tailwindcss` + `@tailwindcss/vite` | `^4.3` | Config CSS-first, sem `tailwind.config.js`. |
| `shadcn` CLI | latest | `pnpm dlx shadcn@latest init` com Radix (padrão), estilo new-york, CSS variables. |
| `zod` | `^4.6` | Usado direto em `validateSearch` (Standard Schema). |
| `big.js` | `^7` | Aritmética decimal para ETH como string. |
| `@playwright/test` | `^1.64` | Chromium, projetos desktop 1440×900 e mobile 390×844. |
| `@lhci/cli` | `^0.15` | 3 execuções por página/perfil, mediana, relatórios HTML/JSON. |
| `eslint` | `^9` | + `typescript-eslint` strict-type-checked, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`. |

Variáveis de ambiente (`.env.example`, todas públicas):

```
VITE_API_BASE_URL=/api
VITE_SOCKET_URL=wss://realtime.kurio.app
VITE_ENABLE_MOCKS=true
VITE_MOCK_SCENARIO=default
```

## 2. Design System (extraído do Figma)

### 2.1 Tipografia

- Família única: **Roboto Mono** (variável `font/family` no Figma). Self-host com `@fontsource/roboto-mono` pesos 400, 500, 700, `font-display: swap`, preload só do 400 latin.
- Estilos Figma → classes utilitárias:

| Grupo | Variantes (size/line-height, peso) |
| --- | --- |
| Display | 43/70 Bold (`text-display`), 32/auto Bold |
| Heading | 28 Bold, 26/32 Bold, 24 Bold |
| Title | 23/16, 22/16, 22/29 Regular, 21/16, 20/28 Regular, 20/16 Medium, 20/16 Bold |
| Body Large | 19/29 Bold; 18 Bold/Regular/Light/Medium (lh 16, 24, 25); 17 Bold, 17 Regular (lh 16/24); 16 Bold lh 16; 16 Regular lh 22; 16 Medium lh 100% |
| Body | 15 Medium/Regular/Bold (lh 15/16/40/45); 14 Regular/Medium/Bold (lh 15/16/20/22/24/30/auto) |
| Caption | 13 Regular lh 16/22, 13 Medium, 12 Regular lh 16/18, 12 Bold |
| Tiny | 11 Medium lh 16, 10 Medium, 9 Bold |

Medições diretas: H1 do hero = Display 43/70 Bold, cor Foreground; parágrafo do hero = Body 14/24 Regular, cor Text/Secondary; label de botão primário = 16/20 Bold, cor Ink; "Entrar" do header = 16 Medium lh 100%, cor Ink.

### 2.2 Paleta (tokens CSS em `src/styles/tokens.css`)

| Token Figma | Hex | Variável CSS | Uso |
| --- | --- | --- | --- |
| Color/Ink | `#140D0A` | `--color-ink` | fundo de página, texto sobre laranja |
| Color/Surface Card | `#241612` | `--color-surface-card` | cards, inputs |
| Color/Surface Raised | `#2F1D15` | `--color-surface-raised` | cards elevados, resumo do carrinho |
| Color/Surface Dark | `#38220F` | `--color-surface-dark` | faixa da marca no footer |
| Color/Border | `#3F2319` | `--color-border` | bordas padrão |
| Color/Border Soft | `#55321F` | `--color-border-soft` | bordas de destaque |
| Color/Primary | `#D28A4C` | `--color-primary` | botões, links ativos, divisor do header (0.3px) |
| Color/Primary Light | `#DD9A5F` | `--color-primary-light` | hover |
| Color/Primary Dark | `#C47B3E` | `--color-primary-dark` | active/pressed |
| Color/Amber | `#E3A44E` | `--color-amber` | badges (RARO), medalhões do footer |
| Color/Secondary | `#B39463` | `--color-secondary` | ícones secundários |
| Color/Foreground | `#F5F1EB` | `--color-foreground` | texto principal |
| Text/Primary | creme levemente mais quente que Foreground (descrição no Figma; confirmar hex selecionando um texto que o use) | `--color-text-primary` | |
| Text/Secondary | `#CEB28C` | `--color-text-secondary` | parágrafos, labels |
| Text/Accent | `#E89B55` | `--color-text-accent` | preços, links |
| Text/Coral | `#EA6B4F` | `--color-text-coral` | destaque |
| Color/Success | `#00A66C` | `--color-success` | pedido confirmado |
| Color/Error | `#ED1B2E` | `--color-error` | erros de formulário, recusa |
| Color/Gray Light | `#EDEDED` | `--color-gray-light` | |
| Color/Background Elevated | `#FBFBFB` | `--color-bg-elevated` | |
| Color/White / Black | `#FFFFFF` / `#000000` | | |
| Logo/* | azul Facebook, azul/verde/amarelo Google | | ícones dos botões sociais |

Regras: nenhum hex hardcoded fora de `tokens.css`; Tailwind v4 `@theme` mapeia cada variável (`--color-ink` → `bg-ink`, `text-foreground` etc.). Backdrop de modais: `rgb(0 0 0 / 0.6)`.

### 2.3 Layout e métricas

- Desktop: frame 1440, padding lateral 120 → conteúdo **1200px**, padding vertical 24, gap entre seções **96px**. Header: logo "KURIO" à esquerda, nav central (Início, Mercado, Criadores, Aprenda; ativo em laranja com sublinhado), ações à direita (busca, carrinho com badge, botão "Entrar" laranja com ícone). Linha divisória 0.3px Primary abaixo do header.
- Hero (Início): texto à esquerda ("Bem-vindo à Kurio" / H1 "SEJA DONO DO FUTURO DA ARTE DIGITAL" / parágrafo / botão "EXPLORAR"), imagem 450×450 radius 24 à direita, dots de carrossel. Seção 1200 fill, gap 32.
- Catálogo (seção "Products", 1200 fill, gap 48): sidebar esquerda (≈280px) com "Coleções" (categorias com contagem: Arte digital, Fotografia, Música, Arte 3D, Colecionáveis, Generativo, Jogos, Assinaturas, Utilidade), "Faixa de preço" (slider duplo 0,02–12,30 ETH + botão "Aplicar"), "Rede" (Ethereum, Polygon, Solana com contagem) e card "NFT EM DESTAQUE / OFERTA LIMITADA". À direita: tabs "Todos os NFTs | Novos lançamentos | Em alta", "Ordenar por: Listados recentemente", grid **3 colunas × 3 linhas = 9 por página**, card = imagem quadrada radius ~12, nome (14 Bold), preço em Accent (14 Bold, "1.19 ETH"), preço riscado opcional, ícones de favorito/compartilhar no hover, badge "RARO" (Amber). Paginação "1 2 3 4 ›" alinhada à direita.
- Promos: 2 banners lado a lado (imagem esquerda + título 2 linhas + texto + botão "Explorar →"), 1200×250, `justify: space-between`.
- Blog "Diário da Cunhagem": título centralizado + subtítulo, 4 cards (imagem, "12 de setembro | Leitura de 6 min", título 2 linhas, resumo, "Ler mais →"), gap 40. Conteúdo estático (fora do escopo funcional).
- Footer (componente "Footer", 1200×610): 3 medalhões (círculo Amber com letra W/C/D + título + texto) + newsletter (input "digite seu e-mail..." + botão "Enviar"); faixa Surface Dark com "KURIO | Feito para colecionadores, criadores e cultura | contato@email.com | +55 11 4002 8922"; 4 colunas de links (Meu perfil, Central de ajuda, Coleções, Redes sociais + "Carteiras compatíveis" chips METAMASK • WALLETCONNECT • COINBASE); copyright "© 2026 Kurio. Propriedade digital para todos." Fica **abaixo** do backdrop de modais.
- Botão primário: 140×40, radius 6, padding 10/36/10/28, fundo Primary, texto Ink 16 Bold. Inputs: fundo Surface Card, borda Border, radius 6, altura 40, placeholder Text/Secondary; foco com borda Primary.
- Mobile (414×896, padding 24 lateral; telas de auth padding 80 topo / 28 lateral, gap 40): layout de app com **tab bar inferior** (Início, Favoritos, Carrinho com badge, Perfil). Início: barra "Explorar coleções" + botão de filtros (abre drawer com os mesmos filtros da sidebar), hero em card, tabs, grid 2 colunas. Detalhes: imagem grande, título + chip "★ 4.8 (19)", chips de edição (1/10, 1/1, 1/50, ABERTA), barra inferior fixa com "Qtd. − 1 +", preço e botões "Comprar NFT" + carrinho. Carrinho: lista + cupom + resumo + "Conectar e finalizar". Pagamento: "Carteira conectada" (cards de carteira com radio e menu ⋮, link "Trocar carteira"), "Carteira e rede" (WalletConnect, MetaMask, Coinbase Wallet com radio), "Total" e "Confirmar compra". Login/Cadastro: logo KURIO centralizado, título, campos, botão, "Ou continue com" + Google/Facebook, link de alternância.
- Breakpoints a validar: 390, 768, 1440 (mín.). Tablet (768): grid 2 colunas, sidebar vira drawer, header mantém logo + ações, nav vira menu.

### 2.4 Telas e estados obrigatórios (resumo)

| Rota | Tela Figma | Estados além do padrão |
| --- | --- | --- |
| `/` | Desktop/Mobile Início | skeleton, vazio ("Nenhum NFT encontrado" + limpar filtros), erro (+ tentar novamente), atualizando em segundo plano |
| `/nfts/$nftId` | Detalhes do NFT | skeleton, 404 ("NFT não encontrado"), edição indisponível (chip desabilitado), limite de quantidade (stepper trava no `available`), preço alterado (banner) |
| `/cart` | Carrinho de NFTs | skeleton do resumo, vazio, cupom inválido/expirado, item com preço/disponibilidade alterado (destaque + "atualizar") |
| `/checkout` | Pagamento | exige auth; revisão; cotação desatualizada (bloqueia + "Revisar nova cotação"); carteira recusada/desconectada; pedido pendente (spinner + "não feche"); erro transitório |
| `/orders/$orderId` | Confirmação de Pedido | pendente / confirmado (modal com Etherscan simulado) / recusado (vermelho + "Tentar novamente" volta ao checkout); recuperação pós-refresh |
| `/login`, `/register` | Login, Cadastro | validação, credenciais inválidas, e-mail em conflito (409), retorno ao fluxo anterior (`returnTo`) |
| `/account/profile` | Perfil do Colecionador | validação, erros da API, senha atual errada, avatar (tipo/tamanho) |
| `/account/wallets` | Carteiras | principal/secundária, "Igual à carteira principal", validação de endereço |
| `*` | — | 404 no mesmo padrão visual |

## 3. Arquitetura

### 3.1 Estrutura de pastas

```
.
├── docs/                      CHALLENGE.md, ARCHITECTURE.md, CONTRACTS.md, MOCKS.md, TESTING.md, LIGHTHOUSE.md, superpowers/plans/
├── e2e/                       specs Playwright, fixtures, helpers, __screenshots__ (baselines versionadas)
├── lighthouse/                lighthouserc.desktop.json, lighthouserc.mobile.json, run.mjs
├── public/                    mockServiceWorker.js, favicon, robots.txt
├── reports/                   playwright-report/, lighthouse/ (HTML/JSON de LH versionados)
├── src/
│   ├── app/                   providers.tsx, query-client.ts, router.tsx, main.tsx
│   ├── routes/                file-based: __root.tsx, index.tsx, nfts.$nftId.tsx, cart.tsx, checkout.tsx,
│   │                          orders.$orderId.tsx, login.tsx, register.tsx, _account.tsx, _account.account.profile.tsx,
│   │                          _account.account.wallets.tsx, $.tsx (404)
│   ├── contracts/             zod schemas + tipos (common, money, nft, auth, cart, quote, order, profile, wallet, realtime)
│   ├── features/
│   │   ├── catalog/           search-params.ts, api.ts, queries.ts, components/ (FilterSidebar, NftGrid, NftCard, Pagination, SortSelect, CatalogTabs, FeaturedCard)
│   │   ├── nft-detail/        api.ts, queries.ts, components/ (Gallery, EditionPicker, QuantityStepper, PurchasePanel, DetailTabs, RelatedCarousel)
│   │   ├── favorites/         api.ts, queries.ts, useToggleFavorite.ts, FavoriteButton.tsx
│   │   ├── cart/              api.ts, queries.ts, cart-scope.ts, components/ (CartTable, CartItemRow, CartSummary, CouponField)
│   │   ├── checkout/          api.ts, queries.ts, quote.ts, checkout-draft.ts, wallet-connection.ts, components/ (CollectorForm, OrderReview, WalletNetworkPicker, StaleQuoteBanner)
│   │   ├── orders/            api.ts, queries.ts, pending-order.ts, components/ (OrderStatusCard, OrderReceiptModal)
│   │   ├── auth/              session-store.ts, api.ts, mutations.ts, route-guard.ts, components/ (AuthDialog, LoginForm, RegisterForm, SocialButtons)
│   │   ├── profile/           api.ts, queries.ts, components/ (ProfileForm, AvatarField, PasswordForm)
│   │   ├── wallets/           api.ts, queries.ts, components/ (WalletForm, WalletCard, SecondaryWalletSection)
│   │   ├── realtime/          socket.ts, event-gate.ts, apply-event.ts, RealtimeProvider.tsx, useRealtimeReconciliation.ts
│   │   └── layout/            Header.tsx, MobileTabBar.tsx, Footer.tsx, AccountSidebar.tsx, PageShell.tsx
│   ├── components/
│   │   ├── ui/                shadcn (button, input, label, select, dialog, drawer, sheet, tabs, checkbox, radio-group, slider, badge, skeleton, sonner, form, dropdown-menu, tooltip, separator)
│   │   └── feedback/          skeletons.tsx (NftCardSkeleton, DetailSkeleton, SummarySkeleton, FormSkeleton), EmptyState, ErrorState, LiveRegion
│   ├── lib/                   http.ts, money.ts, storage.ts, query-keys.ts, idempotency.ts, errors.ts, cn.ts, env.ts
│   ├── mocks/
│   │   ├── browser.ts         startMocks()
│   │   ├── control.ts         window.__kurio (reset/setScenario/setNetwork/emit/getState/advanceOrder)
│   │   ├── db/                schema.ts, seed.ts, store.ts, fixtures/ (nfts.ts, users.ts, coupons.ts, images.ts)
│   │   ├── handlers/          index.ts, auth.ts, nfts.ts, favorites.ts, cart.ts, quote.ts, orders.ts, profile.ts, wallets.ts, wallet-session.ts
│   │   ├── scenarios/         registry.ts, network.ts, current.ts
│   │   ├── socket/            server.ts, events.ts
│   │   └── shared/            respond.ts (envelope de erro), session.ts, pricing.ts, hash.ts, timing.ts, password.ts
│   └── styles/                tokens.css, globals.css
├── .env.example, vercel.json, playwright.config.ts, vite.config.ts, tsconfig.json, eslint.config.js, .prettierrc, .nvmrc (24)
```

### 3.2 Fluxo de dados

`Componente → hook de feature (TanStack Query) → api.ts da feature (Axios + zod parse) → MSW handler → mock store`. Componentes nunca importam axios nem conhecem mocks. Hooks nunca contêm dados fictícios. A camada de mocks é a única com `if (scenario...)`.

### 3.3 Sessão e segurança

- Login retorna `{ token (opaco, 32 bytes hex), expiresAt (ISO 8601, 30 min no cenário default), user }`. Token guardado em `localStorage['kurio.session']` e enviado em `Authorization: Bearer`. Trade-off documentado: num backend real seria cookie HttpOnly + CSRF; aqui o "backend" é o próprio bundle.
- Senhas no mock: **nunca em claro** — `PBKDF2(SHA-256, 100k iterações, salt aleatório)` via Web Crypto, armazenado como `{ salt, hash }`. Registro exige senha ≥ 8 chars com letra e número.
- Rate limit no mock de login: 5 falhas por e-mail em 5 min → `429 TOO_MANY_ATTEMPTS`.
- Todo handler privado resolve o usuário pelo token; expirado → `401 SESSION_EXPIRED`; recurso de outro usuário → `403 FORBIDDEN` (nunca 404 que vaze existência). Favoritos, carrinho, pedidos, perfil, carteiras são filtrados por `userId`.
- Logout/troca de usuário: `queryClient.clear()`, `socket.disconnect()`, limpar `kurio.session`, `kurio.checkoutDraft.*`, `kurio.pendingOrder`; o carrinho de visitante é separado (`kurio.guestId`).
- Query keys privadas incluem `userId` para isolamento do cache mesmo sem clear.
- Headers Vercel (`vercel.json`): CSP `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' wss://realtime.kurio.app; worker-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. SPA rewrite `/(.*) → /index.html`.
- Proibido: `dangerouslySetInnerHTML`, `eval`, `any`, `!` non-null, dados pessoais em query string, segredos no repo. Validação com zod no cliente **e** nos handlers.
- Avatar: aceitar apenas `image/png|jpeg|webp`, ≤ 2 MB, validar magic bytes, armazenar como data URL no mock.
- Endereço de carteira: Ethereum/Polygon `^0x[a-fA-F0-9]{40}$`; Solana base58 32–44 chars.
- Idempotência de pedidos: header `Idempotency-Key` (UUID v4) + hash SHA-256 do corpo canônico; mesma chave + mesmo hash → mesmo pedido (200); mesma chave + hash diferente → `409 IDEMPOTENCY_CONFLICT`.

### 3.4 Contratos REST (base `/api`, JSON, erros no envelope `{ error: { code, message, fields? } }`)

| Método e rota | Auth | Corpo / query | Resposta | Erros |
| --- | --- | --- | --- | --- |
| `POST /auth/register` | – | `{ username, email, password }` | `201 { token, expiresAt, user }` | 422 VALIDATION, 409 EMAIL_TAKEN / USERNAME_TAKEN |
| `POST /auth/login` | – | `{ email, password }` | `200 { token, expiresAt, user }` | 401 INVALID_CREDENTIALS, 429 TOO_MANY_ATTEMPTS |
| `GET /auth/session` | sim | – | `200 { user, expiresAt }` | 401 SESSION_EXPIRED / UNAUTHENTICATED |
| `POST /auth/logout` | sim | – | `204` | |
| `GET /nfts` | opcional | `q, category[], network[], minPrice, maxPrice, sort, tab, page, pageSize=9, favorites` | `200 { items: Nft[], page, pageSize, total, totalPages, facets: { categories: {key,count}[], networks: {key,count}[] } }` | 422, 401 (se `favorites=true` sem auth) |
| `GET /nfts/:id` | – | – | `200 Nft` | 404 NOT_FOUND |
| `GET /favorites` | sim | – | `200 { nftIds: string[] }` | |
| `PUT /favorites/:nftId` / `DELETE /favorites/:nftId` | sim | – | `204` | 404, 503 TRANSIENT (cenário) |
| `GET /cart` | sessão **ou** `X-Guest-Id` | – | `200 Cart` | |
| `POST /cart/items` | idem | `{ nftId, editionId, quantity }` | `200 Cart` | 409 UNAVAILABLE (qtd > disponível), 404 |
| `PATCH /cart/items/:itemId` | idem | `{ quantity }` | `200 Cart` | 409 UNAVAILABLE |
| `DELETE /cart/items/:itemId` | idem | – | `200 Cart` | |
| `POST /cart/merge` | sim | `{ guestId }` | `200 Cart` | |
| `POST /quote` | opcional | `{ items: {nftId, editionId, quantity}[], couponCode?, network? }` | `200 Quote` | 422 COUPON_INVALID / COUPON_EXPIRED, 409 UNAVAILABLE |
| `POST /orders` | sim + `Idempotency-Key` | `{ quoteId, items, couponCode?, wallet: { walletId, provider, network }, collector: {...} }` | `201 Order` (status `pending`) ou `200 Order` (chave repetida) | 409 QUOTE_STALE (+ `quote` nova no corpo), 409 IDEMPOTENCY_CONFLICT, 409 UNAVAILABLE, 403 WALLET_REJECTED, 503 TRANSIENT, timeout (cenário) |
| `GET /orders/:id` | sim | – | `200 Order` | 403, 404 |
| `GET /profile` / `PATCH /profile` | sim | `{ displayName, username, email, ensName, walletNickname }` | `200 Profile` | 422, 409 USERNAME_TAKEN |
| `POST /profile/avatar` | sim | `{ dataUrl }` | `200 Profile` | 422 INVALID_IMAGE |
| `POST /profile/password` | sim | `{ currentPassword, newPassword }` | `204` | 422 WRONG_PASSWORD |
| `GET /wallets` | sim | – | `200 { primary: Wallet \| null, secondary: Wallet \| null, sameAsPrimary: boolean }` | |
| `PUT /wallets/:role` (`primary` \| `secondary`) | sim | `WalletInput` ou `{ sameAsPrimary: true }` | `200 Wallets` | 422 |
| `POST /wallet-session/connect` | sim | `{ walletId, provider }` | `200 { status: 'connected', address }` | 403 WALLET_REJECTED, 409 WALLET_DISCONNECTED |

Tipos centrais (zod em `src/contracts`):

```ts
EthAmount = string  // /^\d+(\.\d{1,6})?$/  — nunca number
Nft = { id, slug, name, tokenId, collection, category, network: 'ethereum'|'polygon'|'solana', price: EthAmount,
        compareAtPrice?: EthAmount, rarity?: 'raro', rating: { average: number, count: number }, description,
        attributes: { label, value }[], images: { src, alt, width, height }[],
        editions: { id, label: '1/10'|'1/1'|'1/50'|'aberta', available: number, max: number|null }[],
        badges: ('featured'|'limited'|'new'|'trending')[], listedAt, version: number }
Cart = { id, scope: { kind: 'guest'|'user', id }, items: CartItem[], updatedAt }
CartItem = { id, nftId, editionId, quantity, unitPrice: EthAmount, nftVersion: number, snapshot: { name, image, editionLabel } }
Quote = { id, items: { nftId, editionId, quantity, unitPrice, lineTotal, available }[], subtotal, discount, networkFee, total,
          coupon?: { code, status: 'applied'|'invalid'|'expired', percent? }, network, version, expiresAt }
Order = { id, userId, status: 'pending'|'confirmed'|'declined', items: QuoteItem[], subtotal, discount, networkFee, total,
          wallet: { provider, address, network }, transactionRef, explorerUrl, createdAt, updatedAt, version,
          declineReason?: string }
RealtimeEvent = { id: uuid, type: 'nft.updated'|'order.updated', resource: { kind: 'nft'|'order', id }, version: number,
                  occurredAt, payload: Partial<Nft> | Pick<Order,'status'|'transactionRef'|'declineReason'|'updatedAt'> }
```

### 3.5 Tempo real (Socket.IO via MSW)

- Cliente: `createSocket(token)` → `io(env.socketUrl, { transports: ['websocket'], auth: { token }, autoConnect: false })`. `RealtimeProvider` conecta quando há sessão **ou** carrinho não vazio (eventos `nft.updated` são públicos) e reconecta ao mudar de usuário com socket novo.
- Mock: `ws.link(env.socketUrl)` **sem** `/socket.io` no path; `connection` → `toSocketIo(connection)`; o servidor lê o token do handshake (validar na Tarefa 9 como o binding expõe `auth`; fallback: cliente envia `io.client.emit('session', token)` logo após conectar), associa `userId`, e expõe `broadcast(event)` e `emitToUser(userId, event)`. Handlers REST chamam o barramento interno `events.ts` (`publishNftUpdated(nft)`, `publishOrderUpdated(order)`), que serializa para os clientes conectados. Isso garante que mudanças de dados reflitam em REST **e** socket.
- `event-gate.ts`: `createEventGate()` com `seenIds` (LRU 500) e `versionByResource: Map<'nft:id'|'order:id', number>`; `shouldApply(event)` retorna false para duplicata ou `version <= conhecida`.
- `apply-event.ts`: `applyRealtimeEvent(queryClient, event, { currentUserId })`: `nft.updated` → `setQueryData(queryKeys.nfts.detail(id))` merge, `setQueriesData({ queryKey: queryKeys.nfts.lists() })` substituindo o item, e `invalidateQueries(cart, quote)` quando o NFT está no carrinho; `order.updated` → `setQueryData(queryKeys.orders.detail(userId,id))` apenas se `order.userId === currentUserId`. Anuncia em `LiveRegion` ("Preço de X atualizado para Y ETH").
- Reconexão (`useRealtimeReconciliation`): em `connect` após `disconnect`, `invalidateQueries` dos recursos ativos (detalhe aberto, carrinho, cotação, pedido pendente) e re-sincroniza `versionByResource` com as respostas REST.
- Limitações a documentar em `docs/MOCKS.md`: somente transporte `websocket`, namespace default, sem acks/binário/rooms; o "servidor" vive na mesma página, portanto não há eventos entre abas.

### 3.6 Política de cache, retries e sincronização (vai para `ARCHITECTURE.md`)

- `staleTime`: catálogo 30 s, detalhe 60 s, favoritos/carrinho/perfil/carteiras 0 (sempre revalidar ao focar), cotação 0 e `gcTime` 5 min, pedido pendente `refetchInterval` 3 s até terminal.
- `retry`: leituras 2× com backoff (não em 4xx); mutations 0× (idempotência cobre pedido; usuário reenvia explicitamente). Cancelamento: toda query usa `signal` do Axios; respostas fora de ordem são descartadas pelo Query (key inclui todos os parâmetros).
- Otimista com rollback: favoritos (toggle) e quantidade no carrinho. Invalidação após mutation: carrinho → `cart` + `quote`; pedido confirmado → `cart`, `nfts.detail` dos itens, `orders`; perfil → `profile` + `session`.
- Isolamento: keys privadas = `[..., userId]`; `cart` key = `['cart', scope.kind, scope.id]`.

## 4. Mocks: store, cenários e fixtures

- Store (`store.ts`): `createMockStore({ seed, persistKey: 'kurio.mockdb.v1' })` → `{ read(), write(mutator), reset(seedName) }`; `write` recebe função pura que devolve novo estado (imutável). Persistência em `localStorage`, debounced; versão no nome da chave (bump invalida).
- Seeds: `default` (48 NFTs, 2 usuários, 3 cupons), `empty` (0 NFTs). Usuários: `ana@kurio.test` (carteira principal e secundária cadastradas, 3 favoritos) e `bruno@kurio.test` (sem carteiras). Senha de ambos: `Kurio!2026` (documentar no README). Cupons: `LANCAMENTO10` (10%), `EXPIRADO10` (expirado), qualquer outro → inválido.
- NFTs: nomes no padrão do Figma (`Emerald Ape #042`, `Sage Nomad #009`, `Neon Vessel #552`, `Cosmic Bloom #118`, `Violet Nomad #314`, `Ivory Baron #088`, `Golden Beat #207`, `Golden Signal #160`, `Golden Frequency #071`…), coleções "Kurio Apes"/"Kurio Editions", 9 categorias com contagens variadas, 3 redes, preços 0,02–12,30 ETH, 3 tipos de edição + "aberta", alguns com `available: 0` (esgotada), alguns `limited`/`featured`/`new`/`trending`, `listedAt` escalonado para ordenação.
- Cenários (`scenarios/registry.ts`, selecionáveis por `?scenario=` na URL, `localStorage['kurio.scenario']` ou `window.__kurio.setScenario`), cada um = `{ network: { latencyMs, jitterMs, failRate, offline }, flags: {...}, seed }`:
  `default`, `empty-catalog`, `slow-network` (2000±500 ms), `out-of-order` (100–1500 ms pseudoaleatório com semente fixa), `offline`, `server-error-reads` (500 em GET), `session-expired` (próxima chamada privada → 401), `register-conflict`, `coupon-expired`, `price-changed-during-checkout` (após `POST /quote`, altera preço do 1º item e publica `nft.updated`), `edition-sold-out-during-checkout`, `order-timeout` (POST /orders responde após 12 s; cliente tem timeout 6 s), `payment-declined`, `favorite-mutation-fails` (503 em PUT/DELETE favorites), `wallet-rejected`, `wallet-disconnected`, `duplicate-events` (cada evento emitido 2×), `stale-events` (emite versão antiga após a nova).
- `control.ts`: `window.__kurio = { reset(seed?), setScenario(name), setNetwork(partial), emit(event), getState(), advanceOrder(orderId, status) }` — usado por Playwright e por um painel dev flutuante (`VITE_ENABLE_MOCKS` + `?devtools=1`).
- Pedido: criado `pending`; `timing.ts` agenda transição para `confirmed` (default, 3 s) ou `declined` (cenário) e publica `order.updated`. Transições são persistidas; se a página recarregar antes, `GET /orders/:id` aplica a transição pendente pelo relógio (determinístico com `page.clock`).
- Simulação de rede: `withNetwork(resolver)` em `network.ts` envolve todos os handlers (delay/jitter/falha/offline) — único ponto de injeção.

## 5. Regras de código e padrões (obrigatórias para front e camada mock)

Instale como `.claude/rules/kurio.md` no repo e cite no `README.md`.

**Legibilidade**
1. Código autoexplicativo: nomes completos e específicos (`pendingOrderId`, não `poId`; `applyRealtimeEvent`, não `handle`). Se precisou de comentário para explicar *o que* faz, renomeie ou extraia função.
2. Comentários só para *por quê* não óbvio (ex.: "MSW exige URL sem /socket.io"). Zero código comentado, zero `TODO` sem link.
3. Funções ≤ 40 linhas, arquivos ≤ 300 linhas, aninhamento ≤ 3 níveis, early return.
4. Um componente exportado por arquivo, nome do arquivo = nome do componente. Hooks em `useX.ts`. Utilitários com verbo (`formatEth`, `createEventGate`).
5. Identificadores em inglês; textos de UI em pt-BR, sem misturar. Strings de UI repetidas 2+ vezes vão para `messages.ts` da feature.

**TypeScript**
6. `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `verbatimModuleSyntax`. Proibidos `any`, `as unknown as`, `!`. Tipos derivados dos schemas zod (`z.infer`) — nunca duplicar tipo e schema.
7. `export default` apenas onde o framework exige (rotas usam `export const Route`). Imports absolutos `@/…`, ordenados (eslint `import/order`).

**React e estado**
8. Componentes de apresentação puros; busca de dados só em hooks de feature; efeitos colaterais só em hooks/mutations. Nenhum `useEffect` para sincronizar estado derivado — derive no render.
9. Estado compartilhável fica na URL (filtros, página, ordenação, tab, `returnTo`). Estado de servidor só no Query. Estado local em `useState`. Sem Redux/Zustand.
10. Formulários: react-hook-form + `zodResolver` com o mesmo schema do contrato; erros associados ao campo via `aria-describedby` (shadcn `Form`).
11. Imutabilidade: nunca mutar props/estado/objetos do store; spread/`structuredClone`/`toSorted`.

**Erros e validação**
12. Toda chamada passa por `api.ts` que faz `schema.parse(response.data)`; erros convertidos para `ApiError { code, message, fields?, status }` em `lib/errors.ts`; a UI mapeia `code → mensagem pt-BR` em um único lugar. Nunca engolir erro; nunca mostrar stack ao usuário.
13. Handlers MSW validam o corpo com o mesmo schema e devolvem `422` com `fields`.

**Estilo e UI**
14. Tailwind com tokens; sem hex, sem `style={{}}` exceto valores dinâmicos (ex.: largura do slider). `cn()` para condicionais. Componentes shadcn ficam em `components/ui` e são adaptados uma vez (variantes `primary/secondary/ghost/danger`), nunca sobrescritos ad hoc.
15. Todo elemento interativo: foco visível (`focus-visible:ring-2 ring-primary`), estado hover/active/disabled definido, `aria-label` quando só ícone, tamanho mínimo de toque 44px no mobile.
16. Skeleton com as mesmas dimensões do conteúdo (`aspect-square`, alturas fixas); shimmer desativado em `prefers-reduced-motion`.
17. Mobile first nas classes (`base → md → xl`); nunca `overflow-x` indevido (verificado em E2E).

**Mocks**
18. Handlers são finos: parse → auth → chamada a função de domínio em `db/` ou `shared/` → resposta. Regras de negócio (preço, disponibilidade, cupom, idempotência) ficam em funções puras testáveis com Vitest.
19. Nenhum dado fictício fora de `src/mocks`. Nenhum `import` de `src/mocks` fora de `src/app/main.tsx` e dos testes.

**Processo**
20. TDD por tarefa: escrever o teste (Vitest para funções puras, Playwright para fluxo), ver falhar, implementar, ver passar, refatorar, commit. Commits convencionais pequenos (`feat:`, `fix:`, `test:`, `chore:`, `docs:`), sem linhas de co-autoria (configuração global do usuário).
21. `pnpm check` (typecheck + lint + format:check + unit) verde antes de cada commit; `pnpm e2e` verde antes de cada fim de fase.
22. Revisão com o agente `code-reviewer` ao fim de cada fase; `security-reviewer` nas Tarefas 5, 12 e 13.

**Ferramentas do executor**
- Figma: abrir o link no Chrome (view-only funciona sem login; a aba `Properties` mostra layout/cores/tipografia do nó selecionado; `cmd+click` seleciona o nó profundo; `shift+2` dá zoom na seleção; com nada selecionado, a aba lista todos os Text/Color styles e o popover "View color style" mostra o hex). Alternativas: `claude mcp add --transport http figma https://mcp.figma.com/mcp` + autenticação; ou token pessoal com `GET https://api.figma.com/v1/files/Ff0SksUi7UFtPWUO8kyNtw` (header `X-Figma-Token`).
- Assets: exportar as imagens dos macacos e do hero do Figma (painel Export, PNG 2x) **com aprovação explícita do usuário para o download**; converter para AVIF/WebP com `sharp` em `scripts/optimize-images.mjs`. Fallback: arte SVG gerada proceduralmente em `fixtures/images.ts`, com a substituição registrada em `ARCHITECTURE.md`.
- Playwright MCP / chrome-devtools MCP para inspeção visual e Lighthouse ad hoc; `@lhci/cli` para a auditoria oficial.

## 6. Cronograma (2 dias) e linha de corte

| Bloco | Tarefas | Entrega verificável |
| --- | --- | --- |
| D1 manhã | 1–4 | app sobe com mocks, tokens aplicados, contratos e store testados |
| D1 tarde | 5–8 | auth + header/footer + catálogo + detalhe navegáveis, Lighthouse preliminar do Início |
| D1 noite | 9–10 | socket funcionando (evento altera preço no detalhe), favoritos otimistas |
| D2 manhã | 11–14 | carrinho, cotação, checkout, pedido com idempotência e tempo real |
| D2 tarde | 15–16 | perfil e carteiras, suíte E2E completa com baselines |
| D2 noite | 17–19 | Lighthouse oficial, deploy Vercel, documentação, revisão final |

Ordem real de execução das dependências cruzadas: 15 (carteiras) pode ser puxada para antes de 12 (checkout) se o executor preferir; `useAddToCart` (Tarefa 11) é necessário para fechar o botão COMPRAR da Tarefa 8 — implementar o hook ao fim da 8 ou deixar o botão navegando para `/cart` sem adicionar até a 11 (nunca simular sucesso).

Linha de corte se atrasar (nesta ordem): blog estático vira 1 card por tipo; carrossel "Mais desta coleção" vira grid simples; painel dev de cenários vira só `window.__kurio`; baselines visuais só desktop. **Nunca cortar:** eliminatórios, fluxo de compra, socket real, E2E executável, deploy.

## Global Constraints

- Stack obrigatória do enunciado em uso efetivo: React, TypeScript, TanStack Router, TanStack Query, Axios, REST, Socket.IO (`socket.io-client`), Tailwind CSS, shadcn/ui, MSW, Playwright, Lighthouse.
- Valores ETH trafegam como **strings decimais**; quantidades inteiras; cotação da API é a referência final.
- Larguras mínimas validadas: **390, 768, 1440**.
- Lighthouse (build otimizado, cenário `default`, Início e Detalhe, mobile e desktop, 3 execuções, mediana): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90; registrar LCP, CLS, TBT.
- Skeletons com shimmer em catálogo, detalhe e resumo do carrinho; respeitar `prefers-reduced-motion`.
- E2E em Chromium, desktop e mobile; regressão visual de Início, Detalhe, Carrinho e Pagamento com baselines versionadas; relatório HTML e traces em falha.
- Deploy público obrigatório (Vercel) com mocks ativos e refresh de rotas funcionando.
- `README.md` da solução com setup, env, credenciais fictícias, cenários/reset, comandos, reprodução de falhas; `ARCHITECTURE.md` com contratos, sessão, carrinho, cache, reconciliação, limitações e desvios do Figma.

## Review Focus

1. **Reload com pedido pendente criado antes do timeout:** ao recarregar `/checkout` com `kurio.pendingOrder`, a UI vai para `/orders/:id` e nunca cria outro pedido — teste na Tarefa 13 (`e2e/07-payment-failures.spec.ts › "timeout recupera o mesmo pedido pela chave"`).
2. **Evento `order.updated` de outro usuário:** após logout e login como Bruno, eventos do pedido de Ana não podem tocar o cache — teste na Tarefa 13 (`e2e/10-realtime-resilience.spec.ts › "evento de sessão anterior não atualiza outro usuário"`).
3. **Quantidade acima do disponível vinda de refresh/concorrência:** `PATCH /cart/items` com `quantity > available` devolve 409 e a UI mostra a disponibilidade atual sem perder o item — teste na Tarefa 11 (`e2e/05-cart.spec.ts › "quantidade acima do disponível é bloqueada"`).
4. **Search params inválidos na URL (`?page=abc&minPrice=-1`):** `validateSearch` aplica `catch` e a página renderiza com defaults, sem tela branca — teste na Tarefa 7 (`src/features/catalog/search-params.test.ts`).
5. **Zoom 200% e largura 390 sem overflow horizontal:** nenhuma rota pode gerar `scrollWidth > clientWidth` — teste na Tarefa 16 (`e2e/11-a11y-keyboard.spec.ts › "sem overflow horizontal em 390px"`).

---

## Tarefas

### Task 1: Scaffold, qualidade e tokens

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `eslint.config.js`, `.prettierrc`, `.nvmrc`, `.gitignore`, `.env.example`, `index.html`, `src/app/main.tsx`, `src/styles/tokens.css`, `src/styles/globals.css`, `src/lib/cn.ts`, `src/lib/env.ts`, `src/lib/env.test.ts`, `components.json`, `.claude/rules/kurio.md`, `docs/CHALLENGE.md` (mover README), `docs/superpowers/plans/2026-10-22-kurio-nft-marketplace.md` (cópia deste plano)

**Interfaces:**
- Produces: `env` (`lib/env.ts`): `{ apiBaseUrl: string, socketUrl: string, enableMocks: boolean, mockScenario: string }` validado por zod em import-time; `cn(...inputs)`; tokens CSS da seção 2.2 expostos via `@theme` do Tailwind; scripts `dev`, `build`, `preview`, `typecheck`, `lint`, `format`, `format:check`, `test` (vitest), `e2e`, `e2e:ui`, `lighthouse`, `check`.

- [ ] **Passo 1:** `git init` na pasta; `git mv README.md docs/CHALLENGE.md`; copiar este plano para `docs/superpowers/plans/`.
- [ ] **Passo 2:** `pnpm create vite@latest . --template react-ts` (Vite 7) e ajustar versões da seção 1; `pnpm add` deps de runtime e `pnpm add -D` deps de dev; `.nvmrc` = `24`.
- [ ] **Passo 3:** Tailwind v4 via `@tailwindcss/vite`; `globals.css` com `@import "tailwindcss"; @import "./tokens.css";`; `tokens.css` define as variáveis da seção 2.2 dentro de `@theme` (`--color-ink: #140D0A;` …) e `--font-mono: 'Roboto Mono', ui-monospace`; `@fontsource/roboto-mono` importado em `main.tsx`.
- [ ] **Passo 4:** `pnpm dlx shadcn@latest init` (new-york, base color neutral, CSS variables) e adicionar: button, input, label, select, dialog, drawer, sheet, tabs, checkbox, radio-group, slider, badge, skeleton, sonner, form, dropdown-menu, tooltip, separator. Ajustar `components/ui/button.tsx` para variantes `primary` (Primary/Ink, hover Primary Light, active Primary Dark), `secondary` (borda Border Soft), `ghost`, `danger`; altura 40, radius 6, fonte 16 Bold.
- [ ] **Passo 5:** tsconfig estrito (regra 6), paths `@/*`; ESLint flat config com `typescript-eslint` strict-type-checked + `react-hooks` + `jsx-a11y` + `import/order`; Prettier: `semi: true`, `singleQuote: true`, `printWidth: 100`, `trailingComma: 'all'`, plugin tailwind.
- [ ] **Passo 6:** escrever `src/lib/env.test.ts` (Vitest): `lança erro legível quando VITE_API_BASE_URL está vazio` e `parseia enableMocks "true"/"false"`; rodar `pnpm test` → FAIL.
- [ ] **Passo 7:** implementar `lib/env.ts` com `envSchema = z.object({...})` e `export const env = envSchema.parse(import.meta.env)`; `pnpm test` → PASS.
- [ ] **Passo 8:** `.claude/rules/kurio.md` com a seção 5 deste plano; `README.md` provisório com comandos.
- [ ] **Passo 9:** `pnpm check` verde; `pnpm build` gera `dist/`.
- [ ] **Passo 10:** Commit `chore: scaffold vite react ts, tailwind tokens, shadcn, lint`.

### Task 2: Contratos e utilitários de dinheiro

**Files:**
- Create: `src/contracts/{common,money,nft,auth,cart,quote,order,profile,wallet,realtime,index}.ts`, `src/lib/money.ts`, `src/lib/money.test.ts`, `src/contracts/contracts.test.ts`, `src/lib/idempotency.ts`, `src/lib/idempotency.test.ts`, `src/lib/storage.ts`, `src/lib/storage.test.ts`

**Interfaces:**
- Produces: schemas e tipos da seção 3.4; `addEth(a: EthAmount, b: EthAmount): EthAmount`, `mulEth(a: EthAmount, quantity: number): EthAmount`, `subEth`, `percentOf(a, percent: number): EthAmount`, `compareEth(a, b): -1|0|1`, `formatEth(a): string` (regra: até 3 casas, remove zeros à direita mas mantém ao menos 2: "1.19 ETH", "26.846 ETH", "0.016 ETH"); `createIdempotencyKey(): string`; `hashPayload(value: unknown): Promise<string>` (SHA-256 hex de JSON canônico com chaves ordenadas); `createStorage<T>(key, schema): { read(): T | null, write(value: T), clear() }` com try/catch e parse zod.

- [ ] **Passo 1:** testes Vitest: `money.test.ts` (`soma 26.83 + 0.016 = 26.846`, `multiplica 1.19 × 2 = 2.38 sem erro binário`, `percentOf 10% de 26.83 = 2.683`, `formatEth mantém precisão`, `rejeita número com mais de 6 casas`), `idempotency.test.ts` (`mesmo objeto com chaves em ordens diferentes gera o mesmo hash`), `storage.test.ts` (`retorna null para JSON corrompido`), `contracts.test.ts` (`nftSchema aceita fixture válida`, `orderSchema rejeita status desconhecido`, `realtimeEventSchema discrimina por type`). Rodar → FAIL.
- [ ] **Passo 2:** implementar contratos (zod 4) e utilitários com `big.js` (`Big.DP = 6`, `RM = Big.roundDown`).
- [ ] **Passo 3:** `pnpm test` → PASS; `pnpm check` verde.
- [ ] **Passo 4:** Commit `feat: contratos zod e utilitários de dinheiro decimal`.

### Task 3: Mock store, fixtures e cenários

**Files:**
- Create: `src/mocks/db/{schema,seed,store}.ts`, `src/mocks/db/fixtures/{nfts,users,coupons,images}.ts`, `src/mocks/scenarios/{registry,network,current}.ts`, `src/mocks/shared/{respond,session,pricing,hash,timing,password}.ts`, `src/mocks/db/store.test.ts`, `src/mocks/shared/pricing.test.ts`, `src/mocks/shared/password.test.ts`, `src/mocks/db/fixtures/nfts.test.ts`

**Interfaces:**
- Produces: `MockDb = { users, sessions, nfts, favorites, carts, quotes, orders, idempotency, wallets, loginAttempts, scheduledTransitions }`; `createMockStore(options)` (seção 4); `getScenario(): Scenario`, `setScenario(name)`; `withNetwork(resolver)`; `respondError(status, code, message, fields?)`; `requireSession(request): { user, session } | ErrorResponse`; `computeQuote(db, input): Quote` (regras: subtotal = Σ unitPrice×qty; cupom `LANCAMENTO10` = 10% do subtotal; `networkFee` por rede: ethereum `0.016`, polygon `0.002`, solana `0.0005`; `total = subtotal − discount + fee`); `hashPassword(password): Promise<{salt,hash}>`, `verifyPassword`; `scheduleOrderTransition(orderId, status, delayMs)` + `applyDueTransitions(db, now)`.

- [ ] **Passo 1:** testes: `store.test.ts` (`write aplica mutator imutável e persiste`, `reset('empty') zera nfts`, `ignora localStorage corrompido`), `pricing.test.ts` (`cotação do Figma: 3 itens 2.38+8.34+16.11 = 26.83, fee 0.016, total 26.846`, `cupom LANCAMENTO10 desconta 10%`, `cupom EXPIRADO10 → status expired`, `quantidade > available → erro UNAVAILABLE`), `password.test.ts` (`hash nunca contém a senha`, `verify falha com senha errada`), `nfts.test.ts` (`48 NFTs, todas as 9 categorias e 3 redes presentes`, `pelo menos 3 edições esgotadas`, `ids únicos`). Rodar → FAIL.
- [ ] **Passo 2:** implementar fixtures (determinísticas, sem `Math.random` — usar índice), store, cenários (registry completo da seção 4), network wrapper com delay/jitter/falha/offline usando `delay()` do MSW e `HttpResponse.error()`.
- [ ] **Passo 3:** `pnpm test` → PASS. Commit `feat: mock store persistido, fixtures e registro de cenários`.

### Task 4: Handlers REST, worker e app shell

**Files:**
- Create: `src/mocks/handlers/{index,auth,nfts,favorites,cart,quote,orders,profile,wallets,wallet-session}.ts`, `src/mocks/browser.ts`, `src/mocks/control.ts`, `public/mockServiceWorker.js` (via `pnpm msw init public --save`), `src/lib/http.ts`, `src/lib/errors.ts`, `src/lib/query-keys.ts`, `src/app/{providers,query-client,router}.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx` (placeholder), `src/routes/$.tsx`, `src/mocks/handlers/handlers.test.ts` (Vitest + `msw/node`)

**Interfaces:**
- Produces: `startMocks(): Promise<void>` (só quando `env.enableMocks`; `onUnhandledRequest: 'bypass'` para assets); `http: AxiosInstance` (baseURL `env.apiBaseUrl`, timeout 6000 ms, interceptor que injeta `Authorization`, interceptor de resposta que converte para `ApiError` e dispara `onUnauthorized` em 401 `SESSION_EXPIRED`); `parseWith(schema)(response)`; `queryKeys = { nfts: { all: ['nfts'], lists: () => ['nfts','list'], list: (search) => ['nfts','list', search], detail: (id) => ['nfts','detail', id] }, favorites: (userId) => ['favorites', userId], cart: (scope) => ['cart', scope.kind, scope.id], quote: (hash) => ['quote', hash], orders: { detail: (userId, id) => ['orders', userId, id] }, profile: (userId) => ['profile', userId], wallets: (userId) => ['wallets', userId] }`; `window.__kurio` (seção 4).

- [ ] **Passo 1:** `handlers.test.ts` com `setupServer`: `GET /api/nfts?page=2 devolve 9 itens e total 48`, `GET /api/nfts?category=musica&network=polygon combina filtros`, `GET /api/nfts/inexistente → 404 NOT_FOUND`, `POST /api/auth/register duplicado → 409 EMAIL_TAKEN`, `POST /api/auth/login 6ª tentativa → 429`, `GET /api/favorites sem token → 401`, `GET /api/orders/:id de outro usuário → 403`, `POST /api/orders mesma chave mesmo corpo → mesmo id`, `mesma chave corpo diferente → 409 IDEMPOTENCY_CONFLICT`, `POST /api/quote com cupom expirado → 422 COUPON_EXPIRED`. Rodar → FAIL.
- [ ] **Passo 2:** implementar handlers finos (regra 18), todos envolvidos por `withNetwork`; erros via `respondError`; `cart` resolve escopo por sessão ou `X-Guest-Id`.
- [ ] **Passo 3:** `pnpm test` → PASS.
- [ ] **Passo 4:** `main.tsx`: `await startMocks()` antes de `createRoot`; `providers.tsx` com `QueryClientProvider` + `RouterProvider` + `Toaster`; `__root.tsx` com `PageShell` (header/footer placeholders) e `Outlet`; rota `$` 404.
- [ ] **Passo 5:** `pnpm dev` → abrir `/` e confirmar no DevTools que `GET /api/nfts` responde via MSW (`[MSW] Mocking enabled`). `pnpm build && pnpm preview` idem.
- [ ] **Passo 6:** Commit `feat: handlers REST MSW, cliente http e shell da aplicação`.

### Task 5: Sessão, login, cadastro e guarda de rotas

**Files:**
- Create: `src/features/auth/{session-store,api,mutations,route-guard,messages}.ts`, `src/features/auth/components/{AuthDialog,LoginForm,RegisterForm,SocialButtons}.tsx`, `src/routes/login.tsx`, `src/routes/register.tsx`, `e2e/03-auth.spec.ts`, `e2e/fixtures/kurio.ts`, `playwright.config.ts`

**Interfaces:**
- Consumes: `http`, `queryKeys`, contratos `auth`.
- Produces: `useSession(): { user: User | null, status: 'anonymous'|'authenticated'|'expired', token }`, `sessionStore` (`useSyncExternalStore`, persistido em `kurio.session`), `useLogin()`, `useRegister()`, `useLogout()` (limpa cache/socket/storages conforme 3.3), `requireAuth({ location })` para `beforeLoad` (redirect `/login?returnTo=`), `returnToSchema` (aceita apenas caminhos internos começando com `/`); `AuthDialog` (desktop: `Dialog` sobre a Home com backdrop 60%, tabs "Entrar | Criar conta"; mobile: página cheia conforme Figma).
- Playwright: projetos `desktop-chromium` (1440×900) e `mobile-chromium` (390×844, `isMobile`), `webServer: pnpm preview --port 4173` (build prévio), `trace: 'retain-on-failure'`, `reporter: [['html', { outputFolder: 'reports/playwright-report' }]]`, `expect.toHaveScreenshot` com `maxDiffPixelRatio: 0.01`. Fixture `kurio` faz `page.addInitScript` para `localStorage.clear()` + `kurio.scenario` e expõe `mocks.setScenario/reset/emit/getState` via `page.evaluate(window.__kurio…)` e `login(user)`.

- [ ] **Passo 1:** `e2e/03-auth.spec.ts`: `cadastro com e-mail existente mostra conflito no campo`, `login inválido mostra erro acessível (role=alert)`, `login válido volta para returnTo`, `sessão expirada durante navegação redireciona e preserva returnTo` (cenário `session-expired`), `logout limpa dados privados (favoritos somem do header)`, `troca de usuário não mostra carrinho do anterior`. Rodar `pnpm e2e --grep auth` → FAIL.
- [ ] **Passo 2:** implementar store, hooks, formulários (RHF + zod; mensagens pt-BR), rotas e guarda; botões sociais mostram toast "Login social indisponível nesta demonstração" (sem simular sucesso).
- [ ] **Passo 3:** rodar E2E → PASS. `security-reviewer` nesta tarefa.
- [ ] **Passo 4:** Commit `feat: sessão, login, cadastro e proteção de rotas`.

### Task 6: Layout (header, footer, tab bar mobile, página 404)

**Files:**
- Create: `src/features/layout/{Header,MobileTabBar,Footer,PageShell,AccountSidebar}.tsx`, `src/components/feedback/{EmptyState,ErrorState,LiveRegion}.tsx`, `src/components/feedback/skeletons.tsx`, `e2e/00-layout.spec.ts`
- Modify: `src/routes/__root.tsx`, `src/routes/$.tsx`

**Interfaces:**
- Consumes: `useSession`, `useCartQuery` (Tarefa 11 — até lá, badge lê `0`).
- Produces: `PageShell({ children, variant: 'default'|'account'|'auth' })`; `LiveRegion` (`aria-live="polite"`) + `announce(message)`; skeletons `NftCardSkeleton`, `DetailSkeleton`, `SummarySkeleton`, `FormSkeleton` com shimmer (`motion-safe:animate-shimmer`).

- [ ] **Passo 1:** `e2e/00-layout.spec.ts`: `header tem landmarks (banner, navigation, main, contentinfo)`, `links fora do escopo (Criadores, Aprenda, colunas do footer) não navegam e informam indisponibilidade`, `newsletter não simula sucesso`, `rota inexistente mostra 404 com link para Início`, `mobile mostra tab bar e não mostra nav desktop`. → FAIL.
- [ ] **Passo 2:** implementar conforme 2.3 (medidas exatas), ícones `lucide-react`; nav ativa por `useMatchRoute`; "Entrar" vira menu de avatar quando autenticado (Meu perfil, Carteiras, Sair).
- [ ] **Passo 3:** E2E → PASS. Verificar visualmente em 390/768/1440 (Playwright MCP) contra o Figma. Commit `feat: header, footer, tab bar mobile e 404`.

### Task 7: Catálogo (busca, filtros, ordenação, paginação na URL)

**Files:**
- Create: `src/features/catalog/{search-params,api,queries,messages}.ts`, `src/features/catalog/search-params.test.ts`, `src/features/catalog/components/{FilterSidebar,FilterDrawer,PriceRangeFilter,NftGrid,NftCard,Pagination,SortSelect,CatalogTabs,FeaturedCard,HeroSection,PromoBanners,BlogSection}.tsx`, `e2e/01-catalog.spec.ts`
- Modify: `src/routes/index.tsx`

**Interfaces:**
- Produces: `catalogSearchSchema` (zod): `{ q: string = '', category: string[] = [], network: ('ethereum'|'polygon'|'solana')[] = [], minPrice?: EthAmount, maxPrice?: EthAmount, sort: 'recent'|'price_asc'|'price_desc'|'rating' = 'recent', tab: 'all'|'new'|'trending' = 'all', page: number ≥ 1 = 1, favorites: boolean = false }` com `.catch` em cada campo; `nftListQueryOptions(search)` (`queryKeys.nfts.list(search)`, `placeholderData: keepPreviousData`, `staleTime 30s`); `useCatalogNavigation()` → `setFilter(partial)` sempre com `page: 1`, `setPage(n)`; `NftCard({ nft })` com dimensões fixas e `loading="lazy"` exceto na primeira linha.

- [ ] **Passo 1:** `search-params.test.ts`: `?page=abc → page 1`, `?minPrice=-1 → undefined`, `?category=a&category=b → array`, `sort desconhecido → recent`. `e2e/01-catalog.spec.ts`: `busca + 2 filtros combinados refletem na query da API e na URL`, `mudar filtro reinicia página para 1`, `refresh preserva filtros e página`, `voltar no histórico restaura estado anterior`, `resultado vazio mostra estado vazio com limpar filtros`, `erro 500 mostra erro e botão tentar novamente recupera` (cenário `server-error-reads` → `default`), `respostas fora de ordem não sobrescrevem resultado mais recente` (cenário `out-of-order`: digitar "ape" depois "apex" e asserir que o resultado final corresponde a "apex"), `skeleton aparece em rede lenta com dimensões estáveis`. → FAIL.
- [ ] **Passo 2:** implementar rota `index.tsx` (`validateSearch: catalogSearchSchema`, `loaderDeps`, `loader` com `ensureQueryData`), componentes conforme 2.3; slider de preço (shadcn `Slider` duplo) aplica só no botão "Aplicar"; mobile usa `FilterDrawer` (Sheet lateral) com foco preso; facets vindas da API; indicador discreto "Atualizando…" (`aria-live`) quando `isFetching && !isPending` para o estado de atualização em segundo plano.
- [ ] **Passo 3:** testes → PASS. Comparar com Figma em 1440 e 390 (screenshots) e ajustar até bater tipografia/espaçamento. Commit `feat: catálogo com estado na URL, filtros, ordenação e paginação`.

### Task 8: Detalhe do NFT

**Files:**
- Create: `src/features/nft-detail/{api,queries,messages}.ts`, `src/features/nft-detail/components/{Gallery,EditionPicker,QuantityStepper,PurchasePanel,DetailTabs,RelatedCarousel,ShareLinks}.tsx`, `src/routes/nfts.$nftId.tsx`, `e2e/02-nft-detail.spec.ts`

**Interfaces:**
- Consumes: `nftDetailQueryOptions(id)` (`queryKeys.nfts.detail(id)`, `staleTime 60s`), `useAddToCart` (Tarefa 11).
- Produces: `EditionPicker({ editions, value, onChange })` (chip desabilitado + `aria-disabled` + texto "Esgotada" quando `available === 0`), `QuantityStepper({ value, min 1, max: available, onChange })` (botões desabilitados nos limites, input numérico com `inputMode="numeric"`), `PurchasePanel` (preço, edição, qtd, "COMPRAR" → adiciona ao carrinho e navega para `/cart`; "Favoritar").

- [ ] **Passo 1:** `e2e/02-nft-detail.spec.ts`: `acesso direto por URL renderiza detalhe com skeleton antes`, `NFT inexistente mostra 404 do detalhe`, `edição esgotada não é selecionável`, `stepper não passa do disponível`, `mobile mostra barra inferior fixa com Comprar NFT`. → FAIL.
- [ ] **Passo 2:** implementar rota com `loader` (`ensureQueryData`) + `errorComponent`/`notFoundComponent`; galeria com miniaturas (desktop) e imagem única (mobile); abas "Detalhes do NFT | Avaliações (n)"; carrossel "Mais desta coleção" (5 cards, dots, scroll-snap, teclado).
- [ ] **Passo 3:** → PASS. Commit `feat: detalhe do NFT com galeria, edições e quantidade`.

### Task 9: Infra de tempo real (socket mock + cliente + gate)

**Files:**
- Create: `src/mocks/socket/{server,events}.ts`, `src/features/realtime/{socket,event-gate,apply-event,RealtimeProvider,useRealtimeReconciliation}.ts(x)`, `src/features/realtime/event-gate.test.ts`, `src/features/realtime/apply-event.test.ts`, `e2e/09-realtime-checkout.spec.ts` (parcial), `docs/MOCKS.md` (seção transporte)
- Modify: `src/mocks/handlers/index.ts` (adicionar `realtimeHandlers`), `src/mocks/handlers/{nfts,orders}.ts` (publicar eventos), `src/app/providers.tsx`

**Interfaces:**
- Produces: `createRealtimeServer(link: WebSocketLink)` → `{ broadcast(event), emitToUser(userId, event), connectedUsers() }`; `publishNftUpdated(nft)`, `publishOrderUpdated(order)` (aplicam cenários `duplicate-events`/`stale-events`); `createEventGate()` → `shouldApply(event): boolean`, `syncVersion(resource, version)`; `applyRealtimeEvent(queryClient, event, { currentUserId })`; `RealtimeProvider` (contexto `{ status: 'connected'|'disconnected'|'reconnecting' }`; registra `socket.on('nft.updated'|'order.updated'|'connect'|'disconnect')` em `useEffect` e **sempre** faz `socket.off(...)` + `socket.disconnect()` no cleanup e ao trocar de usuário — nenhum listener sobrevive ao ciclo de vida); `useRealtimeStatus()`.

- [ ] **Passo 1:** `event-gate.test.ts`: `ignora id duplicado`, `ignora versão menor ou igual`, `aceita versão maior e atualiza`. `apply-event.test.ts` (QueryClient em memória): `nft.updated atualiza detalhe e item da lista`, `order.updated de outro userId é ignorado`. → FAIL.
- [ ] **Passo 2:** implementar gate e apply. → PASS.
- [ ] **Passo 3:** servidor mock com `ws.link(env.socketUrl)` + `toSocketIo`; cliente `socket.io-client` com `transports: ['websocket']`; validar manualmente no browser (`pnpm dev`): `window.__kurio.emit({ type: 'nft.updated', … })` altera o preço no detalhe aberto **sem** refetch. Se o handshake falhar: URL do link sem `/socket.io`; versão `msw ^2.15`; o `ws` handler registrado no mesmo `setupWorker`.
- [ ] **Passo 4:** E2E `09 › "preço muda via socket no detalhe e atualiza sem recarregar"` (usa `mocks.emit`, assert no DOM e ausência de nova chamada REST). → PASS.
- [ ] **Passo 5:** Documentar transporte e limitações em `docs/MOCKS.md`. Commit `feat: socket.io simulado com MSW, gate de eventos e aplicação no cache`.

### Task 10: Favoritos (otimista com rollback)

**Files:**
- Create: `src/features/favorites/{api,queries,useToggleFavorite}.ts`, `src/features/favorites/components/FavoriteButton.tsx`, `e2e/04-favorites.spec.ts`
- Modify: `NftCard.tsx`, `PurchasePanel.tsx`, `MobileTabBar.tsx` (aba Favoritos → `/?favorites=true`)

**Interfaces:**
- Produces: `favoritesQueryOptions(userId)`; `useToggleFavorite()` → `mutate(nftId)` com `onMutate` (cancel + snapshot + set), `onError` (rollback + toast "Não foi possível atualizar favoritos"), `onSettled` (invalidate); `FavoriteButton({ nftId })` (`aria-pressed`; anônimo → redireciona para login com `returnTo`).

- [ ] **Passo 1:** `e2e/04-favorites.spec.ts`: `favoritar persiste após refresh`, `falha de mutation reverte visual e avisa` (cenário `favorite-mutation-fails`), `favorito de Ana não aparece para Bruno`, `aba Favoritos lista apenas favoritos`. → FAIL.
- [ ] **Passo 2:** implementar. → PASS. Commit `feat: favoritos com atualização otimista e rollback`.

### Task 11: Carrinho (guest + usuário, merge, cupom, resumo)

**Files:**
- Create: `src/features/cart/{api,queries,cart-scope,useAddToCart,useUpdateCartItem,useRemoveCartItem,messages}.ts`, `src/features/cart/components/{CartTable,CartItemRow,CartSummary,CouponField,PriceChangedNotice}.tsx`, `src/features/checkout/quote.ts`, `src/routes/cart.tsx`, `e2e/05-cart.spec.ts`
- Modify: `src/features/auth/mutations.ts` (login → `POST /cart/merge`), `Header.tsx`/`MobileTabBar.tsx` (badge)

**Interfaces:**
- Produces: `getCartScope(session): { kind, id, headers }` (guest id em `kurio.guestId`); `cartQueryOptions(scope)`; `useCartQuery()` (resolve o escopo pela sessão atual e devolve `useQuery(cartQueryOptions(scope))` — usado pelo badge do header/tab bar); `useAddToCart()` (409 UNAVAILABLE → mensagem com disponível atual); `useUpdateCartItem()` otimista com rollback; `quoteQueryOptions({ items, couponCode, network })` (`queryKeys.quote(hash)`; `staleTime 0`); `CartSummary` renderiza **somente** valores vindos da cotação (subtotal, desconto, taxa de rede com "Taxa estimada", total) e `SummarySkeleton` enquanto carrega; cupom aplicado/removido altera a chave da cotação; `PriceChangedNotice` aparece quando `item.unitPrice !== nft.price` atual ou `available < quantity` (dados do evento ou refetch) com botão "Atualizar carrinho".

- [ ] **Passo 1:** `e2e/05-cart.spec.ts`: `adicionar, alterar quantidade e remover refletem no resumo da API`, `quantidade acima do disponível é bloqueada`, `carrinho persiste após refresh`, `itens de visitante são preservados ao autenticar`, `cupom LANCAMENTO10 aplica e remover volta ao valor`, `cupom inválido e expirado mostram erro no campo`, `alteração de preço via socket com carrinho aberto destaca o item e atualiza o resumo`, `resumo mostra skeleton com shimmer em rede lenta`. → FAIL.
- [ ] **Passo 2:** implementar. → PASS. Commit `feat: carrinho com cotação da API, cupom e merge de visitante`.

### Task 12: Checkout (dados, carteira/rede, revisão, cotação fresca)

**Files:**
- Create: `src/features/checkout/{api,queries,checkout-draft,wallet-connection,useCreateOrder,messages}.ts`, `src/features/checkout/components/{CollectorForm,OrderReview,WalletNetworkPicker,StaleQuoteBanner,SubmitOrderButton}.tsx`, `src/routes/checkout.tsx`, `e2e/06-purchase-happy-path.spec.ts`

**Interfaces:**
- Consumes: `walletsQueryOptions(userId)` (Tarefa 15), `quoteQueryOptions`, `cartQueryOptions`.
- Produces: `collectorFormSchema` (campos do Figma: displayName, username, network, profileName, walletAddress, secondaryWallet?, walletType, referralCode?, email, ensName, useOtherWallet, note?); `checkoutDraft` (`sessionStorage['kurio.checkoutDraft.<userId>']`, restaurado após expiração/refresh); `useWalletConnection()` → `connect(walletId, provider)` (`POST /wallet-session/connect`), estados `idle|connecting|connected|rejected|disconnected`; `useCreateOrder()` (Tarefa 13 detalha); `StaleQuoteBanner` bloqueia envio quando `quote.version` ≠ versão exibida ou evento `nft.updated` tocou item do carrinho → "Revisar nova cotação" refaz `POST /quote` e exige novo clique em "Confirmar compra".
- Rota `/checkout`: `beforeLoad: requireAuth`; sem carteira cadastrada → `EmptyState` com link "Cadastrar carteira" (`/account/wallets?returnTo=/checkout`).

- [ ] **Passo 1:** `e2e/06-purchase-happy-path.spec.ts`: `do catálogo ao recibo confirmado` (adiciona 2 itens, cupom, checkout, preenche, conecta MetaMask, revisa, confirma, aguarda `order.updated` → `/orders/:id` confirmado com transactionRef e itens; carrinho remove apenas o comprado), `validação de campos obrigatórios com mensagens associadas`, `carteira recusada mostra erro e permite tentar de novo` (`wallet-rejected`), `carteira desconectada antes de confirmar exige reconectar e não envia pedido` (`wallet-disconnected`), `cotação desatualizada bloqueia confirmação até revisar` (`price-changed-during-checkout`), `edição esgotada durante a compra impede envio` (`edition-sold-out-during-checkout`), `sessão expira no checkout e o formulário é restaurado após login`. → FAIL.
- [ ] **Passo 2:** implementar. → PASS. `security-reviewer`. Commit `feat: checkout com revisão, carteira/rede e revalidação de cotação`.

### Task 13: Pedido idempotente, estados e recuperação

**Files:**
- Create: `src/features/orders/{api,queries,pending-order,messages}.ts`, `src/features/orders/components/{OrderStatusCard,OrderReceiptModal,OrderItemsTable}.tsx`, `src/routes/orders.$orderId.tsx`, `e2e/07-payment-failures.spec.ts`, `e2e/10-realtime-resilience.spec.ts`
- Modify: `src/features/checkout/useCreateOrder.ts`, `src/mocks/handlers/orders.ts`, `src/mocks/shared/timing.ts`

**Interfaces:**
- Produces: `useCreateOrder()` → `mutate(input)`: gera `Idempotency-Key` **uma vez por tentativa de compra** (guardada em `kurio.pendingOrder = { key, payloadHash, orderId? }` antes do request), desabilita botão durante `isPending`, em timeout/erro de rede reenvia com a **mesma** chave; sucesso → grava `orderId`, `navigate('/orders/$orderId')`, invalida `cart`; `pending-order.ts` → `readPendingOrder()`, `clearPendingOrder()`; rota `/checkout` ao montar com `pendingOrder.orderId` redireciona para o pedido; `orderQueryOptions(userId, id)` com `refetchInterval: status === 'pending' ? 3000 : false`; `OrderReceiptModal` (Figma: "Seus NFTs agora estão na sua carteira", ID da transação, data, total, carteira, tabela, "Ver no Etherscan" — link simulado `https://etherscan.io/tx/<ref>` com `rel="noopener noreferrer"` e aviso "simulado"); estado `declined` (vermelho, motivo, "Tentar novamente" → `/checkout` mantendo o carrinho); estado `pending` (spinner, "Aguardando confirmação da rede", status do socket).

- [ ] **Passo 1:** `e2e/07-payment-failures.spec.ts`: `pagamento recusado mostra recusa e mantém itens no carrinho` (`payment-declined`), `clique repetido não cria pedido duplicado` (clicar 3× rápido; `getState` mostra 1 pedido), `timeout recupera o mesmo pedido pela chave` (`order-timeout` + `page.clock`), `confirmação só aparece após order.updated confirmado` (sem evento, continua pendente), `recibo mantém o snapshot após alteração de preço no catálogo` (emitir `nft.updated` com preço novo e asserir que `/orders/:id` não muda). `e2e/10-realtime-resilience.spec.ts`: `eventos duplicados e antigos não regridem o estado` (`duplicate-events`, `stale-events`), `desconexão com pedido pendente e reload recupera sem novo pedido`, `reconexão reconcilia com REST` (desconectar socket via `mocks`, mudar preço só no store, reconectar → UI atualiza), `evento de sessão anterior não atualiza outro usuário`. → FAIL.
- [ ] **Passo 2:** implementar. → PASS. `security-reviewer` (idempotência, isolamento). Commit `feat: pedido idempotente com estados pendente/confirmado/recusado e recuperação`.

### Task 14: Recibo em mobile + skeleton/feedback transversal

**Files:**
- Modify: `OrderReceiptModal.tsx` (mobile: página cheia), `src/components/feedback/*`, todas as rotas (garantir `pendingComponent` com skeleton e `errorComponent` com `ErrorState`)
- Create: `e2e/12-loading-and-recovery.spec.ts`

- [ ] **Passo 1:** `e2e/12`: `catálogo, detalhe e resumo mostram skeleton em rede lenta e o layout não desloca (bounding box antes/depois)`, `falha transitória mostra erro e nova tentativa recupera`, `reduced-motion desativa shimmer`. → FAIL.
- [ ] **Passo 2:** implementar/ajustar. → PASS. Commit `feat: estados de carregamento, erro e recuperação consistentes`.

### Task 15: Perfil e carteiras

**Files:**
- Create: `src/features/profile/{api,queries,mutations,messages}.ts`, `src/features/profile/components/{ProfileForm,AvatarField,PasswordForm}.tsx`, `src/features/wallets/{api,queries,mutations,messages}.ts`, `src/features/wallets/components/{WalletForm,WalletCard,SecondaryWalletSection}.tsx`, `src/routes/_account.tsx`, `src/routes/_account.account.profile.tsx`, `src/routes/_account.account.wallets.tsx`, `e2e/08-account.spec.ts`

**Interfaces:**
- Produces: `profileQueryOptions(userId)`, `useUpdateProfile()`, `useUpdateAvatar()` (valida tipo/tamanho/magic bytes no cliente, envia data URL), `useChangePassword()`; `walletsQueryOptions(userId)`, `useSaveWallet(role)`; `walletInputSchema` (campos do Figma: displayName, walletNickname, network, profileName, address, secondaryAddress?, walletType, referralCode?, email, ensName); `_account.tsx` layout com `AccountSidebar` (Dados do perfil, Carteiras ativos; demais itens informam indisponibilidade) e versão mobile (lista no topo / Sheet).

- [ ] **Passo 1:** `e2e/08-account.spec.ts`: `editar nome e e-mail persiste após refresh`, `username em conflito mostra erro da API no campo`, `avatar inválido (pdf, >2MB) é rejeitado; válido aparece no header`, `senha atual errada mostra erro; troca válida permite novo login`, `carteira principal com endereço inválido mostra erro; válida persiste`, `secundária "igual à principal" espelha dados`, `perfil e carteiras funcionam em 390px`. → FAIL.
- [ ] **Passo 2:** implementar. → PASS. Commit `feat: perfil do colecionador, avatar, senha e carteiras`.

### Task 16: Acessibilidade, teclado e regressão visual

**Files:**
- Create: `e2e/11-a11y-keyboard.spec.ts`, `e2e/13-visual.spec.ts`, `e2e/__screenshots__/**` (baselines), `docs/TESTING.md`

- [ ] **Passo 1:** `e2e/11`: `navegação por teclado completa no catálogo (Tab até paginação, Enter abre detalhe)`, `diálogo de login prende foco e devolve ao fechar (Esc)`, `drawer de filtros mobile idem`, `erros de formulário são anunciados e focam o primeiro campo inválido`, `axe sem violações críticas/sérias em /, /nfts/:id, /cart, /checkout, /login, /account/profile`, `sem overflow horizontal em 390px` (todas as rotas), `zoom 200% (viewport 720 de largura) mantém conteúdo`. `e2e/13`: `toHaveScreenshot` de Início, Detalhe, Carrinho, Pagamento em desktop e mobile com `mocks.reset('default')`, `page.clock.setFixedTime('2026-07-29T12:00:00Z')`, animações desativadas, fontes carregadas (`document.fonts.ready`). → FAIL/gerar baselines.
- [ ] **Passo 2:** corrigir violações; gerar baselines (`pnpm e2e --update-snapshots`) só após conferência visual contra o Figma; versionar.
- [ ] **Passo 3:** suíte completa `pnpm e2e` verde em ambos os projetos; relatório HTML em `reports/playwright-report`. Commit `test: suíte E2E completa, a11y e baselines visuais`.

### Task 17: Performance e Lighthouse

**Files:**
- Create: `lighthouse/lighthouserc.desktop.json`, `lighthouse/lighthouserc.mobile.json`, `lighthouse/run.mjs` (executa LHCI nos 2 perfis contra `pnpm preview`, salva em `reports/lighthouse/<perfil>/<pagina>/`, imprime tabela de medianas), `docs/LIGHTHOUSE.md`, `scripts/optimize-images.mjs`
- Modify: `index.html` (meta description, `lang="pt-BR"`, preload da fonte 400 e da imagem do hero com `fetchpriority="high"`), `vite.config.ts` (`autoCodeSplitting`, `build.target 'es2022'`), imagens (AVIF/WebP + width/height + `sizes`)

- [ ] **Passo 1:** `lighthouserc.*.json`: `collect.url` = `http://localhost:4173/` e `/nfts/<id fixo>`, `numberOfRuns: 3`, `settings.preset` (`desktop`) / mobile default, `upload.target: 'filesystem'`, `assert` com `aggregationMethod: 'median'` e os mínimos da seção Global Constraints.
- [ ] **Passo 2:** `pnpm lighthouse` → se abaixo da meta, atacar: LCP (hero AVIF ≤ 60 KB, preload), TBT (code split, excluir devtools do Query do build), CLS (dimensões), SEO (title/description/`robots.txt`/links com texto), Best Practices (sem erros de console; imagens em proporção).
- [ ] **Passo 3:** `docs/LIGHTHOUSE.md` com tabela de medianas por página/perfil, LCP/CLS/TBT, versões (`lighthouse`, `@lhci/cli`, Chrome, Node), ambiente e condições; justificar qualquer resultado abaixo da meta. Versionar HTML/JSON em `reports/lighthouse/`. Commit `perf: otimizações e auditoria lighthouse versionada`.

### Task 18: Deploy (Vercel) e verificação publicada

**Files:**
- Create: `vercel.json` (rewrites SPA + headers da seção 3.3), `.vercelignore`
- Modify: `README.md` (URL pública)

- [ ] **Passo 1:** pedir ao usuário: (a) criar o repositório GitHub (ou autorizar `gh repo create <nome> --private --source . --push`), (b) importar no Vercel (framework Vite, build `pnpm build`, output `dist`, env `VITE_ENABLE_MOCKS=true`, `VITE_MOCK_SCENARIO=default`, `VITE_SOCKET_URL=wss://realtime.kurio.app`, `VITE_API_BASE_URL=/api`). **Ação do usuário obrigatória** (login no Vercel).
- [ ] **Passo 2:** após deploy, verificar na URL pública: `/`, `/nfts/<id>` por acesso direto, refresh em `/checkout` (redirect para login), `?scenario=slow-network`, console sem erros, worker registrado, socket conectando (evento via painel dev altera preço), headers de segurança presentes (`curl -I`).
- [ ] **Passo 3:** rodar Lighthouse também contra a URL pública (informativo) e anotar em `docs/LIGHTHOUSE.md`. Commit `chore: configuração de deploy vercel`.

### Task 19: Documentação e revisão final

**Files:**
- Create/Modify: `README.md`, `ARCHITECTURE.md`, `docs/CONTRACTS.md`, `docs/MOCKS.md`, `docs/TESTING.md`

- [ ] **Passo 1:** `README.md`: visão geral, stack, requisitos (Node 24, pnpm 11), setup (`pnpm i`; `mockServiceWorker.js` já versionado), variáveis, credenciais (`ana@kurio.test`/`bruno@kurio.test`, senha `Kurio!2026`), cupons, seleção de cenário (`?scenario=`, painel `?devtools=1`, `window.__kurio`), reset, comandos (`dev`, `build`, `preview`, `typecheck`, `lint`, `test`, `e2e`, `e2e:ui`, `lighthouse`, `check`), como reproduzir cada fluxo de falha (tabela cenário → passos → comportamento esperado), URL pública, estrutura de pastas.
- [ ] **Passo 2:** `ARCHITECTURE.md`: decisões (versões, MSW 2 vs 3, token em localStorage), contratos (link para `docs/CONTRACTS.md` com tabelas da seção 3.4 e exemplos JSON), política de sessão, estado do carrinho (guest/user/merge), cache/retries/invalidação (3.6), reconciliação REST × Socket (3.5), idempotência, limitações (transporte websocket-only, sem multi-aba, login social indisponível), decisões de UX e desvios do Figma (grid normalizado, backdrop, estados não desenhados, substituição de assets se houver), ajustes de acessibilidade (contraste de Text/Secondary sobre Surface Card — verificar ≥ 4.5:1; se não atingir, escurecer o fundo do card e registrar).
- [ ] **Passo 3:** `code-reviewer` em todo o repositório; corrigir CRITICAL/HIGH. `pnpm check && pnpm e2e && pnpm lighthouse` verdes a partir de **checkout limpo** (`git clone` em pasta temporária → `pnpm i --frozen-lockfile` → tudo roda).
- [ ] **Passo 4:** Commit `docs: README, ARCHITECTURE e documentação de contratos, mocks e testes`; push; confirmar que o deploy corresponde ao `HEAD`.

---

## Verificação final (checklist do executor antes de entregar)

- [ ] Eliminatórios: stack toda em uso; fluxos funcionais; confirmação só após `order.updated`/`GET /orders` confirmado; Bruno nunca vê dados de Ana (testado); eventos passam pelo `socket.io-client` (nenhum `setQueryData` de tempo real fora de `applyRealtimeEvent`); `pnpm e2e` executável de checkout limpo.
- [ ] 12 cenários de E2E do enunciado cobertos (specs 01–12) + visual (13) + layout (00), em desktop e mobile.
- [ ] Figma: comparar lado a lado cada tela em 1440 e 390 (screenshots do Playwright vs. frames); tipografia Roboto Mono, cores exatas, espaçamentos 120/96/48/32/24.
- [ ] Lighthouse medianas ≥ metas em `docs/LIGHTHOUSE.md`, relatórios versionados.
- [ ] Segurança: headers em produção, sem segredos, senhas com hash, 401/403 corretos, idempotência, validação dupla, `pnpm audit` sem vulnerabilidades altas.
- [ ] Documentação completa e URL pública funcionando com refresh e acesso direto.
