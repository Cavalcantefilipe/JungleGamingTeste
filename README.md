# Kurio — Marketplace de NFTs

Implementação do desafio frontend da Jungle Gaming: catálogo, filtros e favoritos, detalhe com edições e avaliações de compradores, carrinho, checkout, recuperação de pagamento, perfil e carteiras. Layout conferido com os assets originais do [Figma](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge).

**Aplicação publicada:** [Kurio na Railway](https://kurio-production-8274.up.railway.app).

**Repositório público:** [Cavalcantefilipe/JungleGamingTeste](https://github.com/Cavalcantefilipe/JungleGamingTeste), branch `main`. O histórico preserva os commits por funcionalidade, correção e documentação.

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

Para reinício completamente limpo da demonstração neste origin, use DevTools → Application e limpe tanto Local storage quanto Session storage; depois recarregue. Isso remove carrinho, conta local, tentativa pendente e rascunho do checkout; não faça durante uma recuperação que queira inspecionar. Os controles ficam no console; não há painel gráfico `?devtools=1` implementado.

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
| `pnpm e2e:compat`                   | Firefox desktop e WebKit mobile; exige instalar os motores    |
| `pnpm lighthouse`                   | 3 execuções por página/perfil; mantém falha se abaixo da meta |
| `pnpm test:tooling`                 | mediana/assertions Lighthouse e negociação/integridade Brotli |
| `pnpm check`                        | tipos, lint, formato, unitários e testes de ferramentas       |
| `pnpm verify:deployment <URL>`      | headers, rotas, compressão, cache e healthcheck da publicação |

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
- [Revisão tela por tela](docs/SCREEN-REVIEW.md), [Figma e adaptações](docs/DESIGN-REVIEW.md), [testes](docs/TESTING.md), [Lighthouse](docs/LIGHTHOUSE.md).
- [Falhas encontradas e corrigidas, BOLA/IDOR, XSS e OWASP](docs/SECURITY-REVIEW.md) e [revisão final](docs/FINAL-REVIEW.md).
- [Validação dos comportamentos](docs/BEHAVIOR-REVIEW.md) e [pendências de entrega/estimativa de avaliação](docs/DELIVERY-ASSESSMENT.md).
- [Configuração e verificação da Railway](docs/DEPLOYMENT.md).
- [Regras de código, padronização e verificações automáticas](docs/CODE-STANDARDS-REVIEW.md).

**Complemento da revisão de 24/10:** carrossel compartilhado com avanço automático no detalhe e carrinho, avaliações paginadas e metadados completos. [Escopo e evidências](docs/DETAIL-COMPLETENESS.md).

**Nova conferência das demais telas, 24/10:** corrigidos paginação/busca, retorno da autenticação, altura do cadastro, feedback de dados salvos, tipografia, conteúdo editorial, filtros pelo rodapé e omissões no pagamento/recibo. [Comparação com Figma, matriz das nove telas e verificação no Railway](docs/SCREENS-COMPLETENESS.md).

**Estado atual:** código `4185cbb` publicado no Railway. Tipos, lint, formatação e build passaram, com **138 testes unitários e 16 de ferramentas**. A suíte completa em `369f9ee` teve **333 E2E Chromium aprovados e 37 exclusões explícitas**. A correção posterior da busca (`9fd3739`) passou por **32 E2E públicos** em Chromium/Firefox/WebKit: preserva os espaços digitados e elimina o anúncio indevido de cancelamento. O ajuste final usa “1 NFT encontrado” no singular. [Resultados por versão e limites](docs/SCREENS-COMPLETENESS.md), [regressão da busca](reports/search-typing/).

As **45 capturas** das nove telas em 1440/768/414/390/320 px preservam a proveniência `0063435`. Nessa etapa anterior, foram aprovados 314 testes Chromium (34 exclusões por viewport), 126 unitários e seis testes de ferramentas. [Capturas e logs por versão](reports/screens-completeness/README.md).

A conferência pela interface foi concluída com a conta fictícia `qa.interface.2410@kurio.test`: cadastro, validações, login/logout, perfil/avatar, carteiras, favoritos, avaliações, carrinho, cupons, checkout e compra simulada, incluindo persistência após recarregar. [Percurso, screenshots e limites](reports/ui-account-test/README.md).

Lighthouse final no Railway: **99/100 desktop e 93/92 mobile** (Home/detalhe), demais categorias **100**, com 12 execuções válidas. A coleta usou Headless Shell após crashes do Chrome for Testing; [ambiente, limites e histórico preservado](docs/LIGHTHOUSE.md).

**Reconciliação anterior de 24/10 publicada:** 120 testes unitários, 6 de ferramentas, 260 E2E Chromium, 166 de compatibilidade Firefox/WebKit e 84 na URL pública aprovados; lint sem avisos. Lighthouse público: performance 97/98 desktop e 93/92 mobile, demais categorias 100. Decisões, exclusões por viewport, evidências e deployment estão em [RECONCILIATION.md](docs/RECONCILIATION.md).

O [checkpoint de qualidade de 23/10](docs/QUALITY-REVIEW.md) preserva o histórico da refatoração React, disputa de estoque, zoom real de 200%, compatibilidade entre motores e Lighthouse público (desktop 96/98 e mobile 93/94 naquela versão). Cada resultado identifica o código e as condições verificados; medições antigas não representam automaticamente um novo deploy.

As [referências do Figma e capturas](reports/design/README.md) documentam a conferência visual e as adaptações, sem alegar igualdade absoluta de pixels. A tentativa de VoiceOver ficou inconclusiva. Não há banco real para certificar otimização SQL ou concorrência entre dispositivos.
