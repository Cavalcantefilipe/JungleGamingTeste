# Contratos REST e Socket.IO

Fonte executável: `src/contracts/`. Prefixo padrão `/api`; chamadas Axios validam resposta com Zod. Valores monetários são strings decimais em ETH, datas ISO 8601 e quantidades inteiras entre 1 e 99. O mock aplica as mesmas regras na entrada; validação do front não autoriza compra.

## Identidade e erros

Recursos privados exigem `Authorization: Bearer <token>`. O mock resolve o dono pela sessão; `userId` fornecido pelo cliente não escolhe a conta. Carrinho visitante usa `X-Guest-Id`; um token inválido não pode fazer fallback para visitante. APIs privadas conferem também o dono da resposta antes do cache.

```json
{
  "error": {
    "code": "VALIDATION",
    "message": "Dados inválidos",
    "fields": { "email": "Informe um e-mail válido" }
  }
}
```

| Status  | Significado                                                      |
| ------- | ---------------------------------------------------------------- |
| 401     | sessão ausente, expirada ou revogada                             |
| 403     | recurso de outro usuário, carteira recusada ou acesso proibido   |
| 404     | recurso não encontrado                                           |
| 409     | conflito de cadastro, disponibilidade, cotação/chave ou carteira |
| 422     | corpo/JSON/cupom/avatar inválido                                 |
| 429     | limite de tentativas de login da simulação                       |
| 500/503 | falha transitória tratada; detalhe interno não é UI              |

Códigos e mensagens ficam em `src/contracts/common.ts` e `src/lib/errors.ts`. A UI não exibe stack trace. Requisição antiga é recusada se a sessão mudar antes do envio ou após a resposta.

## Endpoints

| Método e caminho               | Entrada principal                                                    | Resposta                                                                     | Acesso                          |
| ------------------------------ | -------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------- |
| GET `/content`                 | —                                                                    | conteúdo editorial do cenário                                                | público                         |
| GET `/nfts`                    | filtros, categorias/redes repetidas, sort, page, pageSize, favorites | `{items,page,pageSize,total,totalPages}`                                     | público; favorites exige sessão |
| GET `/nfts/:id`                | ID NFT                                                               | NFT, preço, imagens, edições, disponibilidade e versão                       | público                         |
| GET `/nfts/:id/reviews`        | page, pageSize (padrão 4; máximo 20)                                 | avaliações paginadas: id, nftId, author, rating, comment, createdAt, edition | público                         |
| POST `/auth/register`          | username, email, password                                            | sessão, 201                                                                  | público                         |
| POST `/auth/login`             | email, password                                                      | sessão                                                                       | público                         |
| GET `/auth/session`            | —                                                                    | `{user,expiresAt}`                                                           | sessão                          |
| POST `/auth/logout`            | —                                                                    | 204; revoga token/conexão                                                    | sessão                          |
| GET `/favorites`               | —                                                                    | `{nftIds}`                                                                   | sessão                          |
| PUT/DELETE `/favorites/:id`    | ID NFT                                                               | 204                                                                          | sessão                          |
| GET `/cart`                    | —                                                                    | carrinho com scope e snapshots                                               | visitante/sessão                |
| POST `/cart/items`             | nftId, editionId, quantity                                           | carrinho atualizado                                                          | visitante/sessão                |
| PATCH `/cart/items/:id`        | quantity                                                             | carrinho atualizado                                                          | mesmo scope                     |
| DELETE `/cart/items/:id`       | —                                                                    | carrinho atualizado                                                          | mesmo scope                     |
| POST `/cart/merge`             | guestId                                                              | carrinho do usuário com merge                                                | sessão                          |
| POST `/quote`                  | items, couponCode opcional, network                                  | cotação válida por 60s                                                       | público                         |
| POST `/wallet-session/connect` | walletId, provider, address, network                                 | `{status:"connected",address}`                                               | dono e identidade da carteira   |
| POST `/orders`                 | cotação, itens, carteira e coletor; header Idempotency-Key           | pedido pendente, 201; repetição 200                                          | sessão                          |
| GET `/orders/:id`              | —                                                                    | pedido/snapshot/status                                                       | dono do pedido                  |
| GET `/profile`                 | —                                                                    | perfil                                                                       | sessão                          |
| PATCH `/profile`               | campos permitidos do perfil                                          | perfil atualizado                                                            | sessão                          |
| POST `/profile/avatar`         | dataUrl                                                              | perfil atualizado                                                            | sessão                          |
| DELETE `/profile/avatar`       | —                                                                    | perfil atualizado                                                            | sessão                          |
| POST `/profile/password`       | currentPassword, newPassword                                         | 204                                                                          | sessão/senha atual              |
| GET `/wallets`                 | —                                                                    | `{primary,secondary,sameAsPrimary}`                                          | sessão                          |
| PUT `/wallets/:role`           | dados da carteira ou sameAsPrimary para secundária                   | carteiras atualizadas                                                        | sessão                          |

