# Simulação local

MSW 2 intercepta REST e WebSocket no navegador. A inicialização aguarda `worker.start()` e só então importa a aplicação: o Engine.IO captura `globalThis.WebSocket` ao carregar o módulo; antecipar esse import impediria a interceptação.

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
