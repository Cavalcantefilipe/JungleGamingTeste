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

O README também foi corrigido: o reinício completo exige limpar Local storage e Session storage, porque o rascunho do checkout é armazenado por sessão da aba. Limpar apenas Local storage deixava esse rascunho intacto.

A primeira coleta Lighthouse desta revisão cumpriu as metas, mas revelou CLS de 0,1797 no detalhe desktop. O skeleton reservava somente galeria e resumo, omitindo as seções inferiores. Com rede lenta, o rodapé aparecia em `y=721` na tela de 940 px e saltava quando os dados chegavam. O commit `d77c09a` acrescenta placeholders das abas, descrição/metadados e coleção, com os mesmos breakpoints e movimento reduzido. A regressão reproduziu a falha; os testes de carregamento passaram (13 aprovados, uma exclusão por viewport), e uma observação local de layout registrou CLS zero. A coleta Lighthouse pública posterior identifica a medição final, sem substituir o histórico. [Teste local](../reports/screens-completeness/loading-local.txt), [observação local](../reports/screens-completeness/loading-observation.json), [primeira coleta](../reports/screens-completeness/lighthouse-before-loading-fix/summary.json).

## Imagens e abertura inicial

O relato posterior sobre a foto principal da Home levou a uma reprodução controlada de download interrompido: o AVIF falhava e a imagem permanecia quebrada sem tentar o WebP. Foi acrescentada recuperação compartilhada para Home, galeria e cards: formato alternativo da mesma arte, uma nova tentativa limitada, placeholder com dimensões preservadas e retomada quando a conexão, o foco ou a aba voltam. A revisão também reproduziu e corrigiu reaproveitamento de erro ao navegar A→B→A e perda de proporção no zoom.

Os dez casos de `31-image-resilience` tiveram 18 aprovações e duas exclusões por viewport no Chromium. Em Firefox/WebKit, dois casos verificam a preservação de foto saudável ao alternar offline/online e foco; os 18 casos que dependem de abortar recursos via `context.route` são explicitamente excluídos, pois nessas engines o worker impede essa injeção. Esse limite não é contado como recuperação de falha aprovada. [Falhas e resultados](../reports/screens-completeness/image-resilience/).

Não foi reproduzido o desaparecimento de uma imagem saudável durante a simulação de aba oculta/retorno/refetch. Foi reproduzida a falta de recuperação de uma imagem que já havia falhado. A simulação de visibilidade e rede não equivale a suspender fisicamente o computador.

Na abertura, configuração e mocks passam a ser baixados em paralelo, e os componentes da rota atual são antecipados enquanto o worker inicia. Guards, loaders e consultas não são executados por esse preload. A validação de ambiente e o worker continuam obrigatórios antes da montagem; falhas mantêm a ação de recuperação.

O diagnóstico público também separou um atraso de DNS: uma chamada fria gastou 3,07 s na resolução, enquanto as duas seguintes completaram em 0,25/0,23 s. O serviço tinha suspensão automática desativada; configuração de infraestrutura não foi alterada com base nessa amostra. [Tempos DNS/HTTP](../reports/screens-completeness/initial-dns-timing.json). As medições Lighthouse finais são apresentadas separadamente das observações pontuais.

## Digitação da busca

A conferência manual posterior revelou duas falhas no catálogo: o espaço final era removido a cada atualização da URL, impedindo digitar normalmente “Cosmic Bloom”, e consultas substituídas durante a digitação anunciavam `CancelledError` como falha. O commit `9fd3739` preserva o texto em edição na URL, mantendo a normalização no contrato da API, e suprime apenas o anúncio de cancelamentos esperados. Erros reais continuam com feedback.

Os dois cenários falharam em desktop e mobile na publicação anterior: **quatro falhas reproduzidas**. Após a correção, o arquivo de catálogo passou com **16 testes locais**, os quatro testes unitários de parâmetros passaram e a repetição focal terminou com quatro aprovações. [Falha pública](../reports/search-typing/public-red.txt), [E2E local](../reports/search-typing/local-green.txt), [unitários](../reports/search-typing/unit-green.txt), [repetição focal](../reports/search-typing/final-green.txt).

## CSS independente dos relatórios

