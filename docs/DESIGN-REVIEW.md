# Conferência do Figma

Fonte: [Frontend Challenge](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge). Inspeção direta em 22/10/2026, painel Properties e canvas desktop/mobile.

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

A grade mobile tem duas colunas alinhadas, conforme a normalização prevista no plano. Áreas de toque continuam com pelo menos 44 px, mesmo onde o desenho apresenta controles menores.

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

Conferidos os frames `Desktop / Perfil do Colecionador` (`9:1238`) e `Desktop / Carteiras` (`9:1670`): coluna lateral de 310 px, intervalo de 28 px, formulário em duas colunas, rótulos de 12 px e campos de 40 px. Em 390 px os campos têm 44 px, ficam em uma coluna e a navegação da conta aparece acima do conteúdo; o arquivo não fornece um frame mobile dessas páginas.

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
| Início    | `2:2`, `14:5226`                                      | Grade mobile alinhada; dados da última linha Golden revisados; assets da Home preservados.                                                                               |
| Detalhe   | `10:244`, Mobile / Detalhes do NFT                    | Galeria desktop 573 × 448, quatro miniaturas de 100 px, imagem de 404 px em suporte de 444 px e intervalo de 32 px para o resumo; preço de 24 px e edições com contorno. |
| Carrinho  | Desktop / Carrinho de NFTs, Mobile / Carrinho de NFTs | Círculos, lixeira, legenda da taxa e gradiente original conforme seção acima.                                                                                            |
| Login     | `9:115`, `16:1022`                                    | Painel desktop 500 × 600, fundo Card, abas e borda inferior; marca branca de 32 px apenas no mobile; botões sociais empilhados.                                          |
| Cadastro  | `9:1022`, Mobile / Cadastro                           | Painel desktop 500 × 656, raio de 8 px; confirmação de senha e controles de exibição; título e ação mobile “Criar perfil”.                                               |
| Perfil    | `9:1238`                                              | Marcador lateral na borda do painel, botões de 12 px, prefixo ENS e campos de senha com controle de exibição alinhados à primeira coluna.                                |
| Carteiras | `9:1670`                                              | Campos de 40 px em desktop/44 px em mobile, prefixo ENS, ações de 12 px e navegação lateral compartilhada.                                                               |

Os nomes de nós internos do detalhe foram medidos diretamente: `70363:239` (galeria), `70342:2683` (suporte), `11:1161` (imagem). Login: `70381:239`; cadastro: `70383:239`; título mobile do cadastro: `16:1241`, fonte 18/16. O diálogo respeita a altura disponível e permite rolagem em telas menores.

O rodapé compartilhado (`70493:1151`) foi comparado: faixas desktop de 250/88/236/36 px, medalhões de 74 px com W/C/D e fundo Primary. Textos e tipografia foram ajustados. Os cinco ícones sociais vieram da exportação SVG original `Frame 113`, separados em arquivos de 32 px; os ícones de login também são SVGs originais Google/Facebook. `Text Coral` foi corrigido para `#F0805F`.

Alguns fundos de login/cadastro do Figma usam outras imagens e nomes na grade em relação ao frame principal da Home. O catálogo mantém uma associação única, usando as imagens da Home, para o mesmo NFT conservar sua identidade ao navegar. Os textos visíveis da última linha identificam Golden Beat (0,99), Golden Frequency (0,59) e Golden Signal (0,39 ETH). A revisão do catálogo salvo preserva contas, carteiras, carrinhos e pedidos; cotações antigas são invalidadas para nova confirmação do servidor.

Pagamento e recibo tiveram suas referências inspecionadas e os assets necessários exportados; a conferência da implementação acompanha as tarefas 12–14. Não são declarados concluídos nesta revisão das rotas já disponíveis.

A medição final da Home confirmou sidebar de 310 px (`70410:3725`), grade de 842 px e três cards de 258 px distribuídos com 34 px entre eles. O suporte do card mede 258 × 300, a imagem 250 × 250 com raio de 15 px, e o card completo 356 px (`70342:2678`, `3:133`, `4:137`). As linhas têm intervalo de 72 px (`70342:2828`). As imagens são centralizadas nos suportes para manter a grade alinhada. O resumo desktop do detalhe acompanha os 448 px da galeria; a rede continua disponível na aba de detalhes.
