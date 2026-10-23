# Conferência do Figma

> Registro de uma etapa anterior. A [revisão tela por tela](SCREEN-REVIEW.md) documenta as correções posteriores e a nova conferência; medidas conflitantes deste registro foram substituídas.
> Fonte: [Frontend Challenge](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge). Inspeção direta em 22–23/10/2026, painel Properties, canvas e exportação dos 15 frames desktop/mobile.

## Medidas verificadas

| Elemento         | Desktop                               | Mobile                                  |
| ---------------- | ------------------------------------- | --------------------------------------- |
| Frame            | 1440 px                               | 414 px                                  |
| Margens laterais | 120 px                                | 24 px                                   |
| Topo             | 24 px                                 | 40 px na Home                           |
| Header           | 45 px; logo 14 px/700, tracking 10%   | oculto na Home e no detalhe             |
| Hero             | 1200 × 450 px; padding esquerdo 40 px | 366 × 190 px; padding 16 px; raio 12 px |
| Título do hero   | 43 px / 70 px, duas linhas            | 18 px / 29 px, texto compacto           |
| Imagem do hero   | 450 × 450 px; raio 24 px              | imagem principal e miniatura sobreposta |
| Detalhe          | galeria + resumo em duas colunas      | imagem, painel sobreposto, título 20 px |
| Navegação mobile | —                                     | cinco ícones e ação central elevada     |

A revisão de 23/10 substituiu a normalização prevista no plano: a grade mobile agora preserva o desnível de 32 px da coluna direita do Figma. Skeleton e conteúdo compartilham essa geometria. Áreas de toque continuam com pelo menos 44 px, mesmo onde o desenho apresenta controles menores.

## Assets originais

Download autorizado pelo usuário em 22/10/2026: “Não se esqueça de pegar os assets”. Os arquivos foram obtidos pelo botão de download da imagem no painel Properties, preservando a imagem original sem fotografar o canvas.

| Nome    | Hash da imagem Figma                       | Uso                                     |
| ------- | ------------------------------------------ | --------------------------------------- |
| Emerald | `8459204731e6eba9d474cbc8ebc37071360d3ba5` | hero, primeiro NFT, promoção e artigo   |
| Sage    | `2986a7cb16d09de8970824d2dd58bf0bb021702c` | Sage, Cosmic, Violet, destaque e artigo |
| Neon    | `9df2ff42dd27ba657621c304557d1a855a4be6a5` | Neon, Ivory, promoção e artigo          |
| Golden  | `87580f2def9af0ce13f4b6f6ce17bb2449bcfc16` | Golden Beat, Signal, Frequency e artigo |

O fundo vetorial mobile foi exportado da camada `Mask Group` (nó `14:5290`) e salvo em `public/images/ui/mobile-hero-background.svg`.

Os quatro arquivos são reutilizados pelo próprio Figma. Derivados WebP/AVIF de 400 e 800 px estão em `public/images/nfts`. `scripts/optimize-images.mjs <diretório-dos-originais>` reproduz a otimização. Os PNGs originais permanecem na pasta de trabalho ignorada `.superpowers/figma-originals`.

## Evidência e limites

`e2e/15-figma-geometry.spec.ts` verifica medidas do topo e painel mobile. `e2e/00-layout.spec.ts` captura screenshots em 390, 768 e 1440 px e verifica ausência de transbordamento horizontal. A conferência das demais telas acompanha sua implementação; esta nota não declara paridade de telas ainda pendentes.

## Perfil e carteiras

Conferidos os frames `Desktop / Perfil do Colecionador` (`9:1238`) e `Desktop / Carteiras` (`9:1670`): coluna lateral de 310 px, intervalo de 28 px, formulário em duas colunas, rótulos de 14 px e campos de 40 px. Em 390 px os campos têm 44 px, ficam em uma coluna e a navegação da conta aparece acima do conteúdo; o arquivo não fornece um frame mobile dessas páginas.

O perfil usa ações separadas “Salvar perfil” e “Alterar senha”, para cada resposta da API ter um resultado explícito. O avatar permite alterar e remover; a imagem válida é normalizada para WebP de até 512 px antes do envio, para caber no armazenamento da simulação.

