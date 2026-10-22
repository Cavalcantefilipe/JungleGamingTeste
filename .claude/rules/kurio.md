# Regras de código do projeto Kurio (front e camada mock)

> Fonte: seção 5 de `docs/superpowers/plans/2026-10-22-kurio-nft-marketplace.md`. Estas regras são obrigatórias em todo o código do repositório.

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

