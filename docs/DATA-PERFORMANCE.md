# Persistência, consultas e desempenho

Revisão: **23/10/2026**. Complemento de [SECURITY-REVIEW.md](SECURITY-REVIEW.md).

## O que existe hoje

Não existe Postgres, MySQL, Supabase, ORM ou servidor remoto. `src/mocks/db/store.ts` mantém um estado em memória, clona snapshots e persiste um JSON validado no localStorage. Assim, não há SQL para executar com `EXPLAIN`, índice de banco a medir ou pool de conexões a configurar. A revisão mede o caminho realmente implementado.

## Problema corrigido

Cotações de 60 segundos permaneciam indefinidamente no estado. Cada alteração futura precisava clonar, validar e serializar também esse histórico inútil. A criação da cotação fazia uma leitura integral seguida de outra cópia na gravação.

`storeQuote` agora calcula e persiste a cotação em uma transação, partindo de um snapshot. Na mesma operação elimina cotações vencidas e preserva as ainda válidas. Se a gravação falha, a operação não é confirmada apenas em memória. Pedidos e chaves de idempotência não são apagados por essa limpeza.

### Medição reproduzível

Teste: `src/mocks/shared/storeQuote.test.ts`, via `pnpm exec vitest run src/mocks/shared/storeQuote.test.ts`. O teste publica `MOCK_DB_BENCHMARK` em JSON. Medição registrada junto da suíte unitária, Node 24/jsdom, catálogo de 48 NFTs, sem latência de rede:

| Medida                                          |     Resultado |
| ----------------------------------------------- | ------------: |
| Cotações expiradas inseridas no teste           |         1.000 |
| JSON persistido antes da limpeza                | 504.422 bytes |
| JSON após limpar e salvar uma cotação           |  61.152 bytes |
| Redução do estado nesse caso                    |         87,9% |
| Amostras subsequentes de cotação + persistência |           100 |
| Tempo médio                                     |       1,73 ms |
| Percentil 95                                    |       6,31 ms |
| Máximo                                          |      22,84 ms |

[Resultados brutos](../reports/security/mock-db-metrics.json). O benchmark inclui validação e gravação locais, e também o custo da asserção do teste. Os números variam com CPU/carga; não representam throughput de servidor, SLA, consulta SQL ou experiência em um celular físico. O teste não impõe limite de tempo instável para passar na CI.

## Chamadas e cache revisados

| Caminho                    | Situação                                                                                                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Catálogo                   | Paginação de 9 itens; filtro/ordem/página na URL e chave Query. Loader e componente compartilham a query, deduplicando requisição concorrente.                                                         |
| Detalhe                    | Cache por NFT; galeria usa assets estáticos, sem nova chamada por thumbnail.                                                                                                                           |
| Carrinho                   | Cache por visitante/usuário; quantidade mostra estimativa decimal imediatamente. Mutation e uma cotação rodam em paralelo, sem segunda cotação redundante ao concluir a mutation.                      |
| Dados dos itens            | Uma query por NFT distinto, em paralelo, deduplicada pelo Query. Ainda existe fan-out para carrinhos grandes; um backend real pode devolver disponibilidade/versão no resumo ou usar endpoint em lote. |
| Perfil/carteiras/favoritos | Cache separado por usuário; resposta antiga é rejeitada e a troca de sessão limpa o cache. Não há armazenamento compartilhado de dados privados entre contas.                                          |
| Token                      | Verificação no handler e no commit quando há etapa assíncrona; controles locais de envio/resposta não acrescentam uma ida à rede por chamada.                                                          |
| Guard privado              | `/auth/session` valida a entrada em rota privada. Esse custo já existia e permanece explícito.                                                                                                         |
| Compra                     | Verifica conexão da carteira e então cria pedido autoritativo. Hash/PBKDF2 ficam fora do commit síncrono; valores/estoque/sessão são revalidados no commit.                                            |
| Pedido pendente            | Socket atualiza; REST reconcilia e consulta a cada 3 segundos somente enquanto pendente. Estado terminal encerra o polling.                                                                            |
| Cotações expiradas         | Eliminadas na próxima criação de cotação; não dependem de timer em aba de fundo.                                                                                                                       |

O teste E2E com 1.500 ms de latência artificial continua verificando estimativa antes da rede e exatamente uma consulta de cotação. O preço final é sempre confirmado no mock da API, nunca pelo cálculo do front. Evidência anterior de 17 ms para feedback está em [CONCURRENCY.md](CONCURRENCY.md).

## Eventos e custo de reconciliação

Um preço novo altera imediatamente o detalhe e as linhas já conhecidas, sem refazer a consulta do detalhe. Listas com limites de preço ou ordenação por preço precisam de REST para recuperar a composição/página e os totais corretos: o cache contém apenas uma página e não consegue descobrir sozinho um NFT que passou a pertencer a ela. Mudança de badge também reconcilia uma tab filtrada. Listas sem critérios afetados recebem a atualização local. Um evento durante o primeiro GET cancela a resposta antiga e inicia uma leitura atual quando a query está ativa. Esse custo corrige consistência; não adiciona verificação de sessão por rede a cada cálculo local.

## O que não está otimizado para um banco real

O armazenamento inteiro ainda é clonado/validado/serializado em cada gravação; localStorage é síncrono e tem quota limitada. Arrays de sessões/contas/pedidos usam busca linear. Para 48 NFTs o custo medido é pequeno, mas o desenho não escala como banco de produção. Históricos de pedidos e chaves de idempotência precisam de política de retenção própria; descartá-los indiscriminadamente permitiria duplicar uma compra antiga.

Ao existir backend real, medir consultas com dados e volume representativos. Usar índices para token/hash de sessão, dono/ID de pedido, dono/ID de carteira, carrinho/edição e unicidade de `(user_id, idempotency_key)`. Reservas/estoque e idempotência devem ser transacionais no banco compartilhado. Evitar N+1 com retorno em lote e selecionar apenas colunas necessárias. Esses são requisitos de implementação futura, não índices já existentes nesta entrega.

## Resposta à revisão

O caminho local de cotação recebeu correção concreta, foi medido e continua sem exigir que o usuário aguarde a rede para ver uma estimativa. A compra mantém validação autoritativa. Não seria correto afirmar que “o banco está otimizado”: ainda não há banco real para certificar.
