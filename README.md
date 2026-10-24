# Kurio — Marketplace de NFTs

Aplicação React/TypeScript para o [desafio frontend da Jungle Gaming](docs/CHALLENGE.md). Os dados e eventos são simulados no navegador com MSW. O catálogo, detalhe, autenticação, favoritos, carrinho, compra, perfil, carteiras e atualizações em tempo real estão disponíveis para demonstração local.

## Executar localmente

Recomendado: Node 24 (`.nvmrc`) e pnpm 11.18 (`packageManager` em `package.json`). O `package.json` declara suporte mínimo a Node 22 e pnpm 10.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

O Vite mostra a URL local no terminal (normalmente `http://localhost:5173`). Os mocks estão ativos por padrão. Para testar o build de produção localmente:

```bash
pnpm build
pnpm preview
```

O preview usa `http://localhost:4173`. Não é necessário backend externo para a demonstração com mocks.

| Comando             | Função                                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------------- |
| `pnpm typecheck`    | Verifica os tipos.                                                                                        |
| `pnpm lint`         | Executa o ESLint. Há avisos de lint, principalmente de tamanho de função, sem erros.                      |
| `pnpm format:check` | Verifica a formatação.                                                                                    |
| `pnpm test`         | Executa os testes unitários com Vitest.                                                                   |
| `pnpm check`        | Executa tipos, lint, formatação e testes unitários.                                                       |
| `pnpm e2e`          | Executa Chromium desktop/mobile e regressão visual também em tablet; faz build e inicia o preview.        |
| `pnpm e2e:ui`       | Abre a interface de testes do Playwright.                                                                 |
| `pnpm lighthouse`   | Audita início e detalhe em mobile e desktop (3 medições cada) e grava relatórios em `reports/lighthouse`. |

O script Lighthouse usa o Chromium instalado pelo Playwright. Caso necessário, defina `CHROME_PATH` para o executável do Chrome.
Os resultados locais mais recentes estão em [`reports/lighthouse/SUMMARY.md`](reports/lighthouse/SUMMARY.md): performance 91 no mobile e 100 no desktop, com acessibilidade, boas práticas e SEO em 100 nas páginas auditadas. Esses números dependem do ambiente de execução.

## Variáveis de ambiente

Todas as variáveis são públicas (`VITE_`). Copie `.env.example` para `.env` somente se precisar alterar os padrões.

| Variável             | Padrão                     | Uso                                        |
| -------------------- | -------------------------- | ------------------------------------------ |
| `VITE_API_BASE_URL`  | `/api`                     | Base das chamadas REST.                    |
| `VITE_SOCKET_URL`    | `wss://realtime.kurio.app` | URL do Socket.IO interceptada pelos mocks. |
| `VITE_ENABLE_MOCKS`  | `true`                     | Ativa MSW para REST e WebSocket.           |
| `VITE_MOCK_SCENARIO` | `default`                  | Cenário inicial dos mocks.                 |

Com `VITE_ENABLE_MOCKS=false`, é necessário fornecer uma API e um servidor Socket.IO compatíveis. A aplicação não inclui esses serviços reais.

## Contas de demonstração

| Usuário     | E-mail             | Senha        |
| ----------- | ------------------ | ------------ |
| Ana Ribeiro | `ana@kurio.test`   | `Kurio!2026` |
| Bruno Lima  | `bruno@kurio.test` | `Kurio!2026` |

As senhas pertencem apenas ao banco simulado. No armazenamento do mock, elas são derivadas com PBKDF2, não salvas em texto puro.

## Cenários e reset

Selecione um cenário acrescentando `?scenario=<nome>` à URL, por exemplo `http://localhost:5173/?scenario=slow-network`. A escolha persiste em `localStorage`. A lista completa está em [`src/mocks/scenarios/registry.ts`](src/mocks/scenarios/registry.ts) e pode ser consultada no console do navegador com `window.__kurio.listScenarios()`.

| Cenário                              | Como observar                                                                      |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| `empty-catalog`                      | Catálogo sem resultados.                                                           |
| `slow-network`                       | Skeletons e espera nas chamadas REST.                                              |
| `offline` ou `server-error-reads`    | Erros de leitura e tentativa de recuperação no catálogo.                           |
| `session-expired`                    | Faça login e acesse `/account/profile`; a próxima chamada privada expira a sessão. |
| `register-conflict`                  | Tente cadastrar uma conta; o mock responde conflito de e-mail.                     |
| `favorite-mutation-fails`            | Faça login e tente favoritar um NFT; o estado otimista deve ser revertido.         |
| `duplicate-events` ou `stale-events` | Exercitam o descarte de eventos repetidos ou antigos.                              |

