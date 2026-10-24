# Conferência complementar das nove telas — 24/10/2026

Revisão feita após os apontamentos sobre carrosséis e avaliações. A referência visual é o [Figma original](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge); os comportamentos são os do [enunciado](CHALLENGE.md). A análise usou os 15 frames exportados e suas [camadas, textos e medidas](../reports/design/source-manifest.json), leitura do código e novas execuções no Railway. Os relatórios anteriores foram tratados como históricos.

## Falhas encontradas e corrigidas

| Tela/área                 | Problema confirmado                                                                               | Correção                                                                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Catálogo                  | `?page=999` produzia uma grade vazia, sem explicação nem página ativa.                            | API limita a página ao intervalo existente; Router corrige a URL preservando filtros/hash. Sem resultados, há estado vazio recuperável.                                   |
| Busca                     | O campo anunciava busca por criadores, mas pesquisava apenas nome e coleção.                      | Inclui o criador dos metadados, mantendo compatibilidade com dados antigos.                                                                                               |
| Navegação de autenticação | “Entrar” descartava a página/filtros de origem; fechar a modal sempre voltava ao início.          | Retorno preserva a URL pública. Fechar uma autenticação exigida pelo checkout retorna ao carrinho; rotas privadas não geram ciclo de login.                               |
| Abas do catálogo          | As abas não respondiam a setas, Home ou End.                                                      | Foco único, seleção pelo teclado e associação ao painel de resultados.                                                                                                    |
| Cards                     | Nome/preço tinham 14 px em todas as telas.                                                        | Catálogo desktop 16/18 px; mobile e carrosséis 15/16 px, conforme os frames.                                                                                              |
| Conteúdo editorial        | Falha da consulta mantinha skeleton indefinidamente.                                              | Erro contextual e ação para recarregar o conteúdo.                                                                                                                        |
| Diário da Cunhagem        | Títulos, descrições, datas e tempos de leitura divergiam da referência sem necessidade funcional. | Textos originais nas fixtures da API. A leitura integral dos artigos permanece fora do escopo.                                                                            |
| Rodapé                    | Categorias existentes abriam aviso de indisponibilidade.                                          | Links aplicam os filtros reais do catálogo.                                                                                                                               |
| Cadastro                  | A modal excedia a altura em celulares e em desktop de 600 px.                                     | Espaços adaptam-se à altura disponível, preservando campos, ações e alvos de toque.                                                                                       |
| Perfil, carteiras e senha | A confirmação anterior continuava aparecendo após novas edições ou junto de erros.                | Sucesso só aparece quando o formulário corresponde aos valores confirmados, sem erros. O perfil compara apenas os campos editáveis, inclusive após trocar/remover avatar. |
| Pagamento                 | Nome de usuário editado desaparecia após refresh e não seguia no pedido.                          | Rascunho, payload e snapshot preservam o valor revisado.                                                                                                                  |
| Pagamento                 | Faltava “Tem um código promocional? Aplique aqui”.                                                | Atalho leva ao cupom no carrinho e permite voltar ao pagamento com o rascunho preservado.                                                                                 |
| Resumo e recibo           | O ID do token do Figma estava ausente.                                                            | Componente compartilhado; token vem da cotação e fica imutável no recibo. Cor Secondary do frame preservada.                                                              |

Os campos acrescentados aos contratos aceitam a ausência nos dados legados. Pedidos, carrinhos, contas e tentativas anteriores não são apagados. O replay de tentativas antigas preserva chave e hash. [Contratos](CONTRACTS.md).

## Matriz de conferência

