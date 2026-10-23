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
