# Anúncio da contagem do catálogo

## Relato e causa

O usuário confirmou que, ao abrir/recarregar a página com VoiceOver, a primeira frase percebida era a contagem do catálogo. A região `aria-live="polite"` recebia a contagem ao concluir a consulta inicial, embora não houvesse interação. Não foi identificada alteração de foco inicial pela aplicação; este delta atua apenas no anúncio.

## Correção

- A contagem inicial continua disponível na árvore de acessibilidade, fora da região live.
- A região live permanece montada e vazia até uma navegação de busca, filtro ou página dentro do catálogo; isso inclui os links do rodapé e o histórico.
- Depois dessa interação, a contagem passa a existir somente na região live, sem texto duplicado. Durante navegação/consulta, o feedback é “Atualizando…”. Não há contagem fictícia de zero durante carregamento ou erro.
- A correção automática de uma página fora do intervalo usa a página efetiva retornada pela API para permanecer silenciosa. Uma paginação posterior feita pelo usuário anuncia os resultados normalmente.
- A abertura de `#busca` sozinha não ativa anúncios. Nenhum foco automático, skeleton, modal ou configuração do leitor de tela foi alterado.

## Evidências

1. `public-red.txt`: duas falhas esperadas (Chromium desktop/mobile) contra Railway antes do ajuste. Commit `4716d46eb6a9f397cc889433aed5846a5a3b0395`, deployment `31fa792f-3447-417f-85df-ad0e95452e4d`, status `SUCCESS`. A região polite continha a contagem durante a abertura. Traces e capturas estão em `public-red/`.
2. `normalization-red.txt`: duas falhas esperadas na primeira implementação local, identificadas pela revisão independente: abrir `/?page=999` disparava um anúncio pela normalização automática. Traces e capturas estão em `normalization-red/`.
3. `chromium-green.txt`: 12 testes aprovados no dev isolado `http://127.0.0.1:4193`, cobrindo carregamento lento com filtros, recarga, cache, erro/retry, busca, limpeza, paginação, zero real, rodapé e normalização inicial.
4. `compat-green.txt`: os mesmos seis cenários passaram em Firefox desktop e WebKit mobile (12 testes) sobre o build final no preview 4192. A execução anterior ao ajuste de tipagem está preservada em `compat-before-type-validation.txt`. O arquivo 32 foi incluído na matriz de compatibilidade existente.
5. `lint.txt` e `format.txt`: verificação focada dos arquivos alterados.

## Integração final

- A primeira integração identificou que `RouterEvents.search` não expõe a propriedade `page` no tipo genérico. O acesso foi trocado por leitura de `searchStr` com `URLSearchParams`, sem casts. A falha original está em `check-before-type-validation.txt`; `typecheck-green.txt` e `normalization-final-green.txt` registram a correção.
- `pnpm check` passou: tipos, lint, formatação, **138 testes unitários e 17 de ferramentas**. [Log](check.txt).
- O build de produção passou. [Log](build.txt).
- A suíte completa Chromium executada sobre esse build no preview 4192 terminou com **353 aprovações e 37 exclusões explícitas**, sem falhas, em 6,9 minutos. [Log](integration.txt).
- A revisão independente confirmou a resolução do caso de normalização inicial e não encontrou bloqueadores restantes.
6. O primeiro check integrado identificou que `RouterEvents.location.search` não expõe campos específicos no tipo público. A leitura da página foi ajustada para `URLSearchParams(searchStr)`, sem casts. `typecheck-green.txt` e `normalization-final-green.txt` registram o typecheck aprovado e os dois cenários de normalização aprovados após esse ajuste; `final-lint.txt` e `final-format.txt` verificam o hook final.

## Escopo da validação

O teste `e2e/32-catalog-announcement.spec.ts` verifica conteúdo, estabilidade e ativação da região live no DOM. Isso comprova as condições que provocavam o anúncio automático; não é uma gravação da fala do VoiceOver nem uma auditoria completa de todos os leitores de tela. A validação manual e a publicação são coordenadas pela tarefa principal.
