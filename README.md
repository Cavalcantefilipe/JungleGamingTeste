# Kurio — Marketplace de NFTs

Implementação do desafio frontend da Jungle Gaming: catálogo, filtros e favoritos, detalhe com edições, carrinho, checkout, recuperação de pagamento, perfil e carteiras. Layout conferido com os assets originais do [Figma](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge).

**Demonstração com backend MSW no navegador.** Não realiza pagamentos nem comprova posse de carteira. Contas, tokens e pedidos são fictícios e persistidos localmente. Não use dados ou valores reais. [Revisão de segurança](docs/SECURITY-REVIEW.md).

## Executar

Requisitos: Node 24 (`.nvmrc`) e pnpm 11 (`packageManager` fixa 11.18.0).

```sh
pnpm install --frozen-lockfile
pnpm dev
```

O worker `public/mockServiceWorker.js` está versionado; não é necessário gerá-lo. Para testar o build:

```sh
pnpm build
pnpm preview
```

Preview: http://localhost:4173. Abra em localhost/HTTPS para o service worker. O REST e o WebSocket são interceptados localmente; não precisa configurar servidor de API ou blockchain.

## Contas e cupons

| Conta | E-mail           | Senha      |
| ----- | ---------------- | ---------- |
| Ana   | ana@kurio.test   | Kurio!2026 |
| Bruno | bruno@kurio.test | Kurio!2026 |

Cupom `LANCAMENTO10`: 10% de desconto. `EXPIRADO10`: expirado. Cadastro cria outra conta local; reset remove alterações. Login social mostra indisponibilidade e não simula autenticação externa.

## Variáveis públicas

Defaults incluídos; `.env.example` serve para sobrescrever. Nunca coloque segredos em variáveis `VITE_`.

| Variável             | Padrão                     | Uso                             |
| -------------------- | -------------------------- | ------------------------------- |
| `VITE_API_BASE_URL`  | `/api`                     | base REST                       |
| `VITE_SOCKET_URL`    | `wss://realtime.kurio.app` | Socket.IO interceptado pelo MSW |
| `VITE_ENABLE_MOCKS`  | `true`                     | simulação REST e WebSocket      |
| `VITE_MOCK_SCENARIO` | `default`                  | cenário inicial                 |

Desabilitar mocks exige implementar uma API compatível e o servidor Socket.IO; não existe fallback remoto pronto.

## Cenários e reset

Abra `/?scenario=slow-network` ou use o console com `window.__kurio.setScenario('slow-network')`. O cenário persiste após refresh. A tabela completa de reprodução está em [MOCKS.md](docs/MOCKS.md).

```js
window.__kurio.setScenario('default');
window.__kurio.reset('default');
localStorage.removeItem('kurio.session');
location.assign('/');
```

Para reinício completamente limpo da demonstração neste origin, use DevTools → Application → Local storage → Clear e recarregue. Isso remove também carrinho, conta local e tentativa pendente; não faça durante uma recuperação que queira inspecionar. Os controles ficam no console; não há painel gráfico `?devtools=1` implementado.

## Comandos

| Comando                             | Finalidade                                                    |
| ----------------------------------- | ------------------------------------------------------------- |
| `pnpm dev`                          | desenvolvimento                                               |
| `pnpm build`                        | TypeScript e build em `dist/`                                 |
| `pnpm preview`                      | preview, porta 4173                                           |
| `pnpm typecheck`                    | TypeScript                                                    |
| `pnpm lint`                         | ESLint                                                        |
| `pnpm format` / `pnpm format:check` | Prettier                                                      |
| `pnpm test` / `pnpm test:watch`     | Vitest                                                        |
| `pnpm e2e` / `pnpm e2e:ui`          | Playwright; exige build prévio e Chromium                     |
| `pnpm lighthouse`                   | 3 execuções por página/perfil; mantém falha se abaixo da meta |
| `pnpm check`                        | tipos, lint, formato e unitários                              |

Para E2E: `pnpm exec playwright install chromium`, `pnpm build`, `pnpm e2e`. Veja [TESTING.md](docs/TESTING.md) para projetos, artefatos e regressão visual. Lighthouse usa Chromium já instalado ou `CHROME_PATH`.

## Stack e estrutura

React 19, TypeScript strict, Vite 7, Tailwind 4, componentes Radix/shadcn, TanStack Router/Query, React Hook Form/Zod, Axios, Socket.IO Client e MSW 2. Dinheiro em strings decimais com big.js.

```text
src/app          inicialização, router e providers
src/routes       rotas por arquivo
src/contracts    schemas Zod e tipos inferidos
src/features     APIs, queries, hooks e componentes por domínio
src/components   UI, feedback e mídia compartilhados
src/lib          HTTP, sessão de requisição, decimal, cache e storage
src/mocks        fixtures, handlers, regras transacionais e Socket.IO
src/styles       tokens e estilos globais
public/images    assets originais/otimizados
e2e             fluxos, segurança, acessibilidade e baselines
lighthouse       coleta e assertions
reports          relatórios versionados de segurança/performance
```

## Documentação e estado da entrega

- [Enunciado](docs/CHALLENGE.md), [arquitetura](ARCHITECTURE.md), [contratos](docs/CONTRACTS.md).
- [Concorrência e recuperação](docs/CONCURRENCY.md), [persistência/consultas](docs/DATA-PERFORMANCE.md).
- [Figma e adaptações](docs/DESIGN-REVIEW.md), [testes](docs/TESTING.md), [Lighthouse](docs/LIGHTHOUSE.md).
- [Falhas encontradas e corrigidas, BOLA/IDOR, XSS e OWASP](docs/SECURITY-REVIEW.md) e [revisão final](docs/FINAL-REVIEW.md).
- [Validação dos comportamentos](docs/BEHAVIOR-REVIEW.md) e [pendências de entrega/estimativa de avaliação](docs/DELIVERY-ASSESSMENT.md).

Performance mobile ainda está abaixo de 90 no Lighthouse (Home 89; detalhe 88 no clone final); o comando retorna falha e os relatórios preservam os resultados. Existem dois advisories altos de desenvolvimento em `extract-zip`, sem correção publicada no registro consultado; produção teve zero advisories na revisão. Não há banco real para certificar otimização SQL.

**URL pública: pendente.** `vercel.json` e `.vercelignore` estão preparados. A criação/push do repositório depende da autorização prevista em `CLAUDE.md`, e o login/importação no Vercel depende do usuário. Ainda não foram verificados headers, refresh nem Lighthouse em URL publicada.
