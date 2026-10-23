# Arquitetura

## Limite da demonstração

O aplicativo implementa um marketplace de NFTs com uma simulação de API no próprio navegador. Não existe backend confiável, banco compartilhado, carteira blockchain ou transferência financeira. A arquitetura demonstra separação de responsabilidades e resiliência; não fornece isolamento contra alguém que controla o navegador. [Segurança](docs/SECURITY-REVIEW.md) registra correções e requisitos para produção.

## Dados e contratos

Componente → hook da feature → TanStack Query → `api.ts` → Axios → handler MSW → função de domínio → store. Contratos Zod validam entrada no mock e resposta no cliente; tipos derivam dos schemas. [CONTRACTS.md](docs/CONTRACTS.md) documenta endpoints e envelopes. Erros HTTP, rede e timeout viram `ApiError`; mensagens da interface ficam centralizadas. Erros de campo focam o primeiro campo e não duplicam o alerta do formulário.

O store mantém estado validado em memória e JSON no localStorage. Cada gravação calcula um próximo estado imutável e persiste antes de publicar a alteração. Transações síncronas tornam atômicas as decisões locais de estoque, reserva, idempotência e alteração de senha. Etapas assíncronas de hash ficam fora do commit, com revalidação no commit. Isso não constitui transação distribuída, multiaba ou garantia de banco. [Medições e consultas](docs/DATA-PERFORMANCE.md).

Dinheiro usa string decimal e big.js; o front exibe estimativas imediatas. Preço, disponibilidade, taxa e cupom são recalculados pelo mock na compra. A cotação tem validade e versão; mudanças exigem revisão explícita. A rede selecionada determina a taxa simulada. O desafio permite carrinho misto; não existe validação de liquidação por rede, ponte ou prova de posse da carteira.

## Inicialização e versões

React 19, Vite 7/ES2022, Router com divisão automática de rotas e Query 5. MSW fica em 2.x porque o binding Socket.IO utilizado não suporta 3.x. Renderer, providers e registro dos mocks carregam em paralelo; React só monta depois do worker. O SDK Socket.IO é importado no efeito após montar, pois Engine.IO captura `globalThis.WebSocket` ao avaliar o módulo. Cleanup e token capturado impedem início de conexão antiga após desmontagem/troca de sessão. [MOCKS.md](docs/MOCKS.md).

Zod é configurado com `jitless: true` antes da validação de ambiente e contratos. Isso evita o probe de avaliação dinâmica bloqueado pela CSP; não exige `unsafe-eval`. Fontes e assets ficam no mesmo origin, com AVIF/WebP responsivo e dimensões explícitas. Devtools não integram os providers de produção; os controles de demonstração estão em `window.__kurio` quando mocks estão habilitados.

O build produz variantes Brotli de HTML/JS/CSS/SVG. O preview Vite negocia `Accept-Encoding` por `sirv`, preserva o conteúdo sem compressão para clientes sem suporte e reconhece arquivos de um novo build. O worker e HTML usam revalidação. Isso reduz bytes transferidos sem remover schemas, mocks, autenticação ou Socket.IO. A hospedagem Vercel usa sua própria compressão e exige verificação após publicação.

A auditoria usa a CLI nativa do Lighthouse 13.5.0, substituindo LHCI e sua cadeia de downloader vulnerável. Reutiliza Chromium instalado e conserva três execuções e as mesmas metas/medianas. Testes Node verificam que falhas ou categorias inválidas não viram aprovação.

## Estado, sessão e cache

- URL: busca, filtros, página, ordenação, tab e `returnTo`; search inválido do catálogo cai em defaults.
- Query: dados do servidor, com chave por usuário/scope em recursos privados. `staleTime` de 30s, até duas tentativas para rede/5xx, backoff de 500ms até 3s. Mutações não repetem automaticamente.
- React: estado efêmero de formulário/diálogo/galeria; RHF e resolver Zod validam formulários.
- LocalStorage: sessão, visitante, mock DB, tentativa de pedido e preferências da demonstração. São dados locais adulteráveis, sem segredo de servidor.