Sessão contém token, expiresAt e user (id, username, email, displayName, avatarUrl). Nenhuma resposta de perfil inclui senha/hash/salt. Avatar: PNG/JPEG/WebP, limite 2MB, MIME/assinatura/base64 válidos; SVG e HTML não são aceitos. Endereços EVM exigem 0x + 40 caracteres hex; Solana aceita base58 de 32 a 44 caracteres. Isso valida formato, não posse de carteira.

## Cotação e criação de pedido

```json
{
  "items": [{ "nftId": "nft-001", "editionId": "nft-001-10", "quantity": 1 }],
  "couponCode": "LANCAMENTO10",
  "network": "ethereum"
}
```

Os IDs de edição devem vir do GET do NFT; o exemplo ilustra o formato e não substitui essa consulta. Linhas repetidas para a mesma edição são recusadas. Preço/cupom/taxa são calculados pelo mock; campos extras de total não autorizam valor. A cotação devolve id, items com tokenId/unitPrice/lineTotal/available, subtotal, discount, networkFee, total, coupon opcional, network, version e expiresAt. O tokenId é copiado do catálogo para o snapshot; leituras de cotações e pedidos antigos ainda aceitam sua ausência.

```json
{
  "quoteId": "<id recebido da cotação>",
  "items": [{ "nftId": "nft-001", "editionId": "<id recebido do NFT>", "quantity": 1 }],
  "couponCode": "LANCAMENTO10",
  "wallet": {
    "walletId": "<id da carteira salva>",
    "provider": "metamask",
    "network": "ethereum",
    "address": "<endereço revisado>"
  },
  "collector": { "username": "ana", "displayName": "Ana", "email": "ana@kurio.test" }
}
```

`Idempotency-Key` é obrigatório no POST; o cliente persiste a chave antes de enviar. Mesma chave/usuário e hash do corpo normalizado devolvem o mesmo pedido; corpo diferente retorna `IDEMPOTENCY_CONFLICT`. O commit revalida sessão, carteira/conexão, cotação, preço, cupom e estoque. `QUOTE_STALE` exige revisão; `UNAVAILABLE` preserva o item para ajuste.

Conexão e compra com endereço/rede/provedor diferentes da carteira salva retornam `WALLET_CHANGED` e exigem nova revisão. O cliente envia sempre o endereço revisado. O parser de pedido aceita endereço ausente somente para compatibilidade de leitura/replay de tentativas antigas: uma chave antiga já aceita recupera o pedido original; uma compra nova sem endereço é recusada no commit, sem gravar pedido ou chave. [Regressões de carteira](BEHAVIOR-REVIEW.md).

Pedido contém id, userId, status (`pending`, `confirmed`, `declined`), itens e valores em snapshot, collector, wallet, transactionRef, explorerUrl, datas e version. Nome de usuário, nome de exibição, e-mail, ENS e observação vêm dos dados revisados no checkout; o rascunho preserva as edições após refresh. collector/username são opcionais na leitura de dados legados, sem acrescentar valores a tentativas antigas ou mudar seu hash de idempotência. Apenas pedido confirmado permite recibo final; URL do explorer aceita o formato HTTPS exato de transação Etherscan ou marcador interno pending. Não há blockchain real.

## Eventos de tempo real

O cliente usa `socket.io-client`, WebSocket apenas. Após connect emite `session` com token ou string vazia para conexão pública. O binding MSW negocia Engine.IO/Socket.IO e envia os eventos pelo transporte; não há atalho de evento direto para o cache.

| Evento          | Recurso             | Payload                                                                  |
| --------------- | ------------------- | ------------------------------------------------------------------------ |
| `nft.updated`   | `{kind:"nft",id}`   | preço, compareAtPrice, edições, badges e versão opcionais                |
| `order.updated` | `{kind:"order",id}` | status obrigatório; referência, explorer, motivo, datas/versão opcionais |

```json
{
  "id": "123e4567-e89b-42d3-a456-426614174000",
  "type": "nft.updated",
  "resource": { "kind": "nft", "id": "nft-001" },
  "version": 2,
  "occurredAt": "2026-07-29T12:00:00.000Z",
  "payload": { "price": "1.25", "version": 2 }
}
```

Zod valida o evento. O gate descarta UUID repetido e versão antiga/igual à conhecida por REST; eventos privados só atualizam pedidos conhecidos do usuário atual. Reconexão concilia com REST, pedido terminal não regride e o recibo não muda com o catálogo. [MOCKS.md](MOCKS.md) documenta controles; [CONCURRENCY.md](CONCURRENCY.md) descreve transações e recuperação.

## Avaliações e metadados do detalhe

`NFT.details` fornece parágrafos, procedência, contrato, padrão, criador e percentual de direitos autorais. O campo é opcional na leitura para aceitar armazenamento de versões anteriores; o catálogo atual o fornece para todos os itens. A revisão editorial 3 migra esses campos sem alterar contas, carrinhos, pedidos, estoque ou preços já atualizados.

Avaliações são fixtures determinísticas em `src/mocks`, servidas por REST/MSW e validadas com Zod. A contagem e a média arredondada correspondem ao resumo do NFT. O endpoint devolve 404 para NFT inexistente e 422 para paginação inválida. Não há submissão de comentários ou avaliações reais nesta demonstração.