O commit de documentação `0e9cf53` alterou o CSS porque a autodetecção do Tailwind também examinava relatórios. A correção `11f0820`, na `main` e publicada no Railway, restringe as fontes a `src` e `index.html`, preservando os estilos do bootstrap. O CSS passou de 100.227 para 98.866 bytes. A regressão reproduziu a inclusão de uma classe exclusiva de relatório e confirmou sua exclusão após o ajuste; dez testes visuais passaram antes do commit. [Comparação](../reports/tailwind-source-scope/comparison.json), [regressão](../reports/tailwind-source-scope/green.txt), [visuais](../reports/tailwind-source-scope/visual.txt).

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

A inspeção das capturas públicas identificou mais 16 px de rolagem no cadastro em 320×844, decorrentes da quebra do título. A margem desse título foi reduzida somente abaixo de 360 px, mantendo os controles de toque. O caso reproduziu a falha na publicação anterior e foi acrescentado à matriz de regressão. Favoritos mobile foram reconferidos em tamanho real: o coração está visível e seu alvo mede 44×44 px.

As baselines visuais foram inspecionadas contra as referências antes de atualizar os resultados de Início, Detalhe, Carrinho e Pagamento. A tolerância dos testes não foi ampliada. Resultados locais históricos da etapa de completude, anteriores às correções de startup e busca:

| Verificação                                    | Resultado                                                                        |
| ---------------------------------------------- | -------------------------------------------------------------------------------- |
| `pnpm check`                                   | Tipos, lint e formato aprovados; 126 testes unitários e 6 testes de ferramentas. |
| `pnpm build`                                   | Aprovado.                                                                        |
| Chromium completo, desktop/mobile              | 314 aprovados; 34 exclusões explícitas por viewport, em 3,5 min.                 |
| Novas regressões em Firefox/WebKit (`28`–`30`) | 35 aprovadas; 1 exclusão do cabeçalho desktop no mobile.                         |
| Revisão independente do código                 | Nenhum bloqueador restante após corrigir o caso de avatar.                       |

Os logs de [Chromium](../reports/screens-completeness/chromium.txt) e [Firefox/WebKit](../reports/screens-completeness/compatibility.txt) preservam essa etapa. O [check consolidado](../reports/screens-completeness/check.txt) inclui os deltas `9fd3739`, `4185cbb` e `11f0820`: **138 testes unitários e 17 de ferramentas**, com tipos, lint e formato aprovados; o [build](../reports/code-standards/build.txt) também passou.

Após o ajuste de 320 px, `pnpm check` e build passaram novamente; os 14 testes de autenticação/conta passaram em Chromium e os mesmos 14 em Firefox/WebKit. [Falha reproduzida](../reports/screens-completeness/compact-red.txt), [Chromium](../reports/screens-completeness/compact-local.txt), [compatibilidade](../reports/screens-completeness/compact-compatibility.txt).

### Railway

A rodada inicial confirmou o deployment `98666a1d-43b2-4339-a51a-0b3c4e48f0ce`, commit `6668148cdb30f22657468683657c035cb3de7913`. Os problemas de comportamento acima foram reproduzidos nessa publicação.

As correções principais foram publicadas em `f78805c`, deployment `d33d9e78-af1a-4177-960f-3659afa85f18`. Nessa rodada, a suíte pública terminou com 313 testes aprovados, 34 exclusões por viewport e uma falha: o novo caso de cadastro em 320×844. O [log dessa falha foi preservado](../reports/screens-completeness/public-before-compact-fix.txt).

O ajuste do cadastro está no commit `0063435584c8a0a7a95b4a0cb438ba01f20646a4`, deployment `bf146579-0177-4d75-a003-d235e6099231`, estado `SUCCESS`. As 45 capturas foram refeitas nessa versão: sem overflow horizontal, imagens visíveis quebradas ou exceções de página. As dez capturas de login/cadastro também têm overflow interno e externo zero. [Imagens por tela e largura](../reports/screens-completeness/README.md), [manifesto](../reports/screens-completeness/public-after.json), [deployment capturado e hash do HTML](../reports/screens-completeness/captured-deployment.json).

Verificações HTTP de acesso direto/refresh, healthcheck, headers, compressão, cache, worker e recursos ausentes passaram. [Log](../reports/screens-completeness/deployment-http.txt).

A suíte completa foi repetida na URL pública após o ajuste do cadastro (`0063435`): **314 testes aprovados, 34 exclusões explícitas por viewport, nenhuma falha**, em 7 min. Inclui regressão visual, teclado/axe, sessão/conta, compra/recuperação, Socket.IO, carrosséis, avaliações e os novos casos desta revisão. [Log completo dessa rodada](../reports/screens-completeness/public-chromium-before-loading-fix.txt).

