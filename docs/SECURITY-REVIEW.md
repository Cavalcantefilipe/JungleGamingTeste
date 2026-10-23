# Revisão de segurança e regras de negócio

Data: **23/10/2026**. Escopo: branch `feat/kurio-execucao`, código da aplicação e testes locais. Referências: [OWASP Top 10:2025](https://top10.owasp.org/2025/0x00_2025-Introduction/) e [API1:2023 — BOLA](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/). Nenhum ativo externo foi atacado.

## Conclusão e limite principal

Os testes exercitam controles de autorização, isolamento de sessão e regras de compra **na simulação**. O projeto não possui servidor de aplicação ou banco remoto: MSW, tokens, contas, hashes de senha e pedidos vivem no navegador/localStorage. Quem controla esse navegador pode alterar a própria simulação. Portanto, **esta entrega não constitui um backend seguro para dinheiro, carteiras ou dados reais**, mesmo que o site seja publicado. `window.__kurio` é um controle de demonstração, não uma API administrativa protegida.

Não foi comprovado acesso entre usuários pela API nos casos de BOLA/IDOR testados, nem execução de XSS no texto de perfil testado. Isso não é prova de ausência de outras vulnerabilidades. A atualização da ferramenta de auditoria removeu os dois alertas altos de desenvolvimento; a consulta atual retornou zero alertas. Os limites para produção continuam descritos abaixo.

## Problemas encontrados e corrigidos nesta revisão

Todos os casos funcionais abaixo tiveram falha reproduzida antes da correção. As proteções complementares dos hooks foram ampliadas ao seguir os mesmos fluxos.

| ID  | O que existia                                                                                                                        | Correção e evidência                                                                                                                                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S01 | O interceptor lia a sessão quando executava; uma operação criada na sessão de Ana podia sair com o token de Bruno após troca rápida. | Credencial capturada antes da passagem assíncrona e conferida antes do envio. Teste `request-identity.test.ts` impede o token novo na operação antiga.                                                                                                        |
| S02 | Respostas HTTP de sucesso atrasadas não eram recusadas globalmente após trocar de conta; só alguns callbacks tinham proteção.        | HTTP rejeita resposta cujo token mudou; `apiRequest` também confere identidade. Queries privadas declaram o usuário esperado; respostas de perfil, pedido e carrinho conferem proprietário antes do cache. `http.test.ts` reproduz resposta privada atrasada. |
| S03 | O guard aguardava `/auth/session`, mas ignorava o usuário confirmado. Um token de Ana com identidade local de Bruno liberava a rota. | Compara identidade confirmada com a identidade local, limpa a sessão inconsistente e retorna ao login. Teste unitário e E2E em desktop/mobile.                                                                                                                |
| S04 | Um token existente era aceito no header sem o esquema `Bearer`.                                                                      | Parser exige `Bearer` e uma única credencial. Teste REST espera 401. Isso era permissividade de formato, não descoberta de acesso com token desconhecido.                                                                                                     |
| S05 | Data de expiração inválida resultava em `NaN`, passando pela comparação de expiração.                                                | Data precisa ser finita e futura. Mesma regra nas verificações de commit e socket. Teste REST cobre leituras privadas. Pré-condição do caso reproduzido: estado local inconsistente.                                                                          |
| S06 | Trocar senha mantinha outras sessões e conexões da mesma conta ativas.                                                               | Transação revoga outros tokens/conexões e preserva a sessão que realizou a troca. Teste confirma 401 para o token anterior e 200 para o atual.                                                                                                                |
| S07 | O contrato do recibo aceitava qualquer string como `explorerUrl`.                                                                    | Allowlist de URL HTTPS exata do Etherscan com referência de 64 dígitos hexadecimais, além do marcador interno `pending`. Contrato rejeita outros esquemas/domínios. É endurecimento de contrato; não foi comprovada execução de JavaScript via React.         |
| S08 | Base64 malformado de avatar lançava exceção de `atob` e respondia 500.                                                               | Retorna 422 `INVALID_IMAGE`, mantém o avatar anterior e evita erro interno esperado. SVG/HTML continuam fora dos formatos aceitos.                                                                                                                            |
| P01 | Cotações expiradas acumulavam no armazenamento; criação lia/copiava o store antes de outra gravação integral.                        | Limpeza por validade e cálculo/gravação na mesma transação. Cotações ainda válidas são preservadas. Teste com mil expiradas e medição em [DATA-PERFORMANCE.md](DATA-PERFORMANCE.md).                                                                          |

Também foram acrescentados guards antes das mutações de perfil, senha, favoritos e carrinho. Eles conferem o token capturado pelo hook, inclusive após uma operação aguardar na fila. Logout atrasado não limpa uma sessão nova. A repetição de pedido confere o dono do pedido recuperado por idempotência.

### S09 — compatibilidade com a CSP de produção

O teste de navegação com os headers reais de `vercel.json` encontrou duas violações de `script-src` causadas pela detecção de suporte a avaliação dinâmica do Zod. A configuração `jitless: true` agora precede a validação de ambiente e os contratos, inclusive após divisão de chunks. Não foi adicionado `unsafe-eval`. O E2E percorre catálogo, Socket.IO, carteira e compra até o recibo sem violações, em desktop e mobile. Era uma incompatibilidade detectada pela política; não foi demonstrada exploração de XSS.

## BOLA/IDOR e vínculo token → usuário

- O mock resolve `Authorization → sessão ativa → conta`. IDs enviados no corpo, query string ou URL não determinam o usuário autenticado.
- Perfil, carteiras e favoritos usam o usuário da sessão. `PATCH /profile` descarta campos extras como `id`, `userId`, `role`, `isAdmin` e `avatarUrl`.
- `GET /orders/:id` verifica o dono e devolve 403 para outro usuário. A repetição por chave também é vinculada a `userId` e hash do corpo.
- Alterar o ID de item do carrinho de outra conta não permite atualizá-lo ou removê-lo. O carrinho consultado continua sendo o da sessão atual.
- Conectar a carteira de outro usuário é recusado com 403. A compra revalida carteira salva, provedor, rede informada, conexão e sessão no commit.
- Token inválido, revogado ou expirado não vira acesso de visitante, mesmo com `X-Guest-Id`.
- Cache privado inclui usuário/scope; troca de sessão limpa o Query. Socket exige sessão atual e pedido do usuário atual. O teste de isolamento troca Ana → Bruno sem reiniciar o runtime e entrega evento privado de Ana.

O carrinho de visitante usa um identificador aleatório como capacidade de acesso; não contém perfil, token de conta ou dados de pagamento. Em um servidor real esse identificador precisaria de política de sessão e integridade própria. Saber um ID nunca deve substituir autorização em recursos de conta.

## XSS, entrada e navegação

Texto de perfil e busca é renderizado pelo React como texto. A busca estática não encontrou `dangerouslySetInnerHTML`, `innerHTML`, `eval` ou `document.write` no código da aplicação. O E2E salva uma entrada com markup/event handler, verifica que aparece literalmente no menu, que não existe atributo `onerror` e que não executa após recarregar. Isso cobre esse caminho de XSS armazenado, sem alegar cobertura universal.

Avatares aceitam PNG/JPEG/WebP com tamanho e assinatura de arquivo verificados. O cliente decodifica e normaliza a imagem; o mock valida novamente MIME, base64, tamanho e assinatura. Links de recibo são restritos; links externos usam `noopener noreferrer`. `returnTo` só aceita caminho local, sem `//`, barras invertidas ou caracteres de controle.

## Regras de compra verificadas

| Regra                                           | Resultado                                                                                       |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Quantidade inteira de 1 a 99 e edição existente | Contrato e cálculo do mock rejeitam entrada inválida.                                           |
| Preços, desconto e taxa enviados pelo cliente   | Não substituem o cálculo autoritativo do pedido. Valores usam strings decimais/big.js.          |
| Mesmo item/edição repetido no corpo             | Rejeitado; não soma linhas para contornar estoque.                                              |
| Cupom inválido/expirado                         | Rejeitado no mock. Um cupom por cotação; a política do desafio não define uso único por pessoa. |
| Cotação antiga, vencida ou diferente            | Compra bloqueada, com revisão explícita de valores.                                             |
| Mesma chave e mesmo corpo                       | Um pedido; corpo diferente com a mesma chave retorna conflito.                                  |
| Concorrência de estoque                         | Pendentes reservam estoque; criação e confirmação verificam disponibilidade.                    |
| Timeout e resposta atrasada                     | Conserva chave/payload para recuperar o mesmo pedido; não confirma otimisticamente.             |
| Falha de persistência                           | Não confirma alteração apenas em memória; erro permite tentar novamente.                        |
| Recusa                                          | Preserva carrinho e libera reserva.                                                             |
| Recibo                                          | Snapshot do pedido confirmado; alterações futuras do catálogo não alteram a compra.             |

Redes/carteiras são simulações: não existe assinatura de posse, liquidação, ponte entre redes ou transferência blockchain. A rede selecionada define a taxa simulada; o mock não exige que todos os NFTs do carrinho pertençam à rede da carteira. Essa política permite o carrinho misto previsto nos fixtures e **não deve ser reutilizada para transações reais**. Uma implementação real deve definir e validar compra por rede e moeda, ou uma ponte autorizada, antes de habilitar checkout financeiro.

## Cobertura do OWASP Top 10:2025

| Categoria                  | Estado observado                                                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| A01 Controle de acesso     | Testes de dono/token, corpo adulterado, sessão revogada, cache e socket. Sem servidor para testar SSRF.                                               |
| A02 Configuração           | Headers CSP, anti-iframe, nosniff, HSTS, referrer e permissions preparados em `vercel.json`; presença em produção ainda depende do deploy.            |
| A03 Cadeia de dependências | Lighthouse atualizado para 13.5.0; cadeia de `extract-zip` removida. Audit completo e de produção retornaram zero alertas.                            |
| A04 Criptografia           | Tokens aleatórios de 32 bytes; senhas do mock com PBKDF2/salt. LocalStorage não é cofre; produção exige gestão de credenciais independente e TLS.     |
| A05 Injeção                | Caminho de XSS testado, contratos Zod e URLs restritas. Não existem SQL, shell ou templates de servidor nesta aplicação.                              |
| A06 Design                 | Autoridade de preço no mock, transações, idempotência, reservas e recuperação testadas. Não há garantia distribuída entre abas/processos.             |
| A07 Autenticação           | Expiração/revogação, limite de login e senha atual verificados. O mock não fornece autenticação resistente a adulteração do navegador.                |
| A08 Integridade            | Zod, versão de evento e snapshot reduzem inconsistências. Estado de backend no cliente continua adulterável por quem controla o cliente.              |
| A09 Logs e alertas         | Erros tratados na UI; não há trilha de auditoria central ou monitoramento de incidentes. Requisito de produção pendente.                              |
| A10 Exceções               | Entrada inválida, storage cheio/corrompido, timeout e respostas fora de ordem cobertos. Corrigida a exceção de avatar e expiração que falhava aberta. |

## Dependências: dois alertas altos resolvidos

`pnpm audit --json` e `pnpm audit --prod --json`: **zero alertas em todas as severidades**, consulta de 23/10/2026. `pnpm peers check` também passou.

A origem era `@lhci/cli` 0.15.1, que conservava Lighthouse 12.6.1 e uma cadeia de downloader com `extract-zip` 2.0.1. A ferramenta foi substituída pela CLI nativa do **Lighthouse 13.5.0**; `puppeteer-core` é fixado em 25.9.0, base da faixa declarada pela ferramenta, após erro intermitente de cleanup com 25.16.0 e `pnpm why extract-zip` não encontra o pacote. Não foi necessário baixar ZIP pelo Puppeteer: a coleta reutiliza o Chromium instalado pelo Playwright ou `CHROME_PATH`.

Os antigos overrides de `tmp`, `uuid` e `basic-ftp` saíram porque seus pacotes já não integram a árvore. O override de `@opentelemetry/api` 1.9.0 atende aos peers declarados da ferramenta. Nenhum advisory foi ignorado, nenhum limite foi reduzido e nenhuma versão inexistente foi declarada.

Os dois advisories históricos estão preservados como resolvidos em [dependencies.json](../reports/security/dependencies.json), junto ao hash do lockfile. Respostas completas: [audit completo](../reports/security/audit-full.json) e [audit de produção](../reports/security/audit-production.json). Zero avisos nessa base de advisories não prova ausência de outras vulnerabilidades.

## Revalidação após performance e Figma

A suíte posterior passou com **109 unitários + 6 testes Node e 210 E2E/10 skips explícitos**, incluindo BOLA/IDOR, XSS, sessão, CSP, concorrência e intenção da carteira. Build válido. São evidências locais do executor; não correspondem a outra auditoria independente nem a garantias de servidor/banco. [Testes](TESTING.md) e [Lighthouse](LIGHTHOUSE.md).

## Verificação histórica da revisão de segurança

- `pnpm check`: **106 testes unitários passaram**, TypeScript, lint sem erros e formatação válidos. Warnings de tamanho de função herdados continuam registrados no ledger.
- `pnpm build`: passou.
- Testes novos de segurança no navegador: **4/4**, desktop e mobile.
- Suíte completa: **203 passaram, 9 skips deliberados por viewport**, desktop e mobile.
- Testes relevantes: `src/lib/{http,request-identity}.test.ts`, `src/features/auth/route-guard.test.ts`, `src/mocks/handlers/{handlers,security}.test.ts`, `src/contracts/security.test.ts`, `src/mocks/shared/{concurrency,auth-concurrency,timing,storeQuote}.test.ts`, `e2e/{07-payment-failures,08-account,10-realtime-resilience,16-security}.spec.ts`.

## Erros anteriores já corrigidos durante a execução

| Falha reproduzida                                                                                             | Correção registrada                                                                                    |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Pedidos/chaves/estoque podiam depender de gravações separadas e senha/login concorrentes exigiam revalidação. | Transação síncrona com persistência obrigatória, reservas e comparação de senha no commit (`dfcfd31`). |
| Carrinho fazia chamada redundante de cotação ao mudar quantidade.                                             | Atualização e cotação em paralelo, uma consulta e estimativa rápida não autorizativa (`9754651`).      |
| Confirmação esvaziava carrinho antes da resposta atrasada e escondia recuperação.                             | Recuperação precede estado vazio e conserva tentativa/chave (`ea620c2`).                               |
| Hash da tentativa era calculado antes da normalização do contrato.                                            | Normaliza antes de calcular/persistir/repetir (`ea620c2`).                                             |
| Erro de preço duplicava aviso e impedia nova tentativa válida.                                                | Libera somente tentativa definitivamente rejeitada, mantém a ambígua (`ea620c2`).                      |
| JSON de tentativa corrompido expunha erro padrão do Router.                                                   | Mensagem própria e bloqueio conservador; uma chave possivelmente aceita não é descartada (`ea620c2`).  |
| Galeria deslocava cerca de 50px após carregamento.                                                            | Skeleton reserva navegação e proporções da galeria (`08848e3`).                                        |

## Revisão final independente e regressões adicionais

A revisão da branch e365f97 identificou três problemas importantes; um quarto caso inicialmente sem reprodução foi elevado a importante após um teste demonstrar a perda do evento.

| ID  | Erro anterior                                                                                             | Correção e evidência                                                                                                                                                                                        |
| --- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R01 | Logout apagava todas as tentativas pendentes, incluindo referência necessária após timeout de compra.     | Preserva tentativa por usuário; limpa sessão, cache e rascunhos visíveis. E2E timeout → logout → Bruno sem compra de Ana → Ana recupera o mesmo pedido/chave.                                               |
| R02 | Evento de preço alterava a linha, mas deixava NFT fora do filtro ou na posição/página errada.             | Reconcilia listas quando preço afeta filtro/ordem ou badge afeta tab. Testes usam QueryObserver ativo e resultado canônico de filtro, total e composição da página. Detalhe existente continua sem refetch. |
| R03 | Cenário desconhecido ou falha no worker deixava carregamento permanente.                                  | Cenário inválido usa default. Falhas de bootstrap mostram alerta e botão de tentar novamente, sem HTML de entrada ou stack na tela. E2E rejeita registro do worker uma vez e recupera pelo botão.           |
| R04 | Evento antes do primeiro REST não encontrava cache; resposta antiga ainda podia publicar versão anterior. | Cancela consulta inicial afetada e reconcilia. Teste com primeira resposta adiada falhou com versão 1/preço antigo e passou com versão 2/preço novo.                                                        |

Tentativas preservadas contêm o payload necessário para repetir a mesma chave. São lidas pela UI somente para o usuário autenticado correspondente; o teste cobre a troca para Bruno. **Ainda ficam no localStorage**, assim como o banco inteiro do mock. Logout não transforma esse armazenamento em cofre nem garante confidencialidade contra outra pessoa com acesso ao navegador. Em produção, referências mínimas e recuperação autenticada precisam residir no backend.

Os nove testes focados novos (três unitários e seis E2E, desktop/mobile) falharam antes e passaram após as correções. A rodada completa final é registrada em [TESTING.md](TESTING.md). [FINAL-REVIEW.md](FINAL-REVIEW.md) registra decisões e limites da revisão.

## Atualização R05 — vínculo com endereço revisado

A revisão posterior solicitada pelo usuário reproduziu criação de pedido para um endereço alterado da própria carteira depois de reconectá-la. O ID/rede/provedor eram insuficientes para preservar a intenção revisada. Conexão e pedido agora validam o endereço; o cliente confere a resposta, atualiza as carteiras e exige nova revisão. E2E exercita edições autenticadas durante conexão e criação, preservando carrinho/rascunho, em desktop/mobile. Tentativas antigas já aceitas continuam recuperáveis; compras novas sem endereço são recusadas. Não foi demonstrado acesso à carteira de outro usuário. [BEHAVIOR-REVIEW.md](BEHAVIOR-REVIEW.md) contém os testes e o estado dos gates desta atualização.

## Requisitos de produção

Backend independente com autorização por objeto em toda operação; persistência transacional compartilhada com índices/restrições; política de sessão e cookies seguros/CSRF conforme arquitetura; verificação real de posse da carteira; regras por rede/moeda; rate limiting no servidor; logs sem segredos e alertas; revisão da cadeia de dependências; validação dos headers e testes contra o deploy real. Nenhuma dessas garantias pode ser criada apenas com validações no front.
