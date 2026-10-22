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
