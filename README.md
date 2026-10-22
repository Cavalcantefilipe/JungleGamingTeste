# Kurio — Marketplace de NFTs

Solução do desafio frontend da Jungle Gaming (enunciado em `docs/CHALLENGE.md`). Plano de implementação em `docs/superpowers/plans/2026-10-22-kurio-nft-marketplace.md` e regras de código em `.claude/rules/kurio.md`.

## Requisitos

- Node 24 (`.nvmrc`) e pnpm 11.

## Comandos

| Comando                             | O que faz                                     |
| ----------------------------------- | --------------------------------------------- |
| `pnpm install`                      | instala as dependências (lockfile versionado) |
| `pnpm dev`                          | servidor de desenvolvimento com mocks         |
| `pnpm build`                        | typecheck + build otimizado em `dist/`        |
| `pnpm preview`                      | serve o build em `http://localhost:4173`      |
| `pnpm typecheck`                    | verificação de tipos                          |
| `pnpm lint`                         | ESLint                                        |
| `pnpm format` / `pnpm format:check` | Prettier                                      |
| `pnpm test`                         | testes unitários (Vitest)                     |
| `pnpm e2e` / `pnpm e2e:ui`          | testes Playwright                             |
| `pnpm lighthouse`                   | auditoria Lighthouse (3 execuções, mediana)   |
| `pnpm check`                        | typecheck + lint + format:check + test        |

## Variáveis de ambiente

Todas públicas e com valores padrão; copie `.env.example` para `.env` apenas para sobrescrever.

| Variável             | Padrão                     | Uso                                         |
| -------------------- | -------------------------- | ------------------------------------------- |
| `VITE_API_BASE_URL`  | `/api`                     | base das chamadas REST                      |
| `VITE_SOCKET_URL`    | `wss://realtime.kurio.app` | URL do Socket.IO (interceptada pelos mocks) |
| `VITE_ENABLE_MOCKS`  | `true`                     | ativa a camada MSW (REST + Socket.IO)       |
| `VITE_MOCK_SCENARIO` | `default`                  | cenário inicial dos mocks                   |

As demais seções (credenciais, cenários, reprodução de falhas, deploy) são preenchidas ao longo da implementação.
