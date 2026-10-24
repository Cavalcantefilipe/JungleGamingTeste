# Revisão de padrões de código

Revisão de 24/10/2026 orientada por `CLAUDE.md`, `.claude/rules/kurio.md`, configurações
TypeScript, ESLint e Prettier, com leitura dos padrões de componentes, hooks, formulários,
consultas, APIs e handlers. O objetivo foi corrigir divergências concretas sem alterar as
regras de negócio ou a apresentação das telas.

## Correções

- **Conversões por `unknown`:** o lint aceitava `valor as unknown as Tipo`, apesar da proibição
  expressa. A configuração agora rejeita essa construção por meio da AST.
- **Dependências de mocks:** imports estáticos já eram bloqueados fora do bootstrap e testes,
  mas imports dinâmicos passavam. A regra agora cobre strings, templates estáticos e
  `import()` usado como tipo. A exceção de Axios em `src/lib/http.ts` também passou a manter
  a proibição de mocks.
- **Imports absolutos:** a regra escrita exigia `@/`, mas o código usava caminhos relativos.
  A integração normalizou **464 referências em 211 arquivos**, incluindo **37 arquivos de
  teste**, sem alterar sua lógica. O manifesto está em
  `reports/code-standards/import-normalization.json`. A regra de lint cobre importação,
  reexportação, importação dinâmica e tipos importados. O arquivo gerado pelo Router foi
  preservado; configurações e E2E continuam fora do alias de `src`.
- **Formulários:** `ProfileForm` e `WalletForm` passaram a delegar validação, submissão,
  tratamento de erros, reset e estado de confirmação a `useProfileForm` e `useWalletForm`.
  Login, cadastro e senha já seguiam esse padrão. Schemas, mensagens e comportamento foram
  preservados.
- **Queries e efeitos:** `OrderPage`, a rota de detalhe e `RealtimeProvider` agora delegam
  sua lógica a `useOrderPageState`, `useNftDetailQuery` e `useRealtimeConnection`. Foram
  mantidos query keys, ordem das operações, dependências dos efeitos, verificações de sessão
  e cleanup da conexão.
- **Ordem dos imports:** a integração também corrigiu imports após declarações em
  `PasswordField` e `CouponField`.

## Verificações automatizadas

| Área                      | Proteção existente ou acrescentada                                                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript                | `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `verbatimModuleSyntax`, variáveis não usadas e fallthrough |
| Tipos inseguros           | Regras contra `any`, non-null assertions e agora a conversão dupla por `unknown`                                                                     |
| Dependências              | Cliente HTTP centralizado, restrição dos mocks e caminhos absolutos em `src`                                                                         |
| React                     | Regras de hooks, dependências de efeitos e Fast Refresh                                                                                              |
| Legibilidade              | Limites de arquivo, função e profundidade; avisos de tamanho também bloqueiam o gate por `--max-warnings=0`                                          |
| Formatação                | Prettier, ordenação de imports e plugin de ordenação Tailwind                                                                                        |
| Regressão da configuração | `scripts/codeRules.test.mjs`, executado pelo comando `test:tooling` e por `pnpm check`                                                               |

A leitura das APIs de autenticação, catálogo, detalhe, carrinho, perfil, carteiras,
favoritos, checkout e pedidos confirmou o uso de `apiRequest` e schemas Zod para as
respostas. Os formulários de conta e compra usam React Hook Form com `zodResolver`; os
campos compartilhados vinculam mensagens e estado inválido aos controles.

O estado remoto permanece no TanStack Query. Parâmetros compartilháveis como filtros,
página, ordenação, aba e destino de autenticação permanecem na URL. As extrações desta
revisão não alteram o isolamento das consultas por usuário ou as proteções contra
respostas pertencentes a uma sessão anterior.

## Convenções e exceções existentes

- `src/components/ui` mantém a composição do shadcn/Radix, com mais de uma exportação por
  arquivo quando necessário para primitives como `Dialog`, `Form` e `Select`. Essa camada
  já tem exceções explícitas de Fast Refresh e tamanho de função no ESLint. As features
  continuam usando componentes separados.
- Testes não têm os limites de tamanho de arquivo/função impostos ao código de produto.
  O arquivo `routeTree.gen.ts` é gerado e excluído da normalização manual e do lint.
- A ponte de estilos do Sonner fica centralizada em `components/ui/sonner.tsx`, com variáveis
  CSS dos tokens. Ela não representa uma autorização para estilos inline em componentes
  das features.
- Loaders do Router podem antecipar consultas por meio das opções compartilhadas. A
  consulta usada para renderizar a tela fica no hook da feature.
- A newsletter mantém validação HTML nativa e feedback explícito de demonstração; não
  possui operação de cadastro no contrato da aplicação.

## Evidências e limites

- Os testes de lint reproduziram as lacunas antes da correção. A revisão independente
  identificou também o caso de templates estáticos, acrescentado à regressão.
- Os arquivos E2E `08-account.spec.ts` e `29-account-completeness.spec.ts` passaram nos
  projetos desktop e mobile: **28 testes aprovados** após a extração dos formulários.
- A revisão independente das cinco extrações não encontrou mudança de comportamento.
  Após os deltas de busca e concordância `9fd3739`/`4185cbb`, a integração passou em tipos, lint sem avisos,
  formatação, **138 testes unitários** e **16 testes das ferramentas**; o build também passou.
  [Check](../reports/code-standards/check.txt), [build](../reports/code-standards/build.txt).
  A suíte completa no Railway verificou a versão anterior `369f9ee`: **333 aprovações,
  37 exclusões explícitas e nenhuma falha**. Esse resultado não é atribuído ao delta posterior.
  [Log público](../reports/screens-completeness/public-chromium.txt).
- A inspeção do código não encontrou `eslint-disable`, `@ts-ignore`, `@ts-expect-error`,
  conversões duplas por `unknown` ou marcadores pendentes em `src`/`e2e`, excluindo o
  arquivo gerado. As strings intencionalmente inválidas nos testes das regras ficam em
  `scripts/codeRules.test.mjs`.
- `pnpm audit --json` retornou zero advisories na consulta desta revisão: 788 dependências
  registradas, sendo 202 de produção e 586 de desenvolvimento; 130 também classificadas
  como opcionais. O resultado não prova ausência de vulnerabilidades.
- Regras sem verificação completa por lint, como nomes autoexplicativos, centralização de
  toda mensagem repetida e fidelidade visual, continuam exigindo revisão humana. Imports
  construídos com valores arbitrários em runtime não são resolvidos por esses seletores.
- A conferência manual foi concluída com uma conta nova, incluindo cadastro, login/logout,
  perfil/avatar, carteiras, favoritos, carrinho, cupons, checkout e recibo da compra simulada.
  [Percurso e evidências](../reports/ui-account-test/README.md).
- A digitação sequencial revelou espaço apagado em “Cosmic Bloom” e anúncio indevido de
  `CancelledError`. O delta `9fd3739` corrige ambos: quatro falhas públicas reproduzidas,
  16 E2E locais, 32 E2E públicos e quatro unitários aprovados. A mensagem de contagem
  do catálogo/favoritos também foi centralizada com singular/plural. [Evidências](../reports/search-typing/).

Esta revisão não constitui prova de ausência de bugs e não amplia o escopo para backend,
pagamentos ou autenticação externos, que permanecem simulados conforme a documentação.