O checkpoint `d77c09af1ef419288ec8d69c80b40121a3f1b8a0`, deployment `db439b2a-b7bb-4264-a1c4-cd251d067c2e`, estado `SUCCESS`, acrescentou a reserva do loading. A observação pública com rede lenta registrou CLS zero: o rodapé permaneceu abaixo do viewport antes/depois. [Captura do loading](../reports/screens-completeness/loading-public/loading.png), [tela carregada](../reports/screens-completeness/loading-public/loaded.png), [medição](../reports/screens-completeness/loading-public/observation.json).

A suíte pública desse checkpoint teve 314 aprovações, 35 exclusões por viewport e uma falha no helper que media o skeleton. O trace mostrou que o elemento foi trocado entre a espera de visibilidade e `boundingBox()`. A medição passou a localizar e ler `getBoundingClientRect()` numa única avaliação, mantendo a tolerância e exigindo dimensões positivas. O arquivo de testes foi reexecutado: 13 aprovações e uma exclusão. A falha foi preservada, sem contar essa rodada como aprovação completa. [Log da falha](../reports/screens-completeness/public-loading-helper-failure.txt), [trace](../reports/screens-completeness/loading-helper-failure/trace.zip), [reteste](../reports/screens-completeness/loading-helper-retest.txt).

O commit `369f9eeed2bac4d3ad2d3127d16b4479117908d3`, deployment `7f10ea98-553d-4c5b-8cbc-9e114bf7b64a`, estado `SUCCESS`, integrou startup, recuperação das imagens e padronização. A suíte completa na URL pública terminou com **333 aprovações e 37 exclusões explícitas, nenhuma falha**, em 12,5 min. [Log público](../reports/screens-completeness/public-chromium.txt), [identificação desse deploy](../reports/screens-completeness/full-suite-deployment.json). Os casos novos de busca foram acrescentados depois dessa rodada; esse total não deve ser atribuído ao delta `9fd3739`, publicado e validado também com 32 E2E na URL pública (16 Chromium e 16 Firefox/WebKit), sem falhas ou exclusões. [Logs da busca](../reports/search-typing/). O ajuste `4185cbb` centraliza a mensagem e corrige o singular de um único resultado no catálogo/favoritos, com três unitários aprovados.

### Conferência manual concluída

Foi criada pela interface a conta fictícia `qa.interface.2410@kurio.test`. Cadastro e seus erros, login/logout, perfil/avatar, carteiras, favoritos, zoom, avaliações, carrinho, cupons e compra simulada foram exercitados. O recibo persistiu após recarregar e o carrinho foi esvaziado após a compra. A busca com duas palavras foi repetida com sucesso após a publicação. [Percurso completo, screenshots e limites](../reports/ui-account-test/README.md).

Leitor de tela VoiceOver e dispositivos físicos não foram revalidados nesta rodada. Os testes de teclado/axe e Firefox/WebKit automatizados não substituem essa avaliação. A aplicação permanece uma demonstração MSW em um navegador, sem certificar operações de blockchain ou concorrência entre dispositivos.

### Última publicação do código

O commit `11f0820ea3b3e6708b58b740ab30326b992aecc5`, deployment `08c4e864-3bd1-4daa-b0ef-d80872f89a64`, foi confirmado como `SUCCESS`. A verificação HTTP passou para navegação SPA, arquivos comprimidos, cache, worker, cabeçalhos e health check. Um novo login pela interface confirmou a persistência dos dados do perfil. A conferência anterior em `4185cbb` confirmou o anúncio “1 NFT encontrado”. [Identificação e hash do HTML](../reports/screens-completeness/deployment.json), [verificação HTTP](../reports/screens-completeness/deployment-http.txt).

### Desempenho final

A coleta pública de `11f0820` concluiu 12 execuções válidas, saída 0: performance 99/99 desktop e 93/92 mobile (Home/detalhe), acessibilidade/boas práticas/SEO 100. CLS mediano do detalhe: zero. LCP mobile continua próximo de 2,8 s. A coleta inteira usou Headless Shell 156.0.8078.4, o mesmo executável da coleta anterior de `4185cbb`. Resultados anteriores, tentativas interrompidas e smokes foram preservados sem entrar nas medianas finais. [Método, resultados e limites](LIGHTHOUSE.md).
