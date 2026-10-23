# Revisão de segurança e regras de negócio

Data: **23/10/2026**. Escopo: branch `feat/kurio-execucao`, código da aplicação e testes locais. Referências: [OWASP Top 10:2025](https://top10.owasp.org/2025/0x00_2025-Introduction/) e [API1:2023 — BOLA](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/). Nenhum ativo externo foi atacado.

## Conclusão e limite principal

Os testes exercitam controles de autorização, isolamento de sessão e regras de compra **na simulação**. O projeto não possui servidor de aplicação ou banco remoto: MSW, tokens, contas, hashes de senha e pedidos vivem no navegador/localStorage. Quem controla esse navegador pode alterar a própria simulação. Portanto, **esta entrega não constitui um backend seguro para dinheiro, carteiras ou dados reais**, mesmo que o site seja publicado. `window.__kurio` é um controle de demonstração, não uma API administrativa protegida.

Não foi comprovado acesso entre usuários pela API nos casos de BOLA/IDOR testados, nem execução de XSS no texto de perfil testado. Isso não é prova de ausência de outras vulnerabilidades. Os dois alertas de dependência ainda existentes e os requisitos para produção estão descritos abaixo.

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
| A03 Cadeia de dependências | Lockfile e auditoria realizados. Overrides corrigem `tmp`, `uuid` e `basic-ftp`; dois alertas de `extract-zip` continuam explícitos.                  |
| A04 Criptografia           | Tokens aleatórios de 32 bytes; senhas do mock com PBKDF2/salt. LocalStorage não é cofre; produção exige gestão de credenciais independente e TLS.     |
| A05 Injeção                | Caminho de XSS testado, contratos Zod e URLs restritas. Não existem SQL, shell ou templates de servidor nesta aplicação.                              |
| A06 Design                 | Autoridade de preço no mock, transações, idempotência, reservas e recuperação testadas. Não há garantia distribuída entre abas/processos.             |
| A07 Autenticação           | Expiração/revogação, limite de login e senha atual verificados. O mock não fornece autenticação resistente a adulteração do navegador.                |
| A08 Integridade            | Zod, versão de evento e snapshot reduzem inconsistências. Estado de backend no cliente continua adulterável por quem controla o cliente.              |
| A09 Logs e alertas         | Erros tratados na UI; não há trilha de auditoria central ou monitoramento de incidentes. Requisito de produção pendente.                              |
| A10 Exceções               | Entrada inválida, storage cheio/corrompido, timeout e respostas fora de ordem cobertos. Corrigida a exceção de avatar e expiração que falhava aberta. |

## Dependências: resultado honesto

`pnpm audit --prod --json`: **zero alertas** na consulta desta revisão.

A auditoria completa começou com seis advisories (quatro altos, um moderado e um baixo). Atualizações transitivas verificadas no lockfile corrigiram quatro advisories: `tmp` 0.2.7, `uuid` 11.1.1 e `basic-ftp` 6.2.3. `lhci --version`, build e testes verificam compatibilidade inicial; a execução completa do Lighthouse permanece na etapa de performance do plano.

Restam **dois advisories altos** em `extract-zip` 2.0.1, trazido pelo downloader de navegador do Lighthouse/Puppeteer. O npm consultado ainda publica 2.0.1 como última versão, embora os advisories indiquem correção em 2.0.2. A tentativa de instalar essa versão retornou `NO_MATCHING_VERSION`; nenhum alerta foi ocultado e nenhuma versão foi falsificada. Essa biblioteca não integra o bundle do aplicativo nem recebe uploads da aplicação. Os testes usam Chrome já instalado; não forneça ZIPs não confiáveis ao downloader. A auditoria completa continua com saída não zero até resolução dessa dependência.

Referências e resumo verificável: [dependencies.json](../reports/security/dependencies.json). Os links dos dois advisories estão nesse arquivo. Essa condição deve ser revista antes de executar downloads de navegador em CI e antes de aprovar a cadeia de build para produção.

## Verificação

- `pnpm check`: **103 testes unitários passaram**, TypeScript, lint sem erros e formatação válidos. Warnings de tamanho de função herdados continuam registrados no ledger.
- `pnpm build`: passou.
- Testes novos de segurança no navegador: **4/4**, desktop e mobile.
- Suíte completa: **164 passaram, 4 skips deliberados por viewport**, desktop e mobile.
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

## O que ainda é necessário para produção

Backend independente com autorização por objeto em toda operação; persistência transacional compartilhada com índices/restrições; política de sessão e cookies seguros/CSRF conforme arquitetura; verificação real de posse da carteira; regras por rede/moeda; rate limiting no servidor; logs sem segredos e alertas; revisão da cadeia de dependências; validação dos headers e testes contra o deploy real. Nenhuma dessas garantias pode ser criada apenas com validações no front.
