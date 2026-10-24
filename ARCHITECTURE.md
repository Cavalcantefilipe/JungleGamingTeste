# Arquitetura do Kurio

## Execução e contratos

O cliente React usa TanStack Router, TanStack Query, Axios, React Hook Form e Zod. `src/contracts` contém os schemas de entrada/saída de REST e dos eventos. As chamadas passam pelos módulos `api.ts` das features e validam a resposta com o schema correspondente. `src/lib/http.ts` transforma falhas em `ApiError` com código, status e erros por campo.

Com `VITE_ENABLE_MOCKS=true`, MSW intercepta as mesmas rotas que uma API real usaria. `src/mocks/handlers` valida cada requisição, `src/mocks/shared` implementa preço, estoque, cupom e pedidos, e `src/mocks/db` guarda o estado em `localStorage`. Não há atalhos de negócio no componente.

| Recurso        | REST                                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Autenticação   | `POST /auth/register`, `POST /auth/login`, `GET /auth/session`, `POST /auth/logout`                                                                 |
| NFTs           | `GET /nfts`, `GET /nfts/:id`                                                                                                                        |
| Favoritos      | `GET /favorites`, `PUT /favorites/:nftId`, `DELETE /favorites/:nftId`                                                                               |
| Carrinho       | `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:itemId`, `DELETE /cart/items/:itemId`, `POST /cart/merge`                                      |
| Cotação/pedido | `POST /quote`, `POST /orders` com `Idempotency-Key`, `GET /orders/:id`                                                                              |
| Conta          | `GET/PATCH /profile`, `POST/DELETE /profile/avatar`, `POST /profile/password`, `GET /wallets`, `PUT /wallets/:role`, `POST /wallet-session/connect` |

## Sessão, carrinho e compra

A sessão fica em `localStorage`. O token é enviado no cabeçalho `Authorization`; o bootstrap consulta `/auth/session`. Um `401` de sessão expirada limpa o token e preserva o destino em `returnTo`. Dados privados do Query e rascunhos locais são limpos no logout. O aviso de expiração fica em `sessionStorage` para sobreviver ao redirecionamento.

Visitantes recebem um ID de carrinho local enviado em `X-Guest-Id`. Após login/cadastro, `POST /cart/merge` reúne os itens com o carrinho do usuário. Quantidade e remoção são atualizadas pelo servidor; no item com quantidade 1, o botão “−” remove o item. A cotação vem de `POST /quote`, inclusive desconto e taxa, e é recalculada quando mudam itens, cupom ou rede. O checkout exige carteira cadastrada, conecta a carteira simulada e só mostra “Compra confirmada” após o pedido confirmar.

Antes de `POST /orders`, a entrada e a chave de idempotência são guardadas em `sessionStorage`. Em timeout, “Verificar pedido enviado” repete a mesma requisição e recebe o mesmo pedido, inclusive após refresh. Se a cotação ficou obsoleta, a tela invalida os valores e pede revisão. Pedidos pendentes são consultados periodicamente; estados confirmados ou recusados encerram a consulta. O mock reserva estoque ao criar e remove os itens comprados do carrinho após confirmação.

## Cache e tempo real

As chaves do TanStack Query estão em `src/lib/query-keys.ts`. Catálogo/detalhe são separados dos dados privados por usuário. Mutations atualizam ou invalidam as chaves afetadas; login/logout limpa o cache. Eventos Socket.IO `nft.updated` atualizam NFTs em cache e invalidam carrinho/cotação quando necessário. `order.updated` atualiza apenas o pedido já presente no cache do usuário atual. O gate descarta IDs duplicados e versões antigas e conserva seu histórico durante reconexões. Cada representação de NFT compara a versão do evento com a própria versão recebida por REST; uma consulta mais nova não bloqueia a atualização das outras. Pedidos confirmados/recusados são terminais. As recomendações participam das mesmas chaves de cache do catálogo. Na reconexão, o cliente invalida NFTs, carrinho, cotação e pedidos para reconciliar com REST. A página do pedido também usa polling como recuperação quando não recebe o evento.

## Decisões de interface e limitações

