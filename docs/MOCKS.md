# Simulação local

MSW 2 intercepta REST e WebSocket no navegador. A inicialização carrega os mocks, o renderer e os providers em paralelo, mas aguarda `worker.start()` antes de montar React. O transporte de tempo real é importado pelo efeito do provider após a montagem: o Engine.IO captura `globalThis.WebSocket` ao carregar seu módulo, por isso esse import precisa ocorrer após a interceptação. Desmontagem ou troca de sessão durante o import impede a conexão antiga.

## Transporte de tempo real

- O front usa `socket.io-client`, transporte `websocket`, e a URL `VITE_SOCKET_URL`.
- `ws.link` registra a URL sem `/socket.io`. O MSW normaliza esse prefixo no cliente.
- `@mswjs/socket.io-binding` negocia Engine.IO/Socket.IO e codifica mensagens reais do protocolo.
- Após `connect`, o cliente envia `session` com o token. O servidor valida a sessão persistida, inclusive expiração, para cada envio privado. `nft.updated` é público; `order.updated` só segue para conexões do titular.
- Ping a cada 20 segundos mantém o heartbeat do Engine.IO. Fechar a conexão limpa o timer e o registro do cliente.
- Trocar de usuário ou desmontar remove listeners e desconecta. Eventos com UUID repetido, versão antiga ou igual à versão REST conhecida são descartados. O histórico de UUIDs é limitado a 500 entradas.
- Reconexão invalida consultas ativas de catálogo, carrinho, cotação e pedidos do usuário, conciliando com REST. Atualização normal de NFT escreve no cache sem consultar novamente o detalhe. Recibos preservam seu snapshot e estados terminais não regridem.

## Controles de desenvolvimento

Com mocks habilitados, `window.__kurio` oferece:

- `reset(seed)`, `setScenario(name)`, `setNetwork(config)` e `getState()`;
- `emit(event)`: valida o contrato, aplica versões novas ao store e envia pelo binding Socket.IO;
- `disconnectSocket()`, `reconnectSocket()` e `getConnections()` (IDs de usuários, sem tokens);
- `advanceOrder(orderId, status)`: executa a transição persistida, estoque/carrinho e emissão correspondente.

A aplicação não importa esses controles. Só `main.tsx` importa o módulo de inicialização dos mocks. Os testes exercitam os controles no navegador e observam o DOM, inclusive ausência de nova chamada REST quando chega um preço pelo socket.

## Limitações

É uma demonstração em um navegador: sem servidor externo, sincronização entre abas, blockchain ou carteira real. Conexão de carteira e pagamento são simulados. WebSocket é o único transporte; não há fallback por polling do Socket.IO. Pedidos também têm reconciliação REST para recuperar um evento perdido ou reload.

## Reproduzir cenários

Selecione por `?scenario=<nome>` no primeiro acesso ou `window.__kurio.setScenario('<nome>')` no console. Seleção persiste no localStorage. Volte a `default` antes de reproduzir o próximo caso; reset do store é separado da seleção. O painel gráfico `?devtools=1` foi substituído pelos controles no console conforme a linha de corte do plano.

| Cenário                            | Passos                                                                 | Resultado esperado                                                      |
| ---------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `default`                          | navegar, adicionar NFT, entrar como Ana, conectar carteira e confirmar | pendente, depois confirmado; recibo e carrinho limpo                    |
| `empty-catalog`                    | abrir `/?scenario=empty-catalog`                                       | catálogo vazio com ação de limpar filtros; reset default restaura itens |
| `slow-network`                     | abrir catálogo/detalhe ou alterar quantidade                           | skeleton com espaço reservado; estimativa do carrinho antes da resposta |
| `out-of-order`                     | mudar filtros/busca rapidamente                                        | atraso variável; chave Query preserva resultado correspondente à URL    |
| `offline`                          | selecionar após página carregar e executar uma consulta/mutation       | erro de rede, retry/rollback; ao voltar default pode tentar novamente   |
| `server-error-reads`               | abrir catálogo                                                         | consultas GET falham; mensagem e nova tentativa, sem stack              |
| `session-expired`                  | estando logado, acessar rota privada                                   | 401, dados privados limpos, login com returnTo; cenário volta a default |
| `register-conflict`                | cadastrar e-mail novo com dados válidos                                | conflito associado ao campo                                             |
| `coupon-expired`                   | aplicar LANCAMENTO10 no carrinho                                       | cupom recusado, sem desconto                                            |
| `price-changed-during-checkout`    | preparar carrinho, abrir checkout e aguardar                           | evento muda preço; confirmação bloqueada até revisar cotação            |
| `edition-sold-out-during-checkout` | preparar carrinho, abrir checkout e aguardar                           | indisponibilidade; compra bloqueada e item preservado para ajuste       |
| `order-timeout`                    | confirmar compra, esperar timeout e usar recuperar/recarregar          | primeira resposta atrasa; mesmo pedido/chave, sem duplicação            |
| `payment-declined`                 | confirmar compra e aguardar                                            | pedido recusado, reserva liberada, carrinho preservado                  |
| `favorite-mutation-fails`          | autenticado, alternar favorito                                         | mudança otimista reverte com feedback                                   |
| `wallet-rejected`                  | no checkout, conectar carteira                                         | recusa e opção de tentar novamente                                      |
| `wallet-disconnected`              | conectar/confirmar carteira no checkout                                | bloqueio, solicita reconexão                                            |
| `duplicate-events`                 | criar pedido ou emitir evento                                          | mesmo UUID recebido duas vezes não duplica atualização                  |
| `stale-events`                     | criar pedido ou emitir versão nova                                     | versão antiga entregue depois não regride estado                        |

Controles adicionais: `setNetwork({latencyMs:1500,jitterMs:0,failRate:0,offline:false})`, `disconnectSocket()`, `reconnectSocket()` e `advanceOrder(orderId,'confirmed')`. A emissão usa o envelope de [CONTRACTS.md](CONTRACTS.md) e altera o store antes de passar pelo Socket.IO. Os E2E em `07`, `09`, `10` e `12` demonstram as sequências completas e verificam os pedidos/caches reais da simulação.
