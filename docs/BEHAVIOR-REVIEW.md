# Validação dos comportamentos

23/10/2026. Revisão local solicitada após a entrega dos relatórios. Referência de comportamento: [enunciado](CHALLENGE.md), seções 3–9. A análise anterior de código foi complementada com regressões e execução da interface pelo Playwright.

## Resultado por fluxo

| Fluxo                   | Evidência e resultado esperado                                                                                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Catálogo e detalhe      | Busca/filtros/ordem/página na URL, histórico/refresh, resposta antiga descartada, vazio/404/erro e estoque limitando quantidade (`01`, `02`).                                      |
| Cadastro e sessão       | Validação/conflito, login/retorno, expiração, logout/troca de conta e carrinho de visitante. Novo teste cria conta, preserva o carrinho e faz logout/login da conta criada (`03`). |
| Favoritos               | Persistência por usuário, atualização otimista e rollback de falhas simultâneas (`04`).                                                                                            |
| Carrinho                | Inclusão/quantidade/remoção, cupom, merge, preço/estoque por socket e estimativa decimal antes da rede (`05`).                                                                     |
| Compra                  | Revisão explícita, validação de campos, carteira recusada/desconectada, cotação/preço/estoque/expiração e retorno do cadastro de carteira (`06`).                                  |
| Pagamento e recuperação | Recusa mantém itens; cliques repetidos e timeout recuperam o mesmo pedido; recibo só após confirmação e mantém snapshot (`07`, `10`, `19`).                                        |
| Conta                   | Perfil, avatar, senha, carteiras, persistência e fila antiga impedida de atingir outra conta (`08`).                                                                               |
| Tempo real              | Transporte Socket.IO, duplicatas/versões antigas, reconexão, filtros/páginas e primeira resposta REST concorrente (`09`, `10` e unitários de reconciliação).                       |
| Erros e acessibilidade  | Skeleton/erro/retry, falha de inicialização, teclado/foco, axe/reflow e CSP no fluxo de compra (`11`, `12`, `17`–`19`).                                                            |
| Identidade da carteira  | Edição durante conexão e criação do pedido bloqueia compra, preserva carrinho/rascunho e exige nova revisão (`20`).                                                                |

Os números acima identificam arquivos em `e2e/`. Os testes conferem interface e operações da simulação; não certificam todos os comportamentos possíveis.

## R05 — endereço revisado diferente do endereço comprado

A revisão anterior deixou essa hipótese aberta. Agora um teste de domínio reproduziu a falha: editar a própria carteira e reconectá-la, mantendo ID/provedor/rede, permitia criar um pedido para o novo endereço usando a intenção antiga. O teste falhou com a validação anterior e passou com a correção. Não foi demonstrado acesso à carteira de outro usuário.

Conexão e pedido agora incluem o endereço revisado. O mock verifica ID/dono, endereço, rede, provedor, sessão e conexão. O cliente também compara o endereço retornado. Divergências em carteira própria retornam `409 WALLET_CHANGED`; carteira de outra conta continua proibida. Uma troca invalida a revisão e atualiza as carteiras na interface, sem adicionar chamada ao caminho de sucesso.

O E2E edita a carteira por uma requisição autenticada à própria API enquanto a requisição do checkout está pendente. Ele espera o registro do temporizador de latência antes da edição, sem espera fixa: observar apenas o início do request não garantia que o MSW já tivesse capturado a latência. As duas janelas são testadas em desktop/mobile. Isso exercita concorrência local de operações legítimas, sem alegar sincronização entre abas, ausente nesta demonstração.

Depois do erro, a interface mostra o novo endereço, conserva a observação digitada e bloqueia confirmação. Revisar e conectar novamente permite criar somente um pedido para o novo endereço, sem precisar recarregar a página.

### Compatibilidade de recuperação

O campo de endereço é opcional no parser do pedido para ler tentativas antigas. **Uma compra nova sem endereço é recusada no commit.** Uma chave/corpo antigos já aceitos recuperam o pedido existente antes dessa validação, com autorização e hash preservados. Não é atribuído silenciosamente o endereço atual a uma intenção antiga. Três unitários cobrem endereço alterado mesmo após reconectar, omissão do endereço em pedido novo e replay de pedido antigo.

## Verificação desta atualização

- Tipos, lint sem erros, formatação e **109 unitários em 28 arquivos** passaram.
- Build passou; quatro E2E novos de carteira passaram em desktop/mobile.
- Suíte completa: **209 aprovados e 9 skips explícitos por viewport**, em 4,2 minutos. Os seis E2E acrescentados (quatro de carteira e dois de cadastro) estão incluídos nessa contagem.
- A primeira rodada teve 208 aprovados e uma falha do novo teste de cadastro mobile: ele buscava o menu da conta no carrinho, onde o header é oculto por composição. O teste agora navega ao próprio perfil antes de fazer logout. A verificação focada passou nos dois projetos, seguida da rodada completa acima; nenhuma mudança de UI ou espera fixa foi usada para acomodá-lo.

## Limites restantes

Não há backend/banco compartilhado nem pagamento real. Publicação e validação da URL pública estão pendentes. A medição histórica do commit `52bdb86` (mobile 89/88) foi substituída pela revisão posterior de performance; consulte [Lighthouse](LIGHTHOUSE.md) para o resultado vigente. Comparações visuais usam medidas do Figma e baselines da implementação com tolerância de 1%, sem garantia de igualdade absoluta. [Estimativa de avaliação](DELIVERY-ASSESSMENT.md).

## Revalidação após os ajustes de performance/Figma

A rodada completa posterior passou com **210 E2E/10 skips explícitos**, incluindo todos os casos de segurança, recuperação, concorrência e intenção da carteira. Os 109 unitários e seis testes Node de ferramentas passaram em `pnpm check`. Nenhuma regra de token, dono, preço ou confirmação foi retirada para melhorar desempenho. [Testes](TESTING.md) e [conferência visual](DESIGN-REVIEW.md).