O carrinho usa controles de quantidade coloridos, desconto com `(-)` e recomendações em carrossel com ampliação no hover. Login e cadastro viram páginas compactas em telas baixas, evitando rolagem dentro do diálogo. As páginas de conta incluem a navegação lateral da referência. O checkout mostra os dados da carteira cadastrada e oferece edição na tela de carteiras; a confirmação aparece em um recibo centralizado. As quatro artes originais do Figma estão em `assets/figma` e são servidas em WebP otimizado. Os 48 NFTs simulados reutilizam essas quatro artes, como os cards da referência. A galeria mantém a arte do NFT selecionado; não há quatro ângulos originais diferentes disponíveis. Uma migração substitui imagens SVG antigas nos dados já persistidos sem alterar preços/quantidades ou valores dos recibos.

O servidor, a conexão da carteira, a confirmação de rede e o explorador são simulados. O mock Socket.IO vive na aba atual e não sincroniza eventos entre abas. “Esqueceu a senha?” e os links informativos fora do escopo anunciam indisponibilidade. Não há integração real com blockchain ou backend. Existe uma demonstração no Railway, mas a versão pública observada não contém esta revisão local. Links de conta, carteiras e favoritos levam aos fluxos existentes; páginas editoriais e suporte seguem fora do escopo.

## Políticas de cache e recuperação

| Consulta                     | Atualidade                              | Recuperação                                                                                      |
| ---------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Catálogo                     | 30 segundos                             | Mantém resultados anteriores durante a troca de parâmetros; novas respostas usam a chave da URL. |
| Detalhe/recomendações        | 60 segundos                             | Eventos atualizam representações antigas; reconexão invalida as consultas.                       |
| Carrinho, perfil e carteiras | Imediatamente obsoletos                 | Revalidação ao montar e ao recuperar foco.                                                       |
| Cotação                      | Imediatamente obsoleta                  | Sem retry automático; mantém a cotação anterior durante atualização, com envio bloqueado.        |
| Pedido                       | Consulta a cada 1,5 s enquanto pendente | Para ao confirmar/recusar; refresh e reconexão consultam o mesmo pedido.                         |

O cache não utilizado é coletado após cinco minutos. Leituras transitórias (timeout, rede ou HTTP 5xx) tentam novamente no máximo duas vezes, com espera de 1 s e 2 s. Erros de validação/autenticação não são repetidos. Mutations não têm retry automático. Favoritos têm atualização otimista dos IDs, rollback em falha e invalidação do catálogo filtrado ao finalizar a operação.

O formulário do checkout salva o rascunho em `sessionStorage` por usuário, inclusive campos ainda incompletos. Refresh e expiração preservam o rascunho; logout o remove, e a confirmação limpa o rascunho concluído. A chave da tentativa é mantida em falhas de transporte e de autenticação: uma resposta 401 não prova que o pedido anterior deixou de existir. A recuperação continua disponível mesmo se a nova cotação falhar por estoque reservado. No mock, a idempotência é indexada por usuário e chave; a compatibilidade com tentativas antigas também verifica o dono do pedido.

Alterações de preço, estoque ou taxa geram uma etapa explícita de revisão; confirmar compra fica desabilitado durante a atualização ou falha de cotação. A carteira, a rede e o provedor selecionados são enviados à API e aparecem no resumo. Ao mesclar carrinhos no login, quantidades são limitadas ao estoque e a 99 unidades por item; ajustes são informados ao usuário.

## Adaptações visuais

No pagamento mobile, os dados do colecionador e o resumo podem ser expandidos; campos inválidos abrem automaticamente para permitir correção. Em mobile, detalhe/carrinho/pagamento/autenticação usam a navegação compacta dos frames, e o detalhe mantém a compra acessível no rodapé. Em telas baixas, autenticação ocupa uma página para preservar campos e foco sem rolagem interna de modal. Elementos pequenos ganharam áreas de toque de 44 px. Em tablet, cabeçalho, hero, catálogo e rodapé mudam a distribuição para evitar cortes. Avatar e alteração de senha seguem a composição do perfil; os botões de salvar perfil e senha são separados porque são operações independentes na API.

Ícones de provedores e alguns elementos decorativos usam representações locais simplificadas; não há dependência de serviços externos para renderização. As baselines do Playwright registram a implementação em três larguras; uma diferença abaixo do limiar da captura não prova fidelidade exata ao Figma.