Para testar o cupom, adicione um NFT ao carrinho e aplique `LANCAMENTO10` ou `EXPIRADO10`. Para testar compra, entre como Ana (já tem carteiras cadastradas), adicione um NFT, abra o carrinho e escolha **Conectar e finalizar**. Bruno precisa cadastrar uma carteira em **Carteiras** antes de confirmar.

| Cenário                                   | Reprodução pela interface                                                                                       |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `coupon-expired`                          | Aplique `EXPIRADO10` no carrinho; a mensagem de cupom expirado aparece.                                         |
| `price-changed-during-checkout`           | Selecione o cenário antes de adicionar um NFT; a primeira cotação muda o preço e exige revisão antes da compra. |
| `edition-sold-out-during-checkout`        | Selecione antes da cotação; a edição esgota e a compra fica indisponível.                                       |
| `order-timeout`                           | Confirme o pedido; após o timeout, use **Verificar pedido enviado**, inclusive após recarregar a página.        |
| `payment-declined`                        | Confirme o pedido e aguarde a recusa na página do pedido; o link volta ao carrinho.                             |
| `wallet-rejected` / `wallet-disconnected` | Confirme o pagamento para ver o erro de conexão/assinatura.                                                     |

Para voltar ao estado inicial, inclusive encerrando a sessão e limpando o carrinho, execute no console do navegador:

```js
localStorage.clear();
sessionStorage.clear();
location.assign('/?scenario=default');
```

O estado simulado fica em `localStorage` e sobrevive a refresh. `window.__kurio.reset('default')` restaura apenas o banco do mock; não encerra a sessão do cliente. Veja [a documentação dos mocks](docs/MOCKS.md) para o transporte de eventos e suas limitações.

## Estado da implementação

| Área                | Estado atual                                                                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Catálogo            | Busca, filtros, ordenação, paginação, estados de carregamento/erro/vazio e URL testados.                                                      |
| Detalhe do NFT      | Acesso direto, galeria, edições, quantidade, indisponibilidade e adição ao carrinho.                                                          |
| Conta               | Cadastro, login, logout, sessão persistente e proteção das rotas privadas.                                                                    |
| Favoritos           | Persistência por usuário, atualização otimista e rollback em falha.                                                                           |
| Tempo real          | `nft.updated` via Socket.IO simulado, descarte de duplicatas/versões antigas e reconciliação após reconexão.                                  |
| Carrinho            | Edição e remoção, cálculo da cotação, cupom, resumo e carrossel de recomendações.                                                             |
| Pagamento e pedidos | Revisão, conexão da carteira simulada, envio idempotente, acompanhamento e recuperação após timeout.                                          |
| Perfil e carteiras  | Edição do perfil, imagem e senha; carteiras principal/secundária com validação.                                                               |
| Testes e entrega    | E2E desktop/mobile, baselines visuais em 390/768/1440 px e auditoria Lighthouse local. O deploy público precisa receber as alterações locais. |

Os contratos tipados estão em [`src/contracts`](src/contracts). A política de sessão, carrinho, cache, tempo real e limitações está em [`ARCHITECTURE.md`](ARCHITECTURE.md). Existe uma [demonstração pública no Railway](https://kurio-production-8274.up.railway.app/) e o [repositório no GitHub](https://github.com/Cavalcantefilipe/JungleGamingTeste). A versão pública observada ainda usa a interface anterior; esta revisão foi feita localmente e precisa ser publicada. Este checkout está sem remote Git configurado.

## Imagens e regressão visual

As quatro artes originais foram exportadas do Figma com autorização e estão em `assets/figma`. As versões WebP usadas pela aplicação ficam em `public/images/figma`, com fontes e imagens locais. Para regenerá-las:

```bash
node scripts/optimize-images.mjs
```

Os testes de `e2e/08-visual.spec.ts` verificam início, detalhe, carrinho e pagamento, além de overflow no perfil e nas carteiras. As imagens de referência estão em `e2e/__screenshots__` e devem acompanhar a entrega. Elas registram a implementação revisada, não representam uma comparação automática com o arquivo do Figma.

```bash
pnpm exec playwright test e2e/08-visual.spec.ts
# Atualize as referências somente após conferir a mudança visual:
pnpm exec playwright test e2e/08-visual.spec.ts --update-snapshots=all
pnpm exec playwright show-report reports/playwright-report
```

`e2e/07-checkout-resilience.spec.ts` cobre mudanças de preço/estoque via Socket.IO, revisão explícita, mudança de rede, campos inválidos, rascunho após refresh/expiração, clique repetido, timeout e recuperação mesmo quando a reserva esgota a edição. Inclui reconexão de pedido e remoção de favoritos no catálogo filtrado.

O histórico desta revisão e seus limites estão em [`reports/REVIEW.md`](reports/REVIEW.md).
