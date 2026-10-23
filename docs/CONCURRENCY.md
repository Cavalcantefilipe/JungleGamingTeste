# Consistência e concorrência

A camada de backend deste desafio é a simulação MSW no navegador. As garantias abaixo são exercitadas com requisições simultâneas e falhas de persistência, no mesmo runtime da aplicação.

## Commit atômico

`mockStore.transaction` recebe um snapshot atualizado e executa um callback síncrono, sem `await`. Validação e atualização pertencem ao mesmo trecho indivisível do event loop. Trabalho assíncrono, como PBKDF2 e SHA-256, acontece antes; os dados relevantes são verificados novamente no commit.

O novo estado passa pelo schema e é gravado no armazenamento antes de substituir o estado em memória. Uma falha devolve `503 TRANSIENT`; não há confirmação de uma alteração que só existiria na memória. Eventos Socket.IO são publicados depois do commit.

O merge de visitante calcula o carrinho completo e limpa o carrinho de origem em uma única gravação. Uma interrupção não deixa os mesmos itens nos dois carrinhos. Incrementos, alterações e remoções também partem de snapshots atuais em transações síncronas.

## Pedidos e estoque

- A chave de idempotência é validada e vinculada ao usuário e ao hash canônico do corpo. O pedido, a chave e a transição agendada são persistidos juntos.
- Requisições concorrentes com a mesma chave recuperam um único pedido. Reutilização com outro corpo gera `409 IDEMPOTENCY_CONFLICT`.
- Antes de criar um pedido, o backend revalida sessão, carteira conectada, cotação, preço e disponibilidade no snapshot do commit.
- Pedidos pendentes reservam suas quantidades. Novas compras consideram essas reservas; cotação e carrinho não reservam estoque.
- Uma edição não pode aparecer em duas linhas da mesma compra. A restrição existe no contrato compartilhado e na cotação de domínio.
- A confirmação verifica o estoque novamente. Se ele caiu, o pedido é recusado e o carrinho é preservado. Não há desconto negativo mascarado com arredondamento para zero.
- Estados terminais não são reaplicados. Reprocessar uma confirmação não desconta estoque duas vezes. A recusa libera a reserva.
- Se a persistência da confirmação falha, o pedido continua pendente, sem baixa de estoque ou evento de sucesso. A transição continua agendada no estado persistido, e a consulta REST pode retomar sua execução.

## Conta e sessão

A contagem de tentativas de login é reservada antes da verificação assíncrona da senha. Uma rajada não perde incrementos nem ultrapassa o limite de cinco tentativas por janela. Login e cadastro confirmam sessão e dados de conta em uma única transação; cadastro verifica unicidade no commit.

A troca de senha compara novamente o hash observado antes da gravação. Duas alterações com a senha antiga não vencem simultaneamente. Sessão expirada ou revogada durante o processamento impede o commit. Handlers com corpo assíncrono autenticam após a leitura e validação do corpo.

## Evidência

`src/mocks/shared/concurrency.test.ts` cobre vinte chamadas simultâneas por chave, disputa de estoque, conflito de corpos, expiração, indisponibilidade durante pagamento, liberação de reserva, confirmação repetida e falhas de gravação/merge. `auth-concurrency.test.ts` cobre rajada de login e cadastros concorrentes. Os testes de handlers verificam a troca simultânea de senha pela API REST real do MSW.

## Alcance

Esta implementação não coordena processos, máquinas ou abas diferentes. Isso acompanha o escopo de simulação do desafio. Um backend externo precisaria transferir essas invariantes para transações do banco, restrições únicas e bloqueios/controle de versão no armazenamento compartilhado; um mutex isolado por processo não ofereceria essa garantia.

## Latência e estimativa no carrinho

A quantidade muda de forma otimista. O front calcula uma estimativa decimal usando preço, percentual de desconto e taxa da última cotação recebida. Não contém tabela própria de promoções ou taxas. Durante a atualização, identifica o valor como estimativa e aguarda a API para liberar o avanço. Trocar usuário, rede ou cupom descarta a cotação anterior; uma edição sem preço conhecido aguarda a API.

A alteração do carrinho e a nova cotação rodam em paralelo. A chave da consulta acompanha os itens, sem uma segunda consulta redundante ao terminar a alteração. A estimativa não tem ID de cotação e não constitui autorização de compra. O backend recalcula os itens na criação do pedido, compara a cotação persistida e revalida estoque e reservas no commit. Totais ou preços adicionais enviados pelo cliente não são usados.

Medição local em 22/10/2026, Node 24, com o catálogo de 48 NFTs: 100 cálculos de cotação com validação e persistência tiveram média de **1,81 ms**, percentil 95 de **2,19 ms** e máximo de **9,88 ms**. Vinte chamadas simultâneas com a mesma chave demoraram **21,88 ms** no total e produziram um pedido. Esses números medem a simulação local, sem rede, e não são estimativa de capacidade de um servidor externo.

No E2E com **1.500 ms de latência simulada**, a estimativa apareceu em **17 ms** tanto no desktop quanto no mobile; a cotação foi confirmada em **1.816/1.819 ms**, com **uma** consulta. O teste `quantidade atualiza estimativa antes da rede e consulta a cotação uma vez` registra as medições como artefato do Playwright. O teste de concorrência `valores enviados pelo cliente não substituem o cálculo do backend` verifica a autoridade do cálculo do pedido.

## Edição de carteiras

Salvar a carteira e atualizar a cópia secundária usa uma transação, com sessão revalidada. Mudar endereço, rede ou provedor remove as conexões dos IDs alterados; a compra exige uma nova conexão. Alterar apenas o apelido preserva a conexão.

O front serializa alterações de carteira por usuário e verifica o token capturado antes de executar uma alteração que estava na fila. Respostas antigas também verificam a sessão antes de atualizar o cache. O E2E troca de Ana para Bruno sem recarregar a página, mantém a primeira resposta pendente e verifica que a alteração seguinte não é enviada com a conta nova.