`e2e/08-account.spec.ts` captura perfil/carteiras nos dois projetos, verifica ausência de transbordamento, campos mobile de pelo menos 44 px, persistência e isolamento das alterações pendentes ao trocar de conta.

## Ajustes finos após comparação do carrinho

Inspeção dos nós `16:403`/`16:404`: círculos visíveis de 24 px, fundo `Surface Raised` (`#2F1D15`), borda `#3F2319`; áreas de toque de 44 px. O ícone de remover usa `Primary` (`#D28A4C`), conforme `16:463`. O título do item mobile usa 15 px/16, edição 14 px/16 e preço 18 px/16 (`16:429`, `22:1316`, `16:435`).

“Taxa estimada” (`16:1013`) fica à direita, sob o valor, em 12 px/16, `Text Accent` (`#E89B55`). O resumo mobile (`70397:245`) tem raio superior de 40 px e padding 24/24/36/24. O campo do cupom tem 50 px, fundo `Surface Card`, borda `Border` e sombra 0/6/20 com `#0A0604` a 45%.

O gradiente original do botão (`70397:251`) foi exportado em SVG, preservando os pontos `(-11.2041, -12)` → `(424.636, 136.878)` e as opacidades de 100%/80% de `#D28A4C`. `public/images/ui/primary-button-gradient.svg` contém apenas o fundo vetorial; o rótulo continua como texto HTML. O CTA do carrinho mobile tem 60 px.

A legenda global `Text Secondary` foi corrigida para `#CFB28C`, confirmada no painel Properties. Controles de compra e cupom reutilizam o fundo original. Enquanto a API atualiza os valores, “Total estimado” identifica a estimativa sem alterar a altura do resumo.

A lixeira permanece como ação visível em cada item. Os controles de quantidade mobile ficam na faixa inferior para preservar áreas de toque separadas da remoção.

## Conferência de todas as telas implementadas

| Tela      | Referência conferida                                  | Ajustes desta revisão                                                                                                                                                    |
| --------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Início    | `2:2`, `14:5226`                                      | Grade mobile com desnível de 32 px; dados da última linha Golden revisados; assets da Home preservados.                                                                  |
| Detalhe   | `10:244`, Mobile / Detalhes do NFT                    | Galeria desktop 573 × 448, quatro miniaturas de 100 px, imagem de 404 px em suporte de 444 px e intervalo de 32 px para o resumo; preço de 24 px e edições com contorno. |
| Carrinho  | Desktop / Carrinho de NFTs, Mobile / Carrinho de NFTs | Círculos, lixeira, legenda da taxa e gradiente original conforme seção acima.                                                                                            |
| Login     | `9:115`, `16:1022`                                    | Painel desktop 500 × 600, fundo Card, abas e borda inferior; marca branca de 32 px apenas no mobile; botões sociais empilhados.                                          |
| Cadastro  | `9:1022`, Mobile / Cadastro                           | Painel desktop 500 × 656, raio de 8 px; confirmação de senha e controles de exibição; título e ação mobile “Criar perfil”.                                               |
| Perfil    | `9:1238`                                              | Marcador lateral na borda do painel, botões de 12 px, prefixo ENS e campos de senha com controle de exibição alinhados à primeira coluna.                                |
| Carteiras | `9:1670`                                              | Campos de 40 px em desktop/44 px em mobile, prefixo ENS, ações de 12 px e navegação lateral compartilhada.                                                               |

Os nomes de nós internos do detalhe foram medidos diretamente: `70363:239` (galeria), `70342:2683` (suporte), `11:1161` (imagem). Login: `70381:239`; cadastro: `70383:239`; título mobile do cadastro: `16:1241`, fonte 18/16. O diálogo respeita a altura disponível e permite rolagem em telas menores.

O rodapé compartilhado (`70493:1151`) foi comparado: faixas desktop de 250/88/236/36 px, medalhões de 74 px com W/C/D e fundo Primary. Textos e tipografia foram ajustados. Os cinco ícones sociais vieram da exportação SVG original `Frame 113`, separados em arquivos de 32 px; os ícones de login também são SVGs originais Google/Facebook. `Text Coral` foi corrigido para `#F0805F`.