O token aleatório identifica a sessão no mock, que resolve o usuário e verifica expiração/revogação. O guard privado compara também o usuário confirmado por `/auth/session`. As requisições capturam a credencial antes da espera assíncrona, verificam a sessão antes do envio e recusam resposta atrasada de outra sessão. APIs privadas conferem proprietário antes do cache. Troca de conta limpa o Query; callbacks antigos e sockets não escrevem na sessão nova. Tentativas de compra pendentes permanecem por usuário para recuperação após logout; rascunhos visíveis e sessão são removidos. O payload local não é confidencial contra quem controla o navegador. Logout revoga a sessão, e alteração de senha revoga as outras sessões e conexões.

Carrinho de visitante usa UUID próprio; login faz merge uma vez e o scope passa a ser do usuário. Cache e fila de mutações usam esse scope. Quantidade mostra cálculo local imediato enquanto atualização e uma cotação são executadas em paralelo. Falhas revertem e preservam o item; não há cotação redundante ao concluir a mutation. A compra confirma todos os valores no mock.

## Pedido, recuperação e tempo real

Antes do POST, payload normalizado e hash/chave de idempotência são persistidos por usuário. Repetir a mesma chave/corpo recupera o mesmo pedido; corpo diferente retorna conflito. Pedidos pendentes reservam disponibilidade. Confirmação consome estoque e limpa o carrinho; recusa libera reserva e mantém o carrinho. A UI não confirma antes da resposta/evento autoritativo.

Timeout conserva a tentativa ambígua. Reload/retentativa recuperam o pedido com a mesma chave; a existência de tentativa pendente tem prioridade sobre carrinho vazio. Estado local corrompido bloqueia conservadoramente e pede recuperação, sem criar outra chave. Não existe histórico pesquisável para reparar automaticamente um registro irrecuperável. [CONCURRENCY.md](docs/CONCURRENCY.md).

O transporte real de `socket.io-client` usa WebSocket, interceptado por `@mswjs/socket.io-binding`. UUIDs repetidos e versões antigas são descartados; o conjunto de UUIDs tem limite de 500. Eventos privados exigem dono e sessão atual. Reconexão invalida queries relevantes e concilia com REST. Eventos reconciliam listas cujo filtro/ordem/tab pode mudar e consultas iniciais sem cache; detalhes já conhecidos recebem o patch sem novo GET. Pedido pendente consulta a cada 3s; estado terminal encerra polling e preserva o snapshot do recibo. Não há fallback de polling do Socket.IO nem sincronização entre abas.

## UI, acessibilidade e Figma

Os assets foram exportados do Figma com autorização e convertidos para AVIF/WebP; não há substituição procedural das artes. Tokens, gradiente do CTA, dimensões e todos os fluxos foram comparados contra os 15 frames originais exportados. Os ícones funcionais usam Lucide e os vetores exportados documentados. A coluna mobile preserva o deslocamento de 32 px; as áreas de toque continuam com 44 px. [DESIGN-REVIEW.md](docs/DESIGN-REVIEW.md) detalha adaptações de fixtures, grid, autenticação, backdrop, checkout e recibo.

Estados ausentes do desenho usam o mesmo sistema visual: skeleton com espaço reservado, retry, validação, cotação desatualizada, conexão de carteira e recuperação. Perfil e senha têm salvamentos independentes para não exigir senha ao editar nome. Quantidade mantém círculo visível de 24px e alvo de botão 44px; campo mobile 44px amplia o espaçamento. Preço de linha longo reduz fonte para caber sem truncar o valor.

Texto secundário `#CFB28C` sobre card `#241612` tem contraste aproximado de 8,68:1, acima de 4,5:1; o fundo foi preservado. Foco visível, labels, alerts de campo, retorno de foco dos modais, teclado, reduced motion, axe e reflow complementam baselines visuais. Testes automáticos não equivalem a certificação de acessibilidade.

## Entrega e pendências

Headers e rewrite SPA estão em `vercel.json`; o worker não deve ser cacheado. O teste local injeta a CSP e percorre compra/socket sem violações. Headers publicados dependem da implantação. `docs/LIGHTHOUSE.md` conserva as medianas atuais e o histórico de medições; a troca de ferramenta removeu os dois advisories altos, e os audits completo/de produção retornaram zero. GitHub/push e login Vercel ainda dependem do usuário. Não há URL pública validada.