| Tela        | Conferência visual                                                              | Comportamentos exercitados                                                                                                          |
| ----------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Início      | Hero, cards, tipografia, filtros, promoções, artigos, rodapé e navegação.       | Busca, criador, filtros combinados, ordenação, paginação/URL/histórico, favoritos, vazio, lentidão, erro e recuperação.             |
| Detalhe     | Galeria, edições, quantidade, metadados, abas, avaliações e carrossel.          | Acesso direto/404, indisponibilidade, favoritos, compra, autoplay/pontos/pausa, avaliações paginadas, eventos durante carregamento. |
| Carrinho    | Identidade dos itens, botões, desconto `(-)`, resumo e carrossel compartilhado. | Quantidade, remoção com “−” ou lixeira, cupom válido/inválido/expirado, refresh, merge no login, alterações de preço/estoque.       |
| Pagamento   | Campos, carteiras/provedores, resumo, token, cupom e ações por viewport.        | Rascunho, validação/foco, carteira/rede, conexão/recusa/desconexão, nova cotação, preço/estoque alterados, idempotência e timeout.  |
| Confirmação | Selo, metadados, tabela, IDs, taxa/total, fechamento e adaptação mobile.        | Só pedido confirmado abre recibo; pendência/recusa/retomada, snapshot imutável e compatibilidade de pedidos antigos.                |
| Login       | Campos, tabs, redes sociais, fechamento e altura disponível.                    | Validação, foco/teclado, login, sessão, retorno ao fluxo, expiração e troca de usuário.                                             |
| Cadastro    | Campos, botões, espaços e acesso à última ação.                                 | Validação, confirmação de senha, conflito de conta e acesso aos erros em telas baixas.                                              |
| Perfil      | Campos, avatar, ações e navegação da conta.                                     | Salvar/recarregar, upload/remoção de avatar, senha, erros da API e confirmação coerente com dados salvos.                           |
| Carteiras   | Principal/secundária, campos, checkbox e navegação.                             | Salvar/recarregar, validação de endereço/rede, equivalência à principal e atualização durante compra.                               |

## Dimensões e adaptações explícitas

- Capturas completas das nove telas em 1440, 768, 414, 390 e 320 px: 45 estados por rodada. As imagens aguardam as consultas, fontes e recursos; contextos de navegador são isolados.
- Autenticação também verificada em 1366×768, 1280×600, 768×600 e 360×740. Em altura de 450 px ou com conteúdo de erro maior que a tela, a página externa permite rolagem para manter todos os campos acessíveis; não se esconde conteúdo para eliminar a barra.
- O Figma tem nove frames desktop e seis mobile. Perfil, carteiras e recibo mobile são adaptações; não existe um frame equivalente para alegar igualdade visual.
- Quantidades, nomes de conta, IDs, contagens de filtros e valores vêm da simulação. Totais são calculados pela API; exemplos inconsistentes do desenho não são copiados como cálculo.
- Alvos de toque, foco, mensagens de erro, revisão da cotação e controles de pausa acrescentam espaço quando necessário. Os carrosséis respeitam movimento reduzido.
- Páginas editoriais completas, suporte, atividade, ofertas, downloads, login social e integrações reais de carteira/blockchain continuam fora do escopo indicado pelo enunciado. A interface informa indisponibilidade nas ações correspondentes.

## Evidências e validação

As regressões novas estão em `28-home-completeness`, `29-account-completeness` e `30-checkout-completeness`. Foram observadas falhas antes das correções. A revisão independente encontrou ainda a comparação indevida de avatar no formulário de perfil; o caso foi reproduzido e corrigido antes da integração final.

As baselines visuais foram inspecionadas contra as referências antes de atualizar os resultados de Início, Detalhe, Carrinho e Pagamento. A tolerância dos testes não foi ampliada. Resultados locais do build corrigido:

| Verificação                                    | Resultado                                                                        |
| ---------------------------------------------- | -------------------------------------------------------------------------------- |
| `pnpm check`                                   | Tipos, lint e formato aprovados; 126 testes unitários e 6 testes de ferramentas. |
| `pnpm build`                                   | Aprovado.                                                                        |
| Chromium completo, desktop/mobile              | 314 aprovados; 34 exclusões explícitas por viewport, em 3,5 min.                 |
| Novas regressões em Firefox/WebKit (`28`–`30`) | 35 aprovadas; 1 exclusão do cabeçalho desktop no mobile.                         |
| Revisão independente do código                 | Nenhum bloqueador restante após corrigir o caso de avatar.                       |

[Check](../reports/screens-completeness/check.txt), [Chromium](../reports/screens-completeness/chromium.txt), [Firefox/WebKit](../reports/screens-completeness/compatibility.txt).

### Railway

A rodada inicial confirmou o deployment `98666a1d-43b2-4339-a51a-0b3c4e48f0ce`, commit `6668148cdb30f22657468683657c035cb3de7913`. As 45 capturas não apresentaram overflow horizontal, imagens visíveis quebradas ou exceções de página. Os problemas de comportamento acima foram reproduzidos nessa publicação. A nova publicação será identificada após a verificação dos fluxos corrigidos.

Leitor de tela VoiceOver e dispositivos físicos não foram revalidados nesta rodada. Os testes de teclado/axe e Firefox/WebKit automatizados não substituem essa avaliação. A aplicação permanece uma demonstração MSW em um navegador, sem certificar operações de blockchain ou concorrência entre dispositivos.