Alguns fundos de login/cadastro do Figma usam outras imagens e nomes na grade em relação ao frame principal da Home. O catálogo mantém uma associação única, usando as imagens da Home, para o mesmo NFT conservar sua identidade ao navegar. Os textos visíveis da última linha identificam Golden Beat (0,99), Golden Frequency (0,59) e Golden Signal (0,39 ETH). A revisão do catálogo salvo preserva contas, carteiras, carrinhos e pedidos; cotações antigas são invalidadas para nova confirmação do servidor.

Pagamento e recibo foram implementados após a revisão das demais rotas e comparados novamente com as referências. Os testes de recuperação e os estados transversais das tarefas 13–14 continuam como etapas separadas.

A medição final da Home confirmou sidebar de 310 px (`70410:3725`), grade de 842 px e três cards de 258 px distribuídos com 34 px entre eles. O suporte do card mede 258 × 300, a imagem 250 × 250 com raio de 15 px, e o card completo 356 px (`70342:2678`, `3:133`, `4:137`). As linhas têm intervalo de 72 px (`70342:2828`). As imagens são centralizadas nos suportes para manter a grade alinhada. O resumo desktop do detalhe acompanha os 448 px da galeria; a rede continua disponível na aba de detalhes.

## Pagamento e confirmação

Desktop pagamento (`11:2862`): formulário “Perfil do colecionador” em duas colunas e resumo lateral de 408 px. Rede/endereço/provedor exibem a carteira salva na API. O seletor de outra carteira usa os registros reais da conta; em mobile aparecem os cards e o formulário de dados fica expansível abaixo do resumo. O título cabe em uma linha em 390 px. Conectar e revisar cotação são controles explícitos adicionados para os estados funcionais previstos no desafio.

O modal de confirmação (`70376:239`) mede 578 px de largura e 821 px de altura para os três itens do desenho. A implementação mantém largura, selo de 80 px, título de 16 px, metadados em quatro colunas, tabela com imagens de 70 px, taxa/total à direita e borda inferior Primary. A altura acompanha os itens e respeita a viewport. Em mobile a confirmação ocupa a página, com metadados em duas colunas e imagens de 48 px. O link é identificado como simulado. Todos os valores e imagens vêm do snapshot imutável do pedido confirmado.

`e2e/06-purchase-happy-path.spec.ts` captura pagamento e recibo em desktop/mobile, além de validar o fluxo completo, campos, revisão após preço/estoque/expiração, conexão recusada/desconectada, cadastro de carteira com retorno e recuperação do rascunho após expiração da sessão.

## Fechamento visual e acessibilidade

Mercado recebe a cor Primary, sublinhado e `aria-current` no detalhe, carrinho e pagamento. Login devolve foco ao controle que o abriu após Esc; mensagens de campo são anunciadas uma vez e focam o primeiro erro. Skeletons nomeados têm papel de status válido. O recibo também passou por axe e overflow em desktop/mobile.

O rodapé mantém a faixa desktop de236px; espaçamento vertical e line-height foram compactados para que o último link fique inteiro dentro do fundo. A captura anterior deixava8px fora da faixa. Alvos mobile de44px foram preservados.

Oito baselines de Início/Detalhe/Carrinho/Pagamento estão em `e2e/__screenshots__/13-visual.spec.ts`, com relógio fixo, cenário padrão e fontes/assets carregados. Foram inspecionados contra as medidas/fontes/cores do Figma. Revisão automática complementa a referência; controles adicionais de cotação/conexão e estados simulados continuam como diferenças funcionais documentadas.

## Conferência complementar de 23/10: os 15 frames

Foram exportados do arquivo original os nove frames desktop (1440 px) e os seis mobile (414 × 896). A comparação usa estados reais da aplicação: visitante com carrinho, login/cadastro, conta autenticada, pagamento revisado e recibo confirmado. O relógio dos dados foi iniciado em 29/07/2026; compra, API e Socket.IO continuam funcionando normalmente. Capturas são feitas depois de carregar fontes/imagens, remover foco transitório e voltar ao topo. O [índice de evidências](../reports/design/README.md) identifica referência e implementação para cada tela.

Ajustes confirmados nesta rodada:

- Home: posição do texto do hero, espaçamento das abas, coluna mobile deslocada 32 px, margem dos nomes dos cards, selo RARO e coração visível de 28 px dentro de alvo de 44 px.
- Carrinho: títulos/valores desktop de 16 px, cabeçalho do resumo de 18 px, coluna lateral de 332 px, valores de subtotal/taxa de 18 px e rótulos de 14 px. A legenda da taxa mantém 12/16 e a cor Accent já medida.
- Login/cadastro: raio mobile do botão de 12 px e texto inferior de 14 px. Ícones sociais originais mantidos.
- Perfil/carteiras/pagamento: labels e campos desktop de 14 px, navegação da conta de 14 px, cards mobile e indicadores de seleção legíveis. O resumo de pagamento tem cabeçalhos e linhas com fundo Card.
- Detalhe: rótulo Qtd., botão mobile de 196 × 60 px e cesto circular de 60 px, cores compartilhadas do desenho. O desktop mantém a ação adicional de adicionar sem navegar.
- Recibo: removido espaço extra criado pela descrição acessível, tipografia desktop dos metadados/itens ajustada e identidade da compra preservada no snapshot.

**A conferência não declara igualdade absoluta de pixels.** As diferenças remanescentes foram identificadas:

| Diferença                                                                                  | Tratamento                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Controles menores que 44 px no desenho; ícones e pontos do carrossel mais próximos.        | Áreas de toque de 44 px e foco preservados; vetores principais substituídos pelos SVGs originais na revisão complementar. Os três pontos não são aproximados sobre regiões clicáveis de outro botão. |
| Frames usam imagens, ordem, edições, tokens e contas diferentes para o mesmo nome de NFT.  | Identidade e ordenação únicas da API, estoque válido e dados da conta autenticada; não mudar valores conforme a rota.                                                                                |
| Carrinho mobile desenha subtotal 8,92/total 8,936, mas seus itens somam 8,14.              | Exibir 8,14 + 0,016 = 8,156 ETH. Desktop reproduz 26,83 + 0,016 = 26,846 ETH.                                                                                                                        |
| Login social, páginas editoriais e itens auxiliares do menu.                               | Mostrar indisponibilidade explícita; textos editoriais e metadados são fixtures da API.                                                                                                              |
| Login/cadastro mostram formulário sobre catálogo com conteúdos distintos em cada frame.    | Fundo mantém o catálogo canônico, overlay acessível e botão de fechar.                                                                                                                               |
| Perfil desenha um único Salvar; checkout não mostra revisão/conexão/recuperação separadas. | Ações independentes e confirmação explícita continuam; são estados funcionais exigidos e têm testes.                                                                                                 |
| Detalhe apresenta textos longos e links sociais específicos no desenho.                    | Descrição e atributos vêm dos contratos, com abas e compartilhamento nativo/fallback. Não há reprodução literal dos parágrafos editoriais de todos os frames.                                        |
| Recibo desenhado em posição fixa e sem indicador de simulação.                             | Centralizado na viewport, rolável conforme quantidade e com marcador “simulado”; dados reais do pedido local.                                                                                        |
| Perfil, carteiras e recibo sem referência mobile no arquivo.                               | Adaptação responsiva exercitada em 320, 360, 375, 390 e 414 px; não existe frame equivalente para alegar igualdade.                                                                                  |

Os oito baselines internos foram atualizados somente para as alterações acima e conferidos novamente pela suíte normal. Eles detectam regressão da implementação; não substituem os PNGs originais nem uma comparação manual.

## Revisão complementar: ícones, imagens e textos mobile

Revisão solicitada após a publicação na Railway. A referência continua sendo o arquivo original; os vetores foram exportados como SVG com IDs de camada, sem reconstruir desenhos a partir de screenshots. A [proveniência dos ícones](../reports/design/icons.json) identifica os 24 símbolos e suas camadas. O sprite compartilhado preserva paths, máscaras, preenchimentos e traços, usando `currentColor` para os estados dos controles.

### Problemas encontrados e correções

| Problema anterior                                                                                                                                 | Correção                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ícones Lucide divergiam dos desenhos do cabeçalho, navegação mobile, busca, filtro, favoritos, setas, lixeira e conta.                            | Substituição pelos vetores exportados. A barra mobile também recebe o fundo com recorte central e a ação elevada do original. Controles sem equivalente no Figma, como compartilhamento nativo e olho aberto, continuam funcionais. |
| Lixeira desktop tinha a cor do frame mobile.                                                                                                      | Desktop usa Secondary `#B39463`, confirmado no SVG; mobile mantém Primary `#D28A4C`.                                                                                                                                                |
| Nomes de NFTs eram truncados, inclusive em cards de 414 px; preço e quantidade do carrinho tinham posições fixas que colidiam em telas estreitas. | Nomes podem quebrar linha; itens têm altura adaptável. Abaixo de 390 px os controles ocupam uma faixa própria.                                                                                                                      |
| Texto e CTA do hero competiam por espaço; o bloco do texto cobria indicadores do carrossel.                                                       | Altura mínima de 190 px com crescimento conforme conteúdo, CTA no fluxo e áreas clicáveis separadas. Indicadores vão para a direita abaixo de 390 px. O fundo vetorial acompanha a altura disponível.                               |
| Imagens do diário usavam proporção 1,6, enquanto a referência mede 268 × 195.                                                                     | Proporção 268/195; fotos de promoções usam o enquadramento 292/250 e ficam acima do texto em telas pequenas.                                                                                                                        |
| Hover ampliava a arte dos NFTs e a miniatura do hero tinha uma borda que reduzia a área da imagem.                                                | Zoom removido; miniatura de 58 px sem borda e raio de 16 px, conforme exportação mobile. Os quatro bitmaps originais foram comparados com as imagens embutidas no SVG: hashes SHA-256 idênticos.                                    |
| Rodapé e abas não acomodavam algumas palavras em 320 px.                                                                                          | Rodapé com uma coluna abaixo de 390 px e abas com quebra de linha.                                                                                                                                                                  |
| Carteira, resumo e metadados ocultavam parte dos textos; tabela do recibo estourava a viewport de 320 px.                                         | Quebra de palavras/endereço, colunas proporcionais no recibo, valores e datas sem elipse. ID de transação continua abreviado intencionalmente, com valor completo acessível.                                                        |

### Verificação e limites

`e2e/21-mobile-text.spec.ts` percorre Home, detalhe, carrinho, login, cadastro, perfil, carteiras, pagamento e recibo em **320, 360, 375, 390 e 414 px**. Verifica os retângulos dos textos, recorte por ancestrais, largura da página, separação entre título/remoção e descrição/CTA, além de clicar nos três destaques. As verificações de imagens cobrem proporção editorial, ausência de zoom no hover e carregamento dos símbolos SVG. A revisão por `code-reviewer` não deixou achados acionáveis pendentes.

A matriz usa Chromium e dados da simulação. Safari/Firefox não foram validados nesta rodada. Textos podem ocupar mais linhas e telas estreitas podem crescer verticalmente; isso é intencional para preservar a leitura. Não se declara igualdade absoluta de pixels. Os resultados de Lighthouse anteriores continuam vinculados aos respectivos commits, sem atribuí-los automaticamente a este novo build.

## Gradientes e favorito — revisão complementar

A [revisão do frontend](FRONTEND-REVIEW.md) registra os tokens adicionados para filtros, cards mobile, detalhe, navegação, oferta lateral e CTAs. Os fundos sólidos indevidos foram corrigidos usando os stops/direções dos SVGs exportados. A posição do favorito acompanha a imagem e seu comportamento distingue mouse/teclado de toque. No celular o controle permanece disponível sem hover. `e2e/22-design-tokens.spec.ts` verifica gradientes renderizados, alinhamento, alvo de toque, revelação por hover/foco e navegação para login.

## Correção após o apontamento em `/nfts/nft-002`

A [revisão detalhada](DETAIL-REVIEW.md) documenta os erros restantes nas estrelas, favoritos, tipografia, galeria, abas e componentes compartilhados. Ela substitui as medidas anteriores de24px para o preço e do controle desktop do carrinho, que estavam incorretas. Inclui os limites de fidelidade, evidências do Figma e regressões novas.
